import { useEffect, useMemo, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import BusinessMap from "../components/Map/BusinessMap";
import MapSidebar from "../components/Map/MapSidebar";

import {
  getAllBusinessesForMap,
  getIndustries,
} from "../services/businessService";

function MapView() {
  const [businesses, setBusinesses] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const businessData = await getAllBusinessesForMap();
      const industryData = await getIndustries();

      setBusinesses(businessData);
      setIndustries(industryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.business_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "All" ||
        business.category === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });
  }, [businesses, search, selectedIndustry]);

  if (loading) {
    return (
      <MainLayout>
        <div className="py-16">
          <h2 className="text-2xl font-bold">Loading Map...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-10">

        <h1 className="text-4xl font-extrabold text-[#233554] mb-2">
          Business Intelligence Map
        </h1>

        <p className="text-gray-600 mb-8">
          Explore businesses across Jodhpur.
        </p>

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-4">

            <MapSidebar
              businesses={filteredBusinesses}
              search={search}
              setSearch={setSearch}
              industries={industries}
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              onBusinessClick={setSelectedBusiness}
            />

          </div>

          <div className="col-span-8">

            <BusinessMap
              businesses={filteredBusinesses}
              selectedBusiness={selectedBusiness}
            />

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default MapView;