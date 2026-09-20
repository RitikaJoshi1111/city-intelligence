const API = "http://127.0.0.1:8000";

// ========================
// Get All Businesses
// ========================

export async function getBusinesses() {
  const response = await fetch(`${API}/businesses`);

  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
  }

  return await response.json();
}

// ========================
// Search Businesses
// ========================

export async function searchBusinesses(query) {
  const response = await fetch(
    `${API}/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return await response.json();
}

// ========================
// Get Single Business
// ========================

export async function getBusiness(id) {
  const response = await fetch(`${API}/businesses/${id}`);

  if (!response.ok) {
    throw new Error("Business not found");
  }

  return await response.json();
}

// ========================
// Get Dashboard Stats
// ========================

export async function getStats() {
  const response = await fetch(`${API}/stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  const data = await response.json();

  return {
    businesses: data.businesses,
    industries: data.industries,
    rating: data.rating,
    open: data.open,
  };
}

// ========================
// Get Featured Businesses
// ========================

export async function getFeaturedBusinesses() {
  const response = await fetch(`${API}/featured`);

  if (!response.ok) {
    throw new Error("Failed to fetch featured businesses");
  }

  return await response.json();
}

// ========================
// Get Industries
// ========================

export async function getIndustries() {
  const response = await fetch(`${API}/industries`);

  if (!response.ok) {
    throw new Error("Failed to fetch industries");
  }

  return await response.json();
}

// ========================
// Filter Businesses
// ========================

export async function filterBusinesses(industry) {
  const response = await fetch(
    `${API}/filter?industry=${encodeURIComponent(industry)}`
  );

  if (!response.ok) {
    throw new Error("Failed to filter businesses");
  }

  return await response.json();
}

// ========================
// Get Analytics
// ========================
export const getAnalytics = async () => {
    const response = await fetch(`${API}/analytics`);

    if (!response.ok) {
        throw new Error("Failed to fetch analytics");
    }

    return await response.json();
};

export async function getAllBusinessesForMap() {
  const response = await fetch(`${API}/businesses`);

  if (!response.ok) {
    throw new Error("Failed to fetch businesses");
  }

  return await response.json();
}
