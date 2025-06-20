import WelcomeSection from "@/components/WelcomeSection";
import StoryHero from "./components/StoryHero";
import HowToPlay from "./components/HowToPlay";
import CategoryHighlight from "./components/CategoryHighlight";
import TeamBattles from "./components/Multiplayershow";
import TestKnowledge from "./components/TestKnowledge";

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
