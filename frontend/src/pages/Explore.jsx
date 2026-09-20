import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import ExploreSearch from "../components/Search/ExploreSearch";
import BusinessGrid from "../components/Cards/BusinessGrid";
import IndustryFilters from "../components/Search/IndustryFilters";

import {
  getBusinesses,
  searchBusinesses,
  getIndustries,
  filterBusinesses,
} from "../services/businessService";

function Explore() {

  const [businesses, setBusinesses] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  useEffect(() => {
    loadBusinesses();
    loadIndustries();
  }, []);

  const loadBusinesses = async () => {
    const data = await getBusinesses();
    console.log("Businesses:", data);
    setBusinesses(data);
  };

  const loadIndustries = async () => {
    const data = await getIndustries();
    setIndustries(data);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      await loadBusinesses();
      return;
    }

    const data = await searchBusinesses(query);

    console.log("Search Result:", data);
    console.log("Length:", data.length);
    console.log("First Business:", data[0]);

    setBusinesses(data);
  };

  const handleIndustryFilter = async (industry) => {
    setSelectedIndustry(industry);

    const data = await filterBusinesses(industry);
    setBusinesses(data);
  };

  return (

    <MainLayout>

      <section className="py-16">

        <h1 className="text-5xl font-black text-[#233554]">
          Explore Businesses
        </h1>

        <p className="mt-3 text-lg text-gray-600">
          Search manufacturers, suppliers and exporters.
        </p>

        <div className="mt-10">

          <ExploreSearch
            onSearch={handleSearch}
          />

          <IndustryFilters
            industries={industries}
            selected={selectedIndustry}
            onSelect={handleIndustryFilter}
          />

        </div>

        <div className="mt-14">

          <BusinessGrid
            businesses={businesses}
          />

        </div>

      </section>

    </MainLayout>

  );

}

export default Explore;