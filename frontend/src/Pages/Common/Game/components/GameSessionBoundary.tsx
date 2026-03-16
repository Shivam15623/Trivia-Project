import React from "react";
import { GameSession } from "@/interfaces/GameSessionInterface";

interface Props {
  isLoading: boolean;
  error: unknown;
  sessionInfo?: GameSession;
  children: React.ReactNode;
}

const GameSessionBoundary: React.FC<Props> = ({
  isLoading,
  error,
  sessionInfo,
  children,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600 animate-pulse">
            Preparing game environment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="px-2 sm:px-10 mt-9 text-center">
        <div className="inline-block px-6 py-4 border border-red-300 bg-red-50 text-red-700 rounded-xl font-medium">
          Failed to fetch games. Please try again later.
        </div>
      </section>
    );
  }

  if (sessionInfo?.status === "completed") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-700 text-sm font-medium">
          This game has already ended.
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GameSessionBoundary;