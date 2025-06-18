import { Button } from "@/components/ui/button";
import { showSuccess } from "@/components/toastUtills";

import { useSocket } from "@/hooks/useSocket";
import {
  currentQuestionData,
  GameSession,
} from "@/interfaces/GameSessionInterface";

import { RootState } from "@/redux/store";
import {
  useFetchCurrentQuestionQuery,
  useFetchGameSessionInfoQuery,
  useFiftyFiftyUseMutation,
  useGameSessionEndMutation,
} from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { Divide, MinusCircle, Zap } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ScoreboardAndHost } from "./components/ScoreboardAndhost";
import { MobileLifelineFooter } from "./components/MobileLifelineFooter";
import { Scoreboard } from "./components/ScoreBoard";
import { CategorySidebar } from "./components/CategorySidebar";
import QuestionSection from "./components/QuestionArea";

export interface CurrentTurn {
  playerName: string;
  teamName: string;
}
const PlayGamePage = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const [fiftyfifty] = useFiftyFiftyUseMutation();
  const socket = useSocket();
  const {
    data: sessionInfoFromAPI,
    isLoading,
    error,

    isSuccess: sessionSuccess,
  } = useFetchGameSessionInfoQuery(sessionCode!, {
    skip: !sessionCode,
    refetchOnMountOrArgChange: true,
  });

  const [sessionInfo, setSessionInfo] = useState<GameSession | undefined>();
  const [useAid, setUseAid] = useState<"Deduct" | "None" | "twicePoint">(
    "None"
  );

  useEffect(() => {
    if (sessionSuccess && sessionInfoFromAPI?.data) {
      setSessionInfo(sessionInfoFromAPI.data);
    }

    if (!sessionInfoFromAPI?.data) {
      setSessionInfo(undefined);
    }
  }, [sessionInfoFromAPI, sessionSuccess]);

  const [EndGame] = useGameSessionEndMutation();

  const navigate = useNavigate();
  const {
    data: currentQuestionDataFromAPI,
    isLoading: questionLoading,

    isSuccess: questionSuccess,
  } = useFetchCurrentQuestionQuery(sessionCode!, {
    skip: !sessionCode,
    refetchOnMountOrArgChange: true,
  });

  const [questionData, setQuestionData] = useState<
    currentQuestionData | undefined
  >();

  // Sync with API only if valid
  useEffect(() => {
    if (questionSuccess && currentQuestionDataFromAPI?.data) {
      setQuestionData(currentQuestionDataFromAPI?.data);
    }

    if (!currentQuestionDataFromAPI?.data) {
      setQuestionData(undefined);
    }
  }, [currentQuestionDataFromAPI, questionSuccess]);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const isHost = sessionInfo?.host === userId;
  const isFifty = useMemo(() => {
    if (!sessionInfo || !userId) return false;

    const teamIndex = sessionInfo.progress?.currentTeamIndex;
    if (teamIndex === undefined) return false;

    const team = sessionInfo.teams[teamIndex];
    if (!team) return false;

    const isCurrentplayer = team.members.find(
      (player) => player.userId === userId
    );

    // Check if fiftyFiftyUsed is true
    return isCurrentplayer?.aids.fiftyFiftyUsed === false;
  }, [sessionInfo, userId]);
  const DeductUsed = useMemo(() => {
    if (!sessionInfo || !userId) return false;

    const teamIndex = sessionInfo.progress?.currentTeamIndex;
    if (teamIndex === undefined) return false;

    const team = sessionInfo.teams[teamIndex];
    if (!team) return false;

    const isCurrentplayer = team.members.find(
      (player) => player.userId === userId
    );
    return isCurrentplayer?.aids.deductUsed === false;
  }, [sessionInfo, userId]);
  const twiceUsed = useMemo(() => {
    if (!sessionInfo || !userId) return false;

    const teamIndex = sessionInfo.progress?.currentTeamIndex;
    if (teamIndex === undefined) return false;

    const team = sessionInfo.teams[teamIndex];
    if (!team) return false;

    const isCurrentplayer = team.members.find(
      (player) => player.userId === userId
    );
    return isCurrentplayer?.aids.twicePointUsed === false;
  }, [sessionInfo, userId]);
  useEffect(() => {
    setUseAid("None");
  }, [sessionInfo]);
  useEffect(() => {
    if (sessionInfo?.status === "completed") {
      navigate(`/game/endgame/${sessionCode}`);
    }
  }, [sessionInfo?.status, sessionCode, navigate]);

  useEffect(() => {
    if (!socket) return;
    const handleChangeState = ({
      session,
      currentQuestion,
    }: {
      session: GameSession;
      currentQuestion: currentQuestionData;
    }) => {
      // Update local state or trigger refetch

      setQuestionData(currentQuestion);
      setSessionInfo(session);
    };
    socket.emit("join-session-room", sessionCode);
    socket.on("game-ended", () => {
      navigate(`/game/endgame/${sessionCode}`);
    });

    socket.on("chngeState", handleChangeState);

    return () => {
      socket.off("chngeState");
      socket.off("game-ended");
    };
  }, [socket, navigate, sessionCode]);
  const handleEndGame = async () => {
    if (!sessionInfo?._id) {
      return;
    }
    const response = await EndGame(sessionInfo._id).unwrap();

    if (response.success === true) {
      socket?.emit("end-game", sessionCode);
    }
  };

  const handlefiftyfifty = async () => {
    if (!sessionInfo?._id || !questionData?.questionId) {
      return;
    }
    try {
      const response = await fiftyfifty({
        gameSessionId: sessionInfo._id,
        questionId: questionData.questionId,
        teamIndex: sessionInfo.progress.currentTeamIndex,
      }).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
        setQuestionData((prev) =>
          prev
            ? {
                ...prev,
                options: prev.options.filter((opt) =>
                  response.data.includes(opt)
                ),
              }
            : undefined
        );
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading)
    return <div className="text-center py-10">Loading session info...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading session
      </div>
    );
  if (sessionInfo?.status === "completed") {
    return <div>game ended</div>;
  }
  return (
    <div className="flex flex-col w-screen max-w-screen overflow-y-scroll h-screen max-h-screen gap-6  ">
      {sessionInfo && (
        <ScoreboardAndHost
          teams={sessionInfo.teams}
          isHost={isHost}
          onEndGame={handleEndGame}
        />
      )}
      <MobileLifelineFooter
        isFifty={isFifty}
        handlefiftyfifty={handlefiftyfifty}
        DeductUsed={DeductUsed}
        twiceUsed={twiceUsed}
        useAid={useAid}
        setUseAid={setUseAid}
      />

      <section className="px-4 py-6 sm:px-6 pb-30 sm:pb-0 w-full h-full mx-auto md:w-11/12 lg:w-3/4  bg-gray-50 ">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Question Area */}
          <div className="w-full sm:w-full  md:w-9/12 lg:w-9/12 mx-auto  ">
            <div className="bg-white rounded-2xl shadow-lg p-1  sm:p-6 flex flex-col gap-6 relative border-[5px] border-[#e34b4b]">
              {questionLoading ? (
                <div className="text-gray-500 text-lg text-center animate-pulse">
                  Loading Question...
                </div>
              ) : questionData && sessionInfo ? (
                <QuestionSection
                  sessionInfo={sessionInfo}
                  currentQuestionData={questionData}
                  socket={socket!}
                  aid={useAid}
                />
              ) : null}
            </div>
          </div>

          {/* Right Side Placeholder */}
          <div className="w-full lg:w-3/12 md:w-3/12  hidden flex-col md:flex gap-6">
            {sessionInfo && <Scoreboard teams={sessionInfo.teams} />}
            {questionData && (
              <CategorySidebar categoryData={questionData.category!} />
            )}
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200 flex flex-col gap-4">
              <h3 className="text-base font-semibold text-gray-700">
                Lifelines
              </h3>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                  disabled={!isFifty}
                  onClick={handlefiftyfifty}
                  className={`w-full sm:w-auto flex-1 p-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 text-sm font-medium
        ${
          isFifty
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
                >
                  <Divide size={18} />
                  50-50
                </Button>

                <Button
                  disabled={!DeductUsed || useAid !== "None"}
                  onClick={() => setUseAid("Deduct")}
                  className={`w-full sm:w-auto flex-1 p-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 text-sm font-medium
        ${
          useAid === "Deduct"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : !DeductUsed || useAid !== "None"
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-800 hover:bg-blue-100"
        }`}
                >
                  <MinusCircle size={18} />
                  Deduct
                </Button>

                <Button
                  disabled={!twiceUsed || useAid !== "None"}
                  onClick={() => setUseAid("twicePoint")}
                  className={`w-full sm:w-auto flex-1 p-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 text-sm font-medium
        ${
          useAid === "twicePoint"
            ? "bg-green-600 text-white hover:bg-green-700"
            : !twiceUsed || useAid !== "None"
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-800 hover:bg-green-100"
        }`}
                >
                  <Zap size={18} />
                  2x Points
                </Button>
              </div>
            </div>

            {isHost && (
              <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-200 flex flex-col items-center">
                <h3 className="text-base font-medium text-gray-700 mb-3">
                  Host Controls
                </h3>
                <Button
                  onClick={handleEndGame}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md active:scale-95"
                >
                  End Game
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayGamePage;
