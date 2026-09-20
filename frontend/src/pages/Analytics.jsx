import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import KPICard from "../components/Analytics/KPICard";
import IndustryChart from "../components/Analytics/IndustryChart";
import RatingChart from "../components/Analytics/RatingChart";
import StatusChart from "../components/Analytics/StatusChart";
import TopBusinesses from "../components/Analytics/TopBusinesses";

import { getAnalytics } from "../services/businessService";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-16 px-6">
          <h2 className="text-2xl font-bold text-[#233554]">
            Loading analytics...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-16 px-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-4xl font-extrabold text-[#233554]">
              Analytics Dashboard
            </h1>

            <p className="mt-2 text-lg text-gray-600">
              Explore business insights, ratings and industry trends across Jodhpur.
            </p>

          </div>

        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

          <KPICard
            title="Businesses"
            value={analytics.summary.businesses}
          />

          <KPICard
            title="Industries"
            value={analytics.summary.industries}
          />

          <KPICard
            title="Average Rating"
            value={`⭐ ${analytics.summary.rating}`}
          />

          <KPICard
            title="Open Businesses"
            value={analytics.summary.open}
          />

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">

          <IndustryChart
            data={analytics.industry_distribution}
          />

          <RatingChart
            data={analytics.rating_distribution}
          />

          <StatusChart
            summary={analytics.summary}
          />

          <TopBusinesses
            businesses={analytics.top_businesses}
          />

        </div>

      </div>
    </MainLayout>
  );
}

export default Analytics;