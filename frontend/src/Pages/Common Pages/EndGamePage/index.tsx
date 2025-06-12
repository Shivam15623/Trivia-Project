import { Link, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import { useFetchScoreBoardQuery } from "@/services";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import {
  Trophy,
  Users,
  BadgeCheck,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
const EndGamePage = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { width, height } = useWindowSize();
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchScoreBoardQuery(sessionCode!);
  const isWinner = useMemo(() => {
    return (
      Array.isArray(sessionData?.data?.winner?.members) &&
      sessionData.data.winner.members.some((player) => player.userId === userId)
    );
  }, [sessionData, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white">
        <LoaderCircle className="animate-spin w-8 h-8 mb-4" />
        <p className="text-xl animate-pulse">Fetching final results...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className="text-center">
          <p className="text-2xl font-semibold mb-4">Failed to load results</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { winner, loser, isDraw } = sessionData.data;

  return (
    <div className="min-h-screen h-auto bg-gradient-to-br from-orange-50 via-white to-orange-100 text-gray-800 p-6">
      {!isDraw && winner && <Confetti width={width} height={height} />}
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">🏁 Game Over!</h1>
        <p className="text-lg text-gray-400 mb-8">
          Session Code: <span className="font-mono">{sessionCode}</span>
        </p>
        {isWinner && (
          <div className="mb-10 text-center animate-bounce">
            <div className="inline-flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg">
              <Trophy className="w-5 h-5" />
              <span className="text-lg font-semibold">
                Congratulations! You won the game!
              </span>
            </div>
          </div>
        )}

        {isDraw ? (
          <div className="bg-indigo-500/10 border border-indigo-400 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-3xl font-semibold text-indigo-300 flex items-center gap-2">
              ⚖️ <Users className="w-6 h-6" /> It's a Draw!
            </h2>
            <p className="mt-2 text-indigo-100">
              What a match! Both teams showed incredible skills and tied the
              score.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10  bg-white px-4 py-2 text-2xl font-bold shadow-lg rounded-full  text-red-600 border border-red-300">
              VS
            </div>
            {[
              {
                team: winner,
                title: "🥇 Wins!",
                bg: "bg-red-100",
                text: "text-red-700",
                border: "border-red-400",
                mvpColor: "bg-red-600 text-white",
                winMsg: "You conquered the game with strategy and teamwork!",
              },
              {
                team: loser,
                title: "😓 Lost",
                bg: "bg-orange-100",
                text: "text-orange-700",
                border: "border-orange-400",
                mvpColor: "bg-orange-500 text-white",
                winMsg:
                  "Don’t give up! There’s always a next time to shine. 💪",
              },
            ].map(({ team, title, bg, text, border, mvpColor, winMsg }) => (
              <div
                key={team?.name}
                className={`${bg} p-6 rounded-xl shadow-xl`}
              >
                <h2 className="text-3xl font-bold mb-2">
                  {title} {team?.name}
                </h2>
                <p className={`text-xl ${text} mb-4`}>
                  Final Score: {team?.score}
                </p>
                <div className="overflow-x-auto">
                  <table className={`min-w-full text-sm text-left ${text}`}>
                    <thead className={`${border} border-b`}>
                      <tr>
                        <th className="py-2 px-4">Player</th>
                        <th className="py-2 px-4 text-center">Score</th>
                        <th className="py-2 px-4 text-center">Correct</th>
                        <th className="py-2 px-4 text-center">Wrong</th>
                        <th className="py-2 px-4 text-center">Total</th>
                        <th className="py-2 px-4 text-center">Badge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team?.members.map((player, _idx, arr) => {
                        const correct = player.attemptHistory.filter(
                          (a) => a.isCorrect
                        ).length;
                        const total = player.attemptHistory.length;
                        const wrong = total - correct;
                        const isMVP =
                          player.score === Math.max(...arr.map((p) => p.score));
                        return (
                          <tr
                            key={player.username}
                            className="border-b border-opacity-30"
                          >
                            <td className="py-2 px-4">{player.username}</td>
                            <td className="py-2 px-4 text-center">
                              {player.score}
                            </td>
                            <td className="py-2 px-4 text-center">{correct}</td>
                            <td className="py-2 px-4 text-center">{wrong}</td>
                            <td className="py-2 px-4 text-center">{total}</td>
                            <td className="py-2 px-4 text-center">
                              {isMVP && (
                                <span
                                  className={`${mvpColor} px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1`}
                                >
                                  <BadgeCheck className="w-4 h-4" /> MVP
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 italic text-sm text-opacity-80">{winMsg}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-12 text-center">
        <Link
          to={`/${userRole}/mygames`}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          <Users className="w-4 h-4" />
          My Games
        </Link>
      </div>
    </div>
  );
};

export default EndGamePage;
