import { useFetchSessionInfoSoloQuery } from "@/services";
import { RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

const SoloGameEnd = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchSessionInfoSoloQuery(sessionId!);
  const user = useSelector((state: RootState) => state.auth.user);

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
        ⚠️ Error fetching data
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-orange-50 bg-[#fff6f0]">
      <div className="bg-white rounded-2xl shadow-xl border-[5px] border-[#e34b4b] p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">🎉 Game Completed!</h2>

        <div className="text-xl text-gray-600">Your Score:</div>
        <div className="text-5xl font-extrabold text-red-600">
          {sessionData.data.score}
        </div>

        {/* Feedback Message */}
        <div className="text-lg font-semibold text-orange-600">
          {getFeedbackMessage()}
        </div>

        {/* Stats Table */}
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full text-sm sm:text-base text-left border-collapse mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-red-600 border-b-2 border-red-400">
                  Name
                </th>
                <th className="px-4 py-2 text-red-600 border-b-2 border-red-400">
                  Attempted
                </th>
                <th className="px-4 py-2 text-red-600 border-b-2 border-red-400">
                  Correct
                </th>
                <th className="px-4 py-2 text-red-600 border-b-2 border-red-400">
                  Accuracy
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-700 font-medium">
                <td className="px-4 py-2">{sessionData.data.username}</td>
                <td className="px-4 py-2">{attemptedCount}</td>
                <td className="px-4 py-2">{correctCount}</td>
                <td className="px-4 py-2">{accuracy}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Button */}
        <Link
          to={`/${user?.role}/mygames`}
          className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-md font-semibold hover:from-red-600 hover:to-orange-600 transition duration-200"
        >
          Back to My Games
        </Link>
      </div>
    </div>
  );
};

export default SoloGameEnd;
