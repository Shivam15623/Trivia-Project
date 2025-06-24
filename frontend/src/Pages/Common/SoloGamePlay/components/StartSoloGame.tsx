import { Button } from "@/components/ui/button";
import { useEndSoloGameMutation, useStartSoloGameMutation } from "@/services";
import { useGetGameByIdQuery } from "@/services/GameApi";

import { handleApiError } from "@/utills/handleApiError";

import { useNavigate, useParams } from "react-router-dom";

import { showSuccess } from "../../../../components/toastUtills";
import { useSelector } from "react-redux";

import { PlayCircle, X } from "lucide-react";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import InitialSoloGameLoader from "./InitialSoloGameLoader";
import StartSoloGameLoader from "./StartSoloGameLoader";

const StartSoloGame = ({ gameId }: { gameId: string }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: GameInfo, isLoading } = useGetGameByIdQuery(gameId);
  const [startGame, { isLoading: StartGameLoading }] =
    useStartSoloGameMutation();
  const [EndGame] = useEndSoloGameMutation();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const role = user?.role;

  const HandleStartGame = async () => {
    try {
      const response = await startGame(sessionId!).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  const HandleEndGame = async () => {
    try {
      const response = await EndGame(sessionId!).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
        navigate(`/${role}/mygames`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  if (isLoading) return <InitialSoloGameLoader />;
  if (StartGameLoading) return <StartSoloGameLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-orange-50 to-orange-100 ">
      <div className="w-full max-w-7xl game-container border-2 border-orange-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden bg-[#ffffffe6]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-300 rounded-full opacity-20"></div>
        <div className="relative z-10 mb-10">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h1 className="game-title text-4xl md:text-5xl font-extrabold">
              {GameInfo?.data.title}
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Get ready to test your knowledge!
          </p>
        </div>
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
            <div className="relative mr-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full absolute inset-0 pulse-ring"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Solo Game Ready
            </span>
          </div>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mx-auto">
            {GameInfo?.data.categories.map((cat) => (
              <div className="relative aspect-[1/1.28] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.04]">
                <img
                  src={cat.thumbnail}
                  alt="Category Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#FF6B35] bg-opacity-90 text-white text-center py-2">
                  <span className="font-bold text-sm sm:text-base">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            variant="ghost"
            onClick={HandleStartGame}
            size={"lg"}
            className="start-button button-shine h-auto  bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition duration-300 w-full sm:w-auto flex items-center justify-center"
          >
            <PlayCircle />
            Start Game
          </Button>
          <Button
            variant="ghost"
            onClick={HandleEndGame}
            size={"lg"}
            className="bg-white border-2 border-red-500 h-auto text-red-500 hover:bg-red-50 font-bold px-6 py-4 rounded-xl shadow-md transition duration-300 w-full sm:w-auto flex items-center justify-center"
          >
            {" "}
            <X />
            End Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartSoloGame;
