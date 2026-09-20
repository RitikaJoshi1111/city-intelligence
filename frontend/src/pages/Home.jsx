import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/Hero/HeroSection";
import StatsSection from "../components/Cards/StatsSection";
import IndustrySection from "../components/Industry/IndustrySection";
import FeaturedBusinesses from "../components/Cards/FeaturedBusinesses";

function Home() {
  return (
    <MainLayout>

      <HeroSection />

      <StatsSection />

      <IndustrySection />

      <FeaturedBusinesses />

    </MainLayout>
  );
}

export default Home;