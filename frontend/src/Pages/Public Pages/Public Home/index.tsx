import FeaturesList from "@/Pages/Public Pages/Public Home/Components/FeaturesList";
import CTASection from "@/Pages/Public Pages/Public Home/Components/CTASection";
import ExploreCategories from "@/Pages/Public Pages/Public Home/Components/ExploreCategories";
import HomeHero from "@/Pages/Public Pages/Public Home/Components/HomeHero";
import HomeHowToplay from "@/Pages/Public Pages/Public Home/Components/HomeHowToplay";

const PublicHome = () => {
  return (
    <>
      <HomeHero />
      <HomeHowToplay />
      <ExploreCategories />
      <FeaturesList />
      <CTASection />
    </>
  );
};

export default PublicHome;
