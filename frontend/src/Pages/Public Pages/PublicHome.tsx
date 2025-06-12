import CategoryHighlight from "@/CustomComponent/layout components/CategoryHighlight";
import StoryHero from "@/CustomComponent/layout components/heroes/StoryHero";
import HowToPlay from "@/CustomComponent/layout components/HowToPlay";
import TeamBattles from "@/CustomComponent/layout components/Multiplayershow";
import TestKnowledge from "@/CustomComponent/layout components/TestKnowledge";

const PublicHome = () => {
  return (
    <>
      <StoryHero />
      <HowToPlay />
      <CategoryHighlight />
      <TeamBattles />
      <TestKnowledge />
    </>
  );
};

export default PublicHome;
