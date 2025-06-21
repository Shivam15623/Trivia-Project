import { Link, useParams } from "react-router-dom";

import { useFetchScoreBoardQuery } from "@/services";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Trophy,
  Users,
  BadgeCheck,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";

import { Player } from "@/interfaces/GameSessionInterface";
import CustomTable from "@/components/CustomTable";
import { cn } from "@/lib/utils";
import { fireConfetti } from "@/utills/confetti";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { Button } from "@/components/ui/button";

const EndGamePage = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;
  const userRole = user?.role;

  // ❌ Don't run query if user is not ready
  const shouldSkip = !userId;
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchScoreBoardQuery(sessionCode!, { skip: shouldSkip });

  const isWinner = useMemo(() => {
    return (
      sessionData?.data?.winner?.members?.some(
        (player) => player.userId === userId
      ) ?? false
    );
  }, [sessionData, userId]);

  useEffect(() => {
    if (isWinner && !sessionData?.data?.isDraw) {
      fireConfetti({ spread: 250 });
    }
  }, [isWinner, sessionData]);

  // ✅ Loader while user is undefined
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <LoaderCircle className="animate-spin w-8 h-8 mr-2" />
        <span>Initializing user...</span>
      </div>
    );
  }

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
          <Button
            onClick={() => window.location.reload()}
            className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition inline-flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { winner, loser, isDraw } = sessionData.data;

  return (
    <div className="min-h-screen h-auto bg-gradient-to-br from-orange-50 via-white to-orange-100 text-gray-800 p-6">
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

                mvpColor: "bg-red-600 text-white",
                winMsg: "You conquered the game with strategy and teamwork!",
              },
              {
                team: loser,
                title: "😓 Lost",
                bg: "bg-orange-100",
                text: "text-orange-700",

                mvpColor: "bg-orange-500 text-white",
                winMsg:
                  "Don’t give up! There’s always a next time to shine. 💪",
              },
            ].map(({ team, title, bg, text, mvpColor, winMsg }) => {
              const columns = [
                {
                  name: "Player",
                  cell: (player: Player) => player.username,
                },
                {
                  name: "Score",
                  cell: (player: Player) => (
                    <div className="text-center">{player.score}</div>
                  ),
                },
                {
                  name: "Correct",
                  cell: (player: Player) => {
                    const correct = player.attemptHistory.filter(
                      (a) => a.isCorrect
                    ).length;
                    return <div className="text-center">{correct}</div>;
                  },
                },
                {
                  name: "Wrong",
                  cell: (player: Player) => {
                    const correct = player.attemptHistory.filter(
                      (a) => a.isCorrect
                    ).length;
                    const total = player.attemptHistory.length;
                    return <div className="text-center">{total - correct}</div>;
                  },
                },
                {
                  name: "Total",
                  cell: (player: Player) => (
                    <div className="text-center">
                      {player.attemptHistory.length}
                    </div>
                  ),
                },
                {
                  name: "Badge",
                  cell: (player: Player, _idx?: number, arr?: Player[]) => {
                    const isMVP =
                      player.score ===
                      Math.max(...(arr ?? []).map((p) => p.score));
                    return (
                      <div className="text-center">
                        {isMVP && (
                          <span
                            className={cn(
                              " px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1",
                              mvpColor
                            )}
                          >
                            <BadgeCheck className="w-4 h-4" /> MVP
                          </span>
                        )}
                      </div>
                    );
                  },
                },
              ];
              return (
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
                    {team?.members && team.members.length > 0 ? (
                      <CustomTable
                        columns={columns}
                        data={team.members}
                        variant={title.includes("Wins") ? "TeamA" : "TeamB"}
                      />
                    ) : (
                      <p className="text-center text-sm italic text-gray-500">
                        No players in this team.
                      </p>
                    )}
                  </div>
                  <p className="mt-6 italic text-sm text-opacity-80">
                    {winMsg}
                  </p>
                </div>
              );
            })}
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
