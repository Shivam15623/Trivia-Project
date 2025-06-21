import {
  AlertCircle,
  BarChart,
  Smartphone,
  Users2,
  VerifiedIcon,
  Zap,
} from "lucide-react";
import { JSX } from "react";

const featuresData: {
  title: string;
  description: string;
  icon: JSX.Element;
}[] = [
  {
    title: "Strategic Lifelines",
    description:
      "Use powerful lifelines like 50/50, Deduct, and Twice Points to gain an advantage in team games.",
    icon: <Zap className="h-6 w-6 text-[#a90000]" />,
  },
  {
    title: "Multiplayer Teams",
    description:
      "Create teams with up to 5 players and compete in exciting turn-based trivia battles.",
    icon: <Users2 className="h-6 w-6 text-[#a90000]" />,
  },
  {
    title: "Diverse Categories",
    description:
      "Choose from a wide range of categories to customize your game experience.",
    icon: <VerifiedIcon className="h-6 w-6 text-[#a90000]" />,
  },
  {
    title: "Global Leaderboards",
    description:
      "Compete with players worldwide and climb the ranks on our global leaderboards.",
    icon: <BarChart className="h-6 w-6 text-[#a90000]" />,
  },
  {
    title: "Varying Difficulty",
    description:
      "Questions range from 200 to 600 points based on difficulty, challenging players of all levels.",
    icon: <AlertCircle className="h-6 w-6 text-[#a90000]" />,
  },
  {
    title: "Mobile Friendly",
    description:
      "Play SeenJeem on any device with our responsive design that works on desktop and mobile.",
    icon: <Smartphone className="h-6 w-6 text-[#a90000]" />,
  },
];
const FeaturesList = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Game Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            SeenJeem is packed with exciting features to make your trivia
            experience unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesList;
