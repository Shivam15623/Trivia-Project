import CategoryHighlight from "@/CustomComponent/layout components/CategoryHighlight";
import StoryHero from "@/CustomComponent/layout components/heroes/StoryHero";
import TeamBattles from "@/CustomComponent/layout components/Multiplayershow";
import HowToPlay from "@/CustomComponent/layout components/HowToPlay";
import TestKnowledge from "@/CustomComponent/layout components/TestKnowledge";
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
