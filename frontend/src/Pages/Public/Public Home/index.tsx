import FeaturesList from "@/Pages/Public/Public Home/Components/FeaturesList";
import CTASection from "@/Pages/Public/Public Home/Components/CTASection";
import ExploreCategories from "@/Pages/Public/Public Home/Components/ExploreCategories";
import HomeHero from "@/Pages/Public/Public Home/Components/HomeHero";
import HomeHowToplay from "@/Pages/Public/Public Home/Components/HomeHowToplay";

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
