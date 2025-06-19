import {
  useFetchSessionInfoSoloQuery,
  useInitializeSoloGameMutation,
} from "@/services";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams,  useNavigate, Link } from "react-router-dom";
import { SoloGameSession } from "@/interfaces/SoloGameInterface";
import CustomTable from "@/components/CustomTable";
import { Home, PlayCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";

const column = [
  {
    name: "Name",
    cell: (p: SoloGameSession) => p.username,
  },
  {
    name: "Attempted",
    cell: (p: SoloGameSession) => (
      <div className="text-center">{p.attemptHistory.length}</div>
    ),
  },
  {
    name: "Correct",
    cell: (p: SoloGameSession) => (
      <div className="text-center">
        {p.attemptHistory.filter((a) => a.isCorrect).length}
      </div>
    ),
  },
  {
    name: "Accuracy",
    cell: (p: SoloGameSession) => {
      const correctCount = p.attemptHistory.filter((a) => a.isCorrect).length;

      const attemptedCount = p.attemptHistory?.length || 0;
      const accuracy =
        attemptedCount > 0
          ? Math.round((correctCount / attemptedCount) * 100)
          : 0;
      return <div className="text-center">{accuracy}%</div>;
    },
  },
];
const SoloGameEnd = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchSessionInfoSoloQuery(sessionId!);
  const user = useSelector((state: RootState) => state.auth.user);
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

  const correctCount = useMemo(() => {
    if (!sessionData?.data?.attemptHistory) return 0;
    return sessionData.data.attemptHistory.filter((a) => a.isCorrect).length;
  }, [sessionData]);

  const attemptedCount = sessionData?.data?.attemptHistory?.length || 0;
  const accuracy =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const getFeedbackMessage = () => {
    if (accuracy === 100) return "🏆 Perfect score! You're unstoppable!";
    if (accuracy >= 80) return "🔥 Great job! Just a few more to perfection.";
    if (accuracy >= 50) return "💪 Good effort! You're getting there.";
    return "🚀 Don't give up. Practice makes perfect!";
  };

  if (isLoading)
    return (
      <div className="text-center mt-10 text-lg text-orange-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Something Went Wrong
      </div>
    );

  if (sessionData?.data.userId !== user?._id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xl font-semibold text-red-700">
        ❌ Unauthorized Access
      </div>
    );
  }

  if (sessionData?.data.status !== "completed") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xl font-semibold text-orange-500">
        ⏳ Game is still in progress...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="relative max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-3 orange-gradient"></div>

            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center animate-scale">
                  <Trophy className="h-12 w-12 text-amber-400 trophy-glow" />
                </div>
              </div>

              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent orange-gradient">
                Game Completed!
              </h2>

              <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl p-5 border border-orange-100 shadow-sm">
                <div className="text-lg text-orange-500 font-medium">
                  Your Score
                </div>
                <div className="text-5xl font-extrabold text-red-500 mt-1">
                  {sessionData.data.score}
                </div>

                <div className="mt-3 text-lg font-semibold bg-clip-text text-transparent tab-gradient">
                  {getFeedbackMessage()}
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-orange-100">
                <CustomTable
                  columns={column}
                  data={[{ ...sessionData.data }]}
                  variant="SoloGameEnd"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={() =>
                    handleInitializeSoloPlay(sessionData?.data.gameId)
                  }
                  variant={"gradient"}
                  className="flex-1 button-shine h-auto px-6 py-3 rounded-xl shadow-md font-semibold hover:opacity-90 transition duration-200 flex items-center justify-center"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
                <a
                  href={`/${user?.role}/mygames`}
                  className="flex-1 bg-white border border-orange-400 text-orange-500 px-6 py-3 rounded-xl shadow-sm font-semibold hover:bg-orange-50 transition duration-200 flex items-center justify-center"
                >
                  <Home className="h-5 w-5 mr-2" />
                  My Games
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Want to create your own quiz?{" "}
            <Link to={`/${user?.role}/CreateGame`} className="text-orange-500 font-medium hover:underline">
              Click here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SoloGameEnd;
