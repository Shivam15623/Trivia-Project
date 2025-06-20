import {
  useFetchWaitingroominfoQuery,
  useGameSessionEndMutation,
  useJoinGameSessionMutation,
  useStartGameMutation,
} from "@/services";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";

import { useSocket } from "@/hooks/useSocket";

import { motion } from "framer-motion";
import { useGetGameByIdQuery } from "@/services/GameApi";
import { handleApiError } from "@/utills/handleApiError";
import { showError, showSuccess } from "@/components/toastUtills";
import { selectAuth } from "@/redux/AuthSlice/authSlice";

const WaitingRoom = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const [joinGame] = useJoinGameSessionMutation();
  const [startMatch] = useStartGameMutation();
  const [endGameSession, { isLoading: isEnding }] = useGameSessionEndMutation();

  const navigate = useNavigate();
  const socket = useSocket();
 
  const {user} = useSelector(selectAuth);
  const userId=user?._id

  const {
    data: sessionInfo,
    isLoading,
    error,
    refetch,
  } = useFetchWaitingroominfoQuery(sessionCode!, { skip: !sessionCode });
  const gameId = sessionInfo?.data.gameId;

  const { data: GameInfo } = useGetGameByIdQuery(gameId ?? "", {
    skip: !gameId,
  });

  const data = sessionInfo?.data;

  const allTeamsFull = useMemo(() => {
    if (!data?.teams) return false;
    return data.teams.every(
      (team) => team.currentMembers >= team.expectedMembers
    );
  }, [data]);

  useEffect(() => {
    if (!socket || !sessionCode) return;

    socket.emit("join-session-room", sessionCode);

    socket.on("update-session", async () => {
      await refetch();
    });

    socket.on("game-started", ({ message }: { message: string }) => {
      showSuccess(message);
      navigate(`/game/PlayGameSession/${sessionCode}`);
    });

    socket.on("game-ended", () => {
      showSuccess("Game has ended.");
      navigate(`/${user?.role}/mygames`);
    });

    return () => {
      socket.emit("leave-session-room", sessionCode);
      socket.off("update-session");
      socket.off("game-ended");
      socket.off("game-started");
    };
  }, [socket, sessionCode, navigate, refetch, user?.role]);

  const handleJoinTeam = async (teamName: string) => {
    if (!socket?.id) {
      return;
    }
    try {
      await joinGame({
        sessionCode: data!.sessionCode,
        teamName,
        socketId: socket.id,
      }).unwrap();

      socket?.emit("player-joined", {
        sessionCode: data!.sessionCode,
        teamName,
        userId,
      });

      showSuccess(`Joined team "${teamName}"`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleEndSession = async () => {
    try {
      if (!data?.sessionId) {
        return;
      }
      const res = await endGameSession(data.sessionId).unwrap();
      if (res.statuscode === 200) {
        socket?.emit("end-game", sessionCode);
        showSuccess("Game ended.");
        navigate(`/customer/mygames`);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleStartGame = async () => {
    if (!data?.sessionId) {
      return;
    }
    try {
      const res = await startMatch(data.sessionId).unwrap();

      if (res.success === true) {
        showSuccess("Game started!");
        navigate(`/game/PlayGameSession/${sessionCode}`);
      } else {
        showError(res.message || "Failed to start game");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error || !data)
    return (
      <div className="p-6 text-center text-red-600">
        Error loading session info
      </div>
    );

  if (data.status !== "waiting") {
    const statusMessages: Record<string, string> = {
      active: "The match has already started.",
      completed: "This session has ended.",
    };

    return (
      <div className="p-6 text-center text-lg text-red-500 font-semibold">
        {statusMessages[data.status]}
      </div>
    );
  }

  const userAlreadyInTeam = data.teams.some((team) =>
    team.members?.some((member) => member.userId === userId)
  );

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full bg-orange-50 border-2 border-orange-900 rounded-3xl shadow-xl p-10 space-y-12">
        {/* Game Title */}
        <h1 className="text-4xl font-extrabold text-orange-900 text-center">
          {GameInfo?.data.title}
        </h1>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {GameInfo?.data.categories.map((cat) => (
            <div className="relative aspect-[1/1.2] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={cat.thumbnail}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-[#FF6B35] bg-opacity-90 text-white text-center py-2 text-base font-bold">
                {cat.name}
              </div>
            </div>
          ))}
        </div>

        {/* Info Message */}
        <p className="text-lg text-center text-orange-800 font-medium">
          Waiting for teams to fill...
        </p>

        {/* Teams vs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white px-6 py-3 text-2xl font-black shadow-md rounded-full border border-orange-900"
            whileHover={{ scale: 1.05 }}
          >
            VS
          </motion.div>

          {data.teams.map((team) => {
            const isFull = team.currentMembers >= team.expectedMembers;
            const isUserInThisTeam = team.members?.some(
              (m) => m.userId === userId
            );

            return (
              <motion.div
                key={team.name}
                className="border-2 border-orange-300 bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-transform duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-orange-900">
                    {team.name}
                  </h3>
                  {!userAlreadyInTeam ? (
                    <Button
                      disabled={isFull}
                      onClick={() => handleJoinTeam(team.name)}
                      className="bg-orange-700 hover:bg-orange-800 text-white px-4 py-2 text-sm rounded-md"
                    >
                      {isFull ? "Team Full" : "Join"}
                    </Button>
                  ) : isUserInThisTeam ? (
                    <span className="text-green-600 font-medium text-sm">
                      You're in this team
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      Already in another team
                    </span>
                  )}
                </div>

                <div className="text-sm text-orange-700 mb-3 font-medium">
                  {team.currentMembers}/{team.expectedMembers} members
                </div>

                <ul className="space-y-2 text-sm">
                  {team.members?.map((member, idx) => (
                    <li
                      key={member.userId ?? idx}
                      className="bg-orange-50 px-3 py-1 rounded border border-orange-200"
                    >
                      👤 {member.username || "Unnamed Player"}
                    </li>
                  ))}
                  {Array.from({
                    length: team.expectedMembers - team.currentMembers,
                  }).map((_, i) => (
                    <li
                      key={`empty-${i}`}
                      className="bg-orange-100 px-3 py-1 rounded text-gray-500 italic"
                    >
                      Waiting for player...
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Session Info Section */}
        <div className="mt-10 bg-white border border-orange-300 rounded-xl p-6 shadow-md text-center space-y-3">
          <div className="text-orange-900 text-lg font-semibold">
            Session Code:
          </div>
          <div className="text-2xl font-bold text-orange-700 tracking-widest">
            {data.sessionCode}
          </div>
          <div className="text-gray-500 text-sm mt-1 italic">
            Share this code with players to join
          </div>
        </div>

        {/* Host Actions */}
        {userId === data.host && (
          <div className="mt-10 flex flex-row justify-center items-center gap-6">
            {allTeamsFull && (
              <Button
                onClick={handleStartGame}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white text-lg rounded-xl"
              >
                Start Match
              </Button>
            )}
            <Button
              onClick={handleEndSession}
              disabled={isEnding}
              className="bg-red-600 hover:bg-red-700 px-5 py-3 text-white text-lg rounded-xl"
            >
              {isEnding ? "Ending..." : "End Session"}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WaitingRoom;
