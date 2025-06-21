import { showWarning } from "@/components/toastUtills";
import { useFetchMyGamesQuery } from "@/services";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Users } from "lucide-react";
import GameCard from "./components/GameCard";
import Pagination from "@/components/ui/paggination";
import { usePagination } from "@/hooks/usePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MyGames = () => {
  const { data: mygames, isLoading, isError } = useFetchMyGamesQuery(undefined);

  const navigate = useNavigate();

  const [sessionCode, setSessionCode] = useState("");
  const {
    currentPage,
    paginatedData: paginatedgame,
    setPage,
    totalPages,
  } = usePagination(mygames?.data || [], 3);

  const handleJoinSession = () => {
    if (!sessionCode.trim()) {
      showWarning("Please enter a session code.");
      return;
    }
    navigate(`/game/Waitingroom/${sessionCode}`);
  };

  if (isLoading) {
    return (
      <section className="px-2 sm:px-10 mt-9 text-center">
        <p className="text-lg text-gray-400">Loading your games...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-2 sm:px-10 mt-9 text-center">
        <p className="text-lg text-red-500">
          Failed to fetch games: "Unknown error"
        </p>
      </section>
    );
  }

  if (!mygames?.data || mygames.data.length === 0) {
    return (
      <section className="px-2 sm:px-10 mt-9 text-center">
        <h2 className="text-3xl font-bold font-cairo mb-4">My Games</h2>
        <p className="text-gray-400">You haven't created any games yet.</p>
      </section>
    );
  }
  return (
    <section className="p-5 sm:px-10 pt-9 bg-[#f8f9fa]">
      <div className="relative mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold font-cairo text-center text-gray-800 title-underline">
          My Games
        </h1>
      </div>
      <div className="max-w-xl mx-auto mb-16 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full orange-gradient mb-4">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Join Existing Game
          </h2>
          <div className="flex flex-col sm:flex-row w-full gap-3 justify-center items-center">
            <div className="relative flex-grow flex-row ">
              <Input 
                type="text"
                placeholder="Enter Session Code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                className="join-input bg-gray-50 h-auto text-gray-800 placeholder-gray-400 px-5 py-3 rounded-xl border border-gray-200 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:border-0 focus-visible:ring-orange-500 transition-all"
              />
            </div>
            <Button
              className="bg-[#ff7546] h-auto hover:bg-orange-500 px-8 py-3 text-lg rounded-xl text-white font-bold "
              onClick={handleJoinSession}
            >
              Join
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mt-8 sm:mt-14 md:mt-18 xl:mt-20 2xl:mt-25">
        {paginatedgame?.map((game) => (
          <GameCard game={game} />
        ))}
      </div>
      {mygames.data && mygames.data.length > 3 && (
        <div className="mt-12">
          <Pagination
            variant="MyGames"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
};

export default MyGames;
