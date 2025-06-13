import { motion } from "framer-motion";
import {
  HelpCircleIcon,
  RocketIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";


const steps = [
  {
    title: "Pick 6 Categories",
    icon: <RocketIcon className="w-6 h-6 text-white" />,
    description:
      "Choose from a wide range of trivia topics to personalize your challenge.",
  },
  {
    title: "Create Game Room",
    icon: <UsersIcon className="w-6 h-6 text-white" />,
    description: "Host a room and invite friends or match with random players.",
  },
  {
    title: "Answer Trivia Rounds",
    icon: <HelpCircleIcon className="w-6 h-6 text-white" />,
    description:
      "Take turns answering 200, 400, 600-point questions across categories.",
  },
  {
    title: "Use Aids & Win!",
    icon: <TrophyIcon className="w-6 h-6 text-white" />,
    description: "Use up to 3 powerful aids. Outscore the opponent to win!",
  },
];

const HowToPlay = () => {
  return (
    <section className="relative py-20 px-4 bg-white text-black overflow-hidden">
  <h2 className="text-center text-4xl font-extrabold mb-14 text-[#a90000] drop-shadow-md">
    How to Play
  </h2>

  {/* Desktop Layout */}
  <div className="hidden md:grid grid-cols-4 gap-8 max-w-6xl mx-auto">
    {steps.map((step, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: idx * 0.2 }}
        viewport={{ once: true }}
        className="bg-[#f8b195] rounded-2xl p-6 text-center shadow-md border border-[#a90000] hover:border-[#a90000] hover:scale-[1.04] transition-transform"
      >
        <div className="bg-[#a90000] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex justify-center items-center shadow-md">
          {step.icon}
        </div>
        <h3 className="text-xl font-bold text-[#a90000] mb-2">{step.title}</h3>
        <p className="text-sm text-black">{step.description}</p>
      </motion.div>
    ))}
  </div>

  {/* Mobile View */}
  <div className="md:hidden flex flex-col items-start gap-8 relative max-w-md mx-auto mt-12">
    {steps.map((step, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: idx * 0.3 }}
        viewport={{ once: true }}
        className="relative w-full"
      >
        <div className="bg-[#f8b195] rounded-2xl p-6 border border-[#a90000] shadow-md hover:shadow-lg">
          <div className="flex items-center mb-4">
            <div className="bg-[#a90000] p-3 rounded-full w-12 h-12 flex items-center justify-center mr-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-[#a90000]">{step.title}</h3>
          </div>
          <p className="text-base text-black">{step.description}</p>
        </div>
      </motion.div>
    ))}
  </div>
</section>
  );
};

export default HowToPlay;
