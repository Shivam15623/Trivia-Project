import { Team } from "@/interfaces/GameSessionInterface";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Scoreboard = ({ teams }: { teams: Team[] }) => {
  const prevScoresRef = useRef<Record<string, number>>({});
  const [diffs, setDiffs] = useState<Record<string, number>>({});

  useEffect(() => {
    const newDiffs: Record<string, number> = {};

    teams.forEach((team) => {
      const prev = prevScoresRef.current[team.name] || 0;
      if (team.score !== prev) {
        newDiffs[team.name] = team.score - prev;
      }
      prevScoresRef.current[team.name] = team.score;
    });

    setDiffs(newDiffs);

    // Remove diffs after 2 seconds
    const timer = setTimeout(() => setDiffs({}), 2000);
    return () => clearTimeout(timer);
  }, [teams]);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 text-center text-gray-500">
      <p className="text-2xl font-semibold text-gray-800 mb-4">Scoreboard</p>
      <div className="space-y-4">
        {teams.map((team, index) => {
          const diff = diffs[team.name];

          return (
            <div
              key={index}
              className="flex justify-between items-center bg-[#f3f4f6] rounded-lg p-3 shadow-sm relative "
            >
              <div className="text-lg font-medium text-gray-800">
                {team.name}
              </div>
              <div className="text-lg font-semibold text-[#f9a826] relative">
                {team.score}
                <AnimatePresence>
                  {diff !== undefined && diff !== 0 && (
                    <motion.div
                      key={diff}
                      initial={{ opacity: 0, y: 10,x:47 }}
                      animate={{ opacity: 1, y: -28 }}
                      exit={{ opacity: 0, y: -35 }}
                      transition={{ duration: 0.6 }}
                      className={`absolute right-0 text-md font-bold ${
                        diff > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : `${diff}`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
