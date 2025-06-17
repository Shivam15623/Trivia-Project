import { showSuccess, showWarning } from "@/components/toastUtills";
import {
  useFetchMyGamesQuery,
  useInitializeSoloGameMutation,
} from "@/services";

import logError from "@/utills/logError";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import PlayGameDialog from "./components/playGameDialog";
import { Hash, Users } from "lucide-react";

const MyGames = () => {
  const { data: mygames, isLoading, isError } = useFetchMyGamesQuery(undefined);

  const navigate = useNavigate();
  const [initializesolo] = useInitializeSoloGameMutation();
  const [sessionCode, setSessionCode] = useState("");
  const handleInitializeSoloPlay = async (gameId: string) => {
    try {
      const response = await initializesolo({ gameId }).unwrap();
      if (response.success === true) {
        showSuccess(response.message);

        navigate(`/game/SoloGame/${response.data}`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
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
    <section className="px-2 sm:px-10 pt-9 bg-[#f8f9fa]">
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
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <div className="relative flex-grow flex-row">
              <input
                type="text"
                placeholder="Enter Session Code"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value)}
                className="join-input bg-gray-50 text-gray-800 placeholder-gray-400 px-5 py-3 rounded-xl border border-gray-200 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              className="bg-[#ff7546] hover:bg-orange-500 px-8 py-3 text-lg rounded-xl text-white font-bold "
              onClick={handleJoinSession}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mt-8 sm:mt-14 md:mt-18 xl:mt-20 2xl:mt-25">
        {mygames?.data.map((game) => (
          <div
            key={game._id}
            className="rounded-3xl overflow-hidden shadow-xl bg-[#1f1f1f] border border-[#333333] hover:scale-[1.02] transition-transform duration-300"
          >
            {/* Top Banner */}
            <div className="text-white orange-gradient flex flex-col items-center justify-center px-6 pt-8 pb-5">
              <h3 className="text-center text-2xl sm:text-3xl 2xl:text-5xl font-semibold truncate max-w-[12ch]">
                {game.title}
              </h3>
              <div className="flex mt-6 flex-row gap-3 items-center">
                <div
                  onClick={() => handleInitializeSoloPlay(game._id)}
                  className=" cursor-pointer bg-white text-[#a90000] text-lg text-center 2xl:text-2xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Solo Play
                </div>{" "}
                or
                <PlayGameDialog game={game}>
                  <div className=" cursor-pointer bg-white text-[#a90000] text-center text-lg 2xl:text-2xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    Team Play
                  </div>
                </PlayGameDialog>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 border-t border-black bg-[#2a2a2a]">
              {game.categories.map((category) => (
                <div
                  key={category._id}
                  className="relative w-full aspect-[1/1.2] border border-black"
                >
                  <img
                    src={category.thumbnail}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#ff7546] border-t border-black flex justify-center items-center h-10 sm:h-12">
                    <span className="text-white text-xs sm:text-sm md:text-base font-bold px-2 text-center">
                      {category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyGames;
