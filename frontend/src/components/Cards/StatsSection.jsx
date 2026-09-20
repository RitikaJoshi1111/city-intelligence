import { useEffect, useState } from "react";
import Section from "../Common/Section";
import StatsCard from "./StatsCard";
import { getStats } from "../../services/businessService";

function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="text-center py-12 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <Section
      title="Business Snapshot"
      subtitle="Quick overview of the Jodhpur business ecosystem."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="Businesses"
          value={stats.businesses}
          subtitle="Companies"
        />

        <StatsCard
          title="Industries"
          value={stats.industries}
          subtitle="Categories"
        />

        <StatsCard
          title="Average Rating"
          value={`${stats.rating} ⭐`}
          subtitle="Google Reviews"
        />

        <StatsCard
          title="Open"
          value={stats.open}
          subtitle="Businesses"
        />

      </div>
    </Section>
  );
}

export default StatsSection;