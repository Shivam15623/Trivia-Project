
import React from "react";
import { useNavigate } from "react-router-dom";
import PlayGameDialog from "./playGameDialog";
import { showSuccess } from "@/components/toastUtills";
import { useInitializeSoloGameMutation } from "@/services";
import { Game } from "@/interfaces/GameInterface";
type Props = {
  game: Game;
};
const GameCard = ({ game }: Props) => {
  const [initializesolo] = useInitializeSoloGameMutation();
  const navigate = useNavigate();
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
  return (
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
  );
};

export default GameCard;
