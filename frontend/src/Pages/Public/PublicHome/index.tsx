import FeaturesList from "@/Pages/Public/PublicHome/Components/FeaturesList";
import CTASection from "@/Pages/Public/PublicHome/Components/CTASection";
import ExploreCategories from "@/Pages/Public/PublicHome/Components/ExploreCategories";
import HomeHero from "@/Pages/Public/PublicHome/Components/HomeHero";
import HomeHowToplay from "@/Pages/Public/PublicHome/Components/HomeHowToplay";

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
