import { useEffect, useState } from "react";
import BusinessCard from "./BusinessCard";
import { getFeaturedBusinesses } from "../../services/businessService";

function FeaturedBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, []);

  const fetchFeaturedBusinesses = async () => {
    try {
      const data = await getFeaturedBusinesses();
      setBusinesses(data);
    } catch (error) {
      console.error("Error fetching featured businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-4xl font-bold text-[#233554]">
          Top Rated Businesses
        </h2>

        <p className="mt-2 text-gray-600">
          Loading businesses...
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h2 className="text-4xl font-bold text-[#233554]">
            Top Rated Businesses
          </h2>

          <p className="mt-2 text-gray-600 font-medium">
            Recommended companies from our database.
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {businesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedBusinesses;