import CategoryHighlight from "@/Pages/Customer pages/Customer Home/components/CategoryHighlight";
import StoryHero from "@/Pages/Customer pages/Customer Home/components/StoryHero";
import TeamBattles from "@/Pages/Customer pages/Customer Home/components/Multiplayershow";
import HowToPlay from "@/Pages/Customer pages/Customer Home/components/HowToPlay";
import TestKnowledge from "@/Pages/Customer pages/Customer Home/components/TestKnowledge";
import WelcomeSection from "@/components/WelcomeSection";

const Home = () => {
  return (
    <>
      <WelcomeSection />
      <StoryHero />
      <HowToPlay />
      <CategoryHighlight />
      <TeamBattles />
      <TestKnowledge />
    </>
  );
};

export default Home;
