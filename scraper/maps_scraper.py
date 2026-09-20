import asyncio
import csv
import logging
import os
import re
import time
import urllib.parse
from dataclasses import dataclass, fields, asdict
from typing import Optional
from scraper.models import BusinessRecord
from scraper.progress_manager import load_progress, save_progress
from database.repository import BusinessRepository

import pandas as pd
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout
from services.pipeline import process_record
from config.config import (
    CITY,
    HEADLESS,
    OUTPUT_FOLDER,
    SCROLL_PAUSE_MS,
    MAX_SCROLL_ROUNDS,
    DETAIL_TIMEOUT_MS,
    MAX_RETRIES,
    RETRY_DELAY_SEC,
    MAX_RESULTS_PER_QUERY,
    RESUME_SCRAPING,
)
def load_search_queries():
    """
    Read industry taxonomy and generate search queries.
    """

    df = pd.read_csv("data/industry_taxonomy.csv")

    search_queries = []

    for _, row in df.iterrows():

        search_queries.append({
            "industry": row["industry"],
            "subcategory": row["subcategory"],
            "priority": row["priority"],
            "query": f"{row['subcategory']} in {CITY}"
        })

    return search_queries

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("jodhpur_scraper")


def _safe_float(text: str) -> Optional[float]:
    """Convert a string like '4.3' to float, return None on failure."""
    try:
        return float(text.strip().replace(",", "."))
    except (ValueError, AttributeError):
        return None


def _safe_int(text: str) -> Optional[int]:
    """Strip non-digit characters and convert to int, e.g. '(1,234)' → 1234."""
    try:
        digits = re.sub(r"[^\d]", "", text)
        return int(digits) if digits else None
    except (ValueError, AttributeError):
        return None


def _extract_lat_lng(url: str):
    """
    Pull latitude & longitude from a Google Maps URL.
    Example URL fragment:  @26.2389,73.0243,17z
    Returns (lat, lng) as floats, or (None, None).
    """
    match = re.search(r"@(-?\d+\.\d+),(-?\d+\.\d+)", url)
    if match:
        return float(match.group(1)), float(match.group(2))
    # Fallback: look for !3d and !4d parameters used in place URLs
    lat_m = re.search(r"!3d(-?\d+\.\d+)", url)
    lng_m = re.search(r"!4d(-?\d+\.\d+)", url)
    if lat_m and lng_m:
        return float(lat_m.group(1)), float(lng_m.group(1))
    return None, None

async def search_businesses(page: Page, query: str) -> None:
    """
    Step 1 – Navigate to Google Maps and type the search query.

    Args:
        page  : Playwright page object (an open browser tab).
        query : Search string, e.g. "Furniture Manufacturers in Jodhpur".
    """
    
    log.info(f"🔍  Searching: '{query}'")
    encoded = urllib.parse.quote_plus(query)
    url = f"https://www.google.com/maps/search/{encoded}"
    await page.goto(url, wait_until="domcontentloaded")

    # Wait for the results panel on the left side to appear.
    # The results list lives inside a div with role="feed".
    try:
        await page.wait_for_selector('div[role="feed"]', timeout=15_000)
        log.info("    Results panel loaded.")
    except PWTimeout:
        log.warning("   Results panel not found — page may have loaded differently.")


async def scroll_results(page: Page) -> list[str]:
    """
    Step 2 – Scroll the left-hand results panel until no new results load.

    Google Maps uses infinite scroll: new cards are appended as you scroll.
    We keep scrolling until either:
      • The "You've reached the end of the list" notice appears, OR
      • No new result links appear after a scroll (stagnant count), OR
      • We hit MAX_SCROLL_ROUNDS (safety valve).

    Returns:
        A list of unique href URLs pointing to individual business listings.
    """
    log.info("   📜  Scrolling through results …")

    # The scrollable container is the div[role="feed"] element.
    feed_selector = 'div[role="feed"]'
    seen_urls: set[str] = set()
    previous_count = 0
    stagnant_rounds = 0

    for scroll_round in range(MAX_SCROLL_ROUNDS):
        
        links = await page.query_selector_all('a[href*="/maps/place/"]')
        for link in links:
            href = await link.get_attribute("href")
            if href:
                seen_urls.add(href)

        current_count = len(seen_urls)
        if current_count >= MAX_RESULTS_PER_QUERY:
            log.info(f"Reached limit of {MAX_RESULTS_PER_QUERY} businesses.")
            break
        log.info(f"      Round {scroll_round + 1:>2}: {current_count} listings found so far")

        end_notice = await page.query_selector('span.HlvSq')   
        if end_notice:
            log.info("   🏁  Reached end of results list.")
            break

        if current_count == previous_count:
            stagnant_rounds += 1
            if stagnant_rounds >= 3:
                log.info("   🏁  No new results after 3 scroll rounds — assuming complete.")
                break
        else:
            stagnant_rounds = 0

        previous_count = current_count

    
        await page.evaluate(
            """
            const feed = document.querySelector('div[role="feed"]');
            if (feed) feed.scrollTop = feed.scrollHeight;
            """
        )
        # Pause to allow lazy-loaded content to arrive
        await page.wait_for_timeout(SCROLL_PAUSE_MS)

    unique_urls = list(seen_urls)
    log.info(f"   Scrolling complete — {len(unique_urls)} unique listings collected.\n")
    return unique_urls


async def extract_business_data(page: Page, listing_url: str) -> Optional[BusinessRecord]:
    """
    Step 3 – Open one business listing and extract all required fields.

    Uses CSS selectors and aria-label attributes that Google Maps currently
    uses (as of mid-2025).  Wrapped in retry logic so transient errors are
    handled automatically.

    Args:
        page        : Playwright page object.
        listing_url : Full Google Maps URL for the business.

    Returns:
        A populated BusinessRecord, or None if extraction failed after retries.
    """
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            # Navigate to the individual listing page
            await page.goto(listing_url, wait_until="domcontentloaded", timeout=30_000)

            # Wait for the business name heading to confirm the page is ready
            await page.wait_for_selector('h1.DUwDvf', timeout=DETAIL_TIMEOUT_MS)

            record = BusinessRecord()
            record.google_maps_url = page.url   # Use final URL (after any redirects)

            # ── Business Name ────────────────────────────────────────────────
            name_el = await page.query_selector("h1.DUwDvf")
            if name_el:
                record.business_name = (await name_el.inner_text()).strip()

            # ── Category ─────────────────────────────────────────────────────
            # The category sits in a button or span immediately below the name
            cat_el = await page.query_selector('button.DkEaL')
            if not cat_el:
                cat_el = await page.query_selector('span.DkEaL')
            if cat_el:
                record.category = (await cat_el.inner_text()).strip()

            # ── Rating & Review Count ─────────────────────────────────────────
            # Rating looks like "4.3 stars" aria-label on a span
            rating_el = await page.query_selector('span[aria-label*="stars"]')
            if rating_el:
                aria = await rating_el.get_attribute("aria-label") or ""
                # e.g. "4.3 stars  1,234 reviews"
                rating_match = re.search(r"([\d.]+)\s+stars", aria)
                review_match = re.search(r"([\d,]+)\s+review", aria)
                if rating_match:
                    record.rating = _safe_float(rating_match.group(1))
                if review_match:
                    record.review_count = _safe_int(review_match.group(1))

            # ── Address ───────────────────────────────────────────────────────
            # Address button has a data-item-id starting with "address"
            addr_el = await page.query_selector('button[data-item-id="address"]')

            if addr_el:

                aria = await addr_el.get_attribute("aria-label") or ""

                if "Address:" in aria:
                    record.address = aria.replace("Address:", "").strip()
                else:
                    record.address = (await addr_el.inner_text()).strip()

 # ── Phone Number ──────────────────────────────────────────────────

            phone_el = await page.query_selector('button[data-item-id*="phone"]')

            if not phone_el:
                phone_el = await page.query_selector('button[aria-label*="Phone"]')

            if not phone_el:
                phone_el = await page.query_selector('button[aria-label*="phone"]')

            if phone_el:

                aria = await phone_el.get_attribute("aria-label") or ""

                phone_match = re.search(
                    r'(\+?\d[\d\s()-]{7,}\d)',
                    aria
                )

                if phone_match:
                    record.phone = phone_match.group(1).strip()

            # ── Website ───────────────────────────────────────────────────────
            web_el = await page.query_selector('a[data-item-id="authority"]')
            if not web_el:
                web_el = await page.query_selector('a[aria-label*="website" i]')
            if web_el:
                record.website = await web_el.get_attribute("href") or ""

            # ── Open/Closed Status & Opening Hours ───────────────────────────
            # The status chip (Open / Closed) lives in a span under the hours section
            status_el = await page.query_selector('span.ZDu9vd > span')
            if status_el:
                record.status = (await status_el.inner_text()).strip()

            # Opening hours: expand the dropdown if it exists, then collect rows
            hours_btn = await page.query_selector('div[data-hide-tooltip-on-mouse-move="true"]')
            if hours_btn:
                await hours_btn.click()
                await page.wait_for_timeout(600)

            hours_rows = await page.query_selector_all('tr.y0skZc')
            hours_list = []
            for row in hours_rows:
                day_el  = await row.query_selector('td.ylH6lf')
                time_el = await row.query_selector('td.mxowUb')
                if day_el and time_el:
                    day  = (await day_el.inner_text()).strip()
                    time = (await time_el.inner_text()).strip().replace("\n", ", ")
                    hours_list.append(f"{day}: {time}")
            record.opening_hours = " | ".join(hours_list)

            # ── Business Description ──────────────────────────────────────────
            desc_el = await page.query_selector('div[class*="PYvSYb"]')
            if not desc_el:
                desc_el = await page.query_selector('div.lfPIob')
            if desc_el:
                record.description = (await desc_el.inner_text()).strip()

            # ── Latitude & Longitude (from the final URL) ─────────────────────
            record.latitude, record.longitude = _extract_lat_lng(record.google_maps_url)

            return record   # ✅ Success — return the populated record

        except PWTimeout:
            log.warning(f"   ⏱  Timeout on attempt {attempt}/{MAX_RETRIES}: {listing_url[:80]}")
        except Exception as exc:
            log.warning(f"    Error on attempt {attempt}/{MAX_RETRIES}: {exc}")

        if attempt < MAX_RETRIES:
            await asyncio.sleep(RETRY_DELAY_SEC)

    log.error(f"    Giving up on: {listing_url[:80]}")
    return None


def save_to_csv(records: list[BusinessRecord], filepath: str) -> None:
    """
    Step 4 – Deduplicate records and write them to a CSV file using pandas.

    Deduplication is done on (business_name + address) to avoid double-entries
    that can arise when the same listing appears in multiple search queries.

    Args:
        records  : List of BusinessRecord objects to save.
        filepath : Destination CSV path, e.g. "jodhpur_businesses.csv".
    """
    if not records:
        log.warning("No records to save!")
        return

    # Convert dataclass objects → list of dicts → DataFrame
    column_names = [f.name for f in fields(BusinessRecord)]
    rows = [asdict(r) for r in records]
    df = pd.DataFrame(rows, columns=column_names)

    # ── Deduplicate ───────────────────────────────────────────────────────────
    before = len(df)
    df.drop_duplicates(subset=["business_name", "address"], keep="first", inplace=True)
    df.reset_index(drop=True, inplace=True)
    after = len(df)
    if before != after:
        log.info(f"   🧹  Removed {before - after} duplicate entries.")

    # ── Write CSV ─────────────────────────────────────────────────────────────
    df.to_csv(filepath, index=False, encoding="utf-8-sig")   # utf-8-sig for Excel compatibility
    log.info(f"   💾  Saved {after} records → {os.path.abspath(filepath)}")

async def run_scraper() -> None:
    """
    Orchestrates the entire scraping pipeline:
      1. Launch Playwright browser
      2. For every search query → search → scroll → extract each listing
      3. Aggregate all records → deduplicate → save CSV
      4. Print summary statistics
    """
    start_time = time.time()
    all_records = []
    repository = BusinessRepository()

    visited_urls = set()

    search_queries = load_search_queries()

    if RESUME_SCRAPING:
        completed_queries = load_progress()
    else:
        completed_queries = []

    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    async with async_playwright() as pw:
        # ── Launch browser ────────────────────────────────────────────────────
        browser = await pw.chromium.launch(
            headless=HEADLESS,
            args=["--lang=en-US"],    # Force English UI so selectors work reliably
        )
        context = await browser.new_context(
            locale="en-US",
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        # ── Loop over every search query ──────────────────────────────────────
        print("\nGenerated Search Queries:\n")

        for item in search_queries:
            print(item["query"])
            
        for query_idx, item in enumerate(search_queries, start=1):

            query = item["query"]



            industry = item["industry"]
            subcategory = item["subcategory"]
            priority = item["priority"]

            industry = item["industry"]
            subcategory = item["subcategory"]
            priority = item["priority"]

            query = item["query"]
            industry = item["industry"]
            subcategory = item["subcategory"]
            priority = item["priority"]

            log.info("=" * 70)
            log.info(f"[{query_idx}/{len(search_queries)}]")
            log.info(f"Industry    : {industry}")
            log.info(f"Subcategory : {subcategory}")
            log.info(f"Priority    : {priority}")
            log.info(f"Search      : {query}")
            log.info("=" * 70)
        # ── Loop over every search query ──────────────────────────────────────
        print("\nGenerated Search Queries:\n")

        for item in search_queries:
            print(item["query"])

        for query_idx, item in enumerate(search_queries, start=1):

            query = item["query"]
            industry = item["industry"]
            subcategory = item["subcategory"]
            priority = item["priority"]

            log.info("=" * 70)
            log.info(f"[{query_idx}/{len(search_queries)}]")
            log.info(f"Industry    : {industry}")
            log.info(f"Subcategory : {subcategory}")
            log.info(f"Priority    : {priority}")
            log.info(f"Search      : {query}")
            log.info("=" * 70)

            # Step 1: Navigate to Google Maps search results
            if query in completed_queries:
                log.info(f"⏭️ Skipping completed query: {query}")
                continue

            try:
                await search_businesses(page, query)
            except Exception as e:
                log.error(f"Search failed for {query}: {e}")

                completed_queries.append(query)
                save_progress(completed_queries)

                continue

            # Step 2: Scroll to collect all listing URLs
            listing_urls = await scroll_results(page)

            if not listing_urls:
                log.warning(f"⚠️ No listings found for query: '{query}'")
                continue

            # Step 3: Visit each listing and extract data
            query_records: list[BusinessRecord] = []

            for idx, url in enumerate(listing_urls, start=1):

                if url in visited_urls:
                    continue

                visited_urls.add(url)

                log.info(f"   [{idx:>3}/{len(listing_urls)}] Extracting: {url[:70]} …")

                record = await extract_business_data(page, url)

                if record:

                    record.industry = industry
                    record.subcategory = subcategory
                    record.search_query = query

                    from datetime import datetime
                    record.scraped_at = datetime.now()

                    if not record.category:
                        record.category = query.split(" in ")[0]

                    record = process_record(record)

                    query_records.append(record)

                    repository.save(record)

                    log.info(f"✅ {record.business_name}")

            log.info(f"\nCollected {len(query_records)} records for '{query}'\n")

            filename = query.replace(" ", "_").replace("/", "_") + ".csv"

            filepath = os.path.join(
                OUTPUT_FOLDER,
                filename
            )

            save_to_csv(query_records, filepath)

            print(f"Saved {len(query_records)} businesses to {filepath}")

            completed_queries.append(query)
            save_progress(completed_queries)

    # ── Step 4: Deduplicate + Save ────────────────────────────────────────────
    log.info("=" * 70)
    log.info("  Saving results …")
    log.info("=" * 70)

    # ── Final Summary ─────────────────────────────────────────────────────────
    elapsed = time.time() - start_time
    minutes, seconds = divmod(int(elapsed), 60)

    repository.close()
    await browser.close()

    print("\n" + "=" * 70)
    print("  SCRAPING COMPLETE")
    print("=" * 70)
    print(f"  Total execution time     : {minutes}m {seconds}s")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    asyncio.run(run_scraper())
