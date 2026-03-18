import { useSocket } from "@/hooks/useSocket";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import {
  useFetchGameSessionInfoQuery,
  useGameSessionEndMutation,
  useJoinGameSessionMutation,
  useStartGameMutation,
} from "@/services";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { showError, showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";

import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { GradientButton } from "@/components/GradientButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "@/interfaces/categoriesInterface";
import { Check, Copy } from "lucide-react";
import { Team } from "@/interfaces/GameSessionInterface";

const CategoryCard = ({ cat }: { cat: Category }) => (
  <div
    className="gradient-border max-h-[180px] min-h-[180px] max-w-[157px] p-[2.62px] sm:min-h-[273.33px] sm:max-w-[240px]"
    style={
      {
        "--border-gradient":
          "linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)",
        "--radius": `${8.72}px`,
        "--padding": `${2.62}px`,
      } as React.CSSProperties
    }
  >
    <div className="relative z-10 flex h-full flex-col overflow-hidden">
      <div className="relative flex h-full w-full flex-col items-center justify-between gap-[4.36px] rounded-[8.72px] bg-gradient-to-b from-[#0B0B0B] to-[#000000] px-3 pb-4 pt-[1px] text-white sm:px-[18.67px] sm:pb-[30px]">
        <div className="max-h-[129.52px] w-full max-w-[188.67px] sm:max-h-[198px]">
          <img
            src={cat.thumbnail}
            alt={cat.name}
            className="h-full w-full object-contain"
          />
        </div>

        <p className="font-michroma text-[12px] tracking-wide opacity-90 sm:text-[13px]">
          {cat.name}
        </p>
      </div>
    </div>
  </div>
);
const WaitingRoom = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;

  const [joinGame, { isLoading: isJoining }] = useJoinGameSessionMutation();
  const [startMatch, { isLoading: isStarting }] = useStartGameMutation();
  const [endGameSession, { isLoading: isEnding }] = useGameSessionEndMutation();

  const {
    data: sessionInfo,
    isLoading: isSessionLoading,
    error: sessionError,
    refetch,
  } = useFetchGameSessionInfoQuery(sessionCode!, { skip: !sessionCode });

  const sessionData = sessionInfo?.data;

  const [joiningTeam, setJoiningTeam] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [optimisticTeams, setOptimisticTeams] = useState<Team[]>([]);

  // Keep in sync when real data arrives
  useEffect(() => {
    setOptimisticTeams(sessionData?.teams ?? []);
  }, [sessionData?.teams]);

  const handleJoinTeam = async (teamName: string) => {
    if (!socket?.id || !sessionData?.sessionCode || !user) return;
    setJoiningTeam(teamName);

    // ✅ Optimistically add user to team immediately
    setOptimisticTeams((prev) =>
      prev.map((team) =>
        team.name === teamName
          ? {
              ...team,
              members: [
                ...team.members,
                {
                  userId: user._id,
                  username: user.firstname + " " + user.lastname, // ← check your User type, might be `name` not `username`
                  socketId: socket.id,
                  score: 0,
                  hasAnswered: false,
                  attemptHistory: [],
                  currentSuggestion: null,
                  hasSuggested: false,
                  isSubmitter: false,
                }, // ✅ cast to Player
              ],
            }
          : team,
      ),
    );

    try {
      await joinGame({
        sessionCode: sessionData.sessionCode,
        teamName,
        socketId: socket.id,
      }).unwrap();

      socket.emit("player-joined", {
        sessionCode: sessionData.sessionCode,
        teamName,
        userId,
      });

      showSuccess(`Joined team "${teamName}"`);
    } catch (error) {
      // ✅ Rollback on failure
      setOptimisticTeams(sessionData?.teams ?? []);
      handleApiError(error);
    } finally {
      setJoiningTeam(null);
    }
  };

  const isHost = sessionData?.host === user?._id;
  const allTeamsFull = useMemo(() => {
    return (optimisticTeams ?? []).every(
      (team) => team.members.length >= team.expectedMembers,
    );
  }, [optimisticTeams]);

  const userAlreadyInTeam = useMemo(() => {
    return (optimisticTeams ?? []).some((team) =>
      team.members?.some((member) => member.userId === userId),
    );
  }, [optimisticTeams, userId]);

  // And where you assign:
  const teams = optimisticTeams ?? [];

  useEffect(() => {
    if (!socket || !sessionCode) return;

    socket.emit("join-session-room", sessionCode);

    socket.on("update-session", refetch);
    socket.on("game-started", ({ message }: { message: string }) => {
      showSuccess(message);
      navigate(`/game/PlayGameSession/${sessionCode}`);
    });
    socket.on("game-ended", () => {
      showSuccess("Game has ended.");
      navigate(`/${user?.role}/CreateGame`);
    });

    return () => {
      socket.emit("leave-session-room", sessionCode);
      socket.off("update-session");
      socket.off("game-started");
      socket.off("game-ended");
    };
  }, [socket, sessionCode, refetch, navigate, user?.role]);

  const handleEndSession = async () => {
    if (!sessionData?._id) return;
    try {
      const res = await endGameSession(sessionData._id).unwrap();
      if (res.statuscode === 200) {
        socket?.emit("end-game", sessionCode);
        showSuccess("Game ended.");
        navigate(`/${user?.role}/CreateGame`);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleStartGame = async () => {
    if (!sessionData?._id) return;
    try {
      const res = await startMatch(sessionData._id).unwrap();

      if (res.success) {
        navigate(`/game/PlayGameSession/${sessionCode}`);
      } else {
        showError(res.message || "Failed to start game");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  // -------------------- UI STATES --------------------

  if (isSessionLoading)
    return (
      <div className="p-10 text-center text-xl font-semibold text-orange-600">
        Loading game info...
      </div>
    );

  if (sessionError || !sessionData)
    return (
      <div className="p-10 text-center font-semibold text-red-600">
        Error loading session info
      </div>
    );

  if (sessionData.status !== "waiting") {
    const statusText: Record<string, string> = {
      active: "The match has already started.",
      completed: "This session has ended.",
    };
    return (
      <div className="p-10 text-center text-lg font-semibold text-red-500">
        {statusText[sessionData.status] ?? "Session unavailable"}
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(sessionData.sessionCode);
      showSuccess("Session code copied!");
      setCopied(true); // ✅ trigger animation
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      handleApiError(err);
    }
  };
  return (
    <>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative z-10 flex h-full min-h-full flex-col gap-[80px] sm:gap-[180px]">
          <div className="mx-auto flex flex-col justify-center gap-[80px] sm:gap-[180px]">
            <div className="flex flex-col items-center gap-3.5 text-center">
              <h2 className="bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)] bg-clip-text font-inter text-[28px] font-semibold text-transparent sm:text-[44px]">
                {sessionData?.title}
              </h2>

              <div
                className={cn("gradient-border", "h-[40px]")}
                style={
                  {
                    "--border-gradient":
                      "linear-gradient(93.58deg, rgba(103, 195, 255, 0.4) 8.55%, rgba(1, 10, 42, 0.4) 47.56%, rgba(103, 195, 255, 0.4) 94.76%)",
                    "--radius": `20px`,
                    "--padding": `1px`,
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10 flex h-full flex-row items-center justify-center gap-[10px] rounded-[20px] bg-[#2985C866] px-5 font-outfit text-[18px] font-normal text-white">
                  <span className="h-[10px] w-[10px] rounded-full bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)]" />
                  <span>Team Game</span>
                </div>
              </div>
              <div className="flex w-full max-w-[1200px] flex-col items-start justify-start gap-3.5">
                <h4 className="hidden font-outfit text-[14px] font-normal text-white opacity-50 sm:block sm:text-[24px]">
                  Categories
                </h4>
                {/* Replace your grid div with this */}
                <div className="grid max-w-[1200px] grid-cols-2 gap-x-[21px] gap-y-[21px] sm:gap-x-20 sm:gap-y-6 md:grid-cols-3 xl:grid-cols-4">
                  {/* First Row */}
                  {sessionData.categories.slice(0, 4).map((cat) => (
                    <CategoryCard key={cat._id} cat={cat} />
                  ))}
                  {/* Second Row */}
                  <div className="hidden xl:block" /> {/* empty cell */}
                  {sessionData.categories.slice(4, 6).map((cat) => (
                    <CategoryCard key={cat._id} cat={cat} />
                  ))}
                  <div className="hidden xl:block" /> {/* empty cell */}
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="relative grid grid-cols-1 gap-[100px] lg:grid-cols-2 lg:gap-5">
              <motion.img
                src="/Vs.svg"
                alt="VS"
                className="absolute left-1/2 top-1/2 z-10 h-[120px] w-[161px] -translate-x-1/2 -translate-y-1/2 sm:h-[200px] sm:w-[200px]"
              />

              {teams.map((team, _idx) => {
                const isFull = team.members.length >= team.expectedMembers;
                const isUserInTeam = team.members?.some(
                  (m) => m.userId === userId,
                );

                return (
                  <motion.div
                    key={team.name}
                    className="relative z-0 flex flex-col items-center gap-3.5 rounded-[40px] bg-[linear-gradient(180deg,_#FF6D00_0%,_#FA9923_100%)] px-[22px] py-[20px] shadow-sm transition-transform duration-200 hover:shadow-lg sm:items-start sm:px-[55px] sm:py-[60px]"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 z-10"
                      style={{
                        backgroundImage: "url('/Noise.png')",
                        backgroundRepeat: "repeat",
                      }}
                    />
                    <div className="relative z-20 flex w-full items-center justify-between">
                      <h3 className="text-2xl font-semibold leading-[100%] text-white md:text-[48px] md:leading-[70px]">
                        Team{" "}
                        <span
                          className={
                            _idx === 0
                              ? `bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-transparent`
                              : `bg-[linear-gradient(180deg,_#7BFDFD_62.5%,_#2884C7_100%)] bg-clip-text text-transparent`
                          }
                        >
                          {team.name}
                        </span>
                      </h3>
                      {/* ✅ Join / Full badge — always visible, right aligned */}
                      {!userAlreadyInTeam ? (
                        <button
                          disabled={isFull || isJoining}
                          onClick={() => handleJoinTeam(team.name)}
                          className={cn(
                            "relative z-10 flex min-w-[100px] items-center justify-center gap-2 rounded-full px-5 py-2 font-outfit text-sm font-semibold transition-all duration-200",
                            isFull
                              ? "cursor-not-allowed bg-white/10 text-white/40" // ✅ muted when full
                              : "bg-white text-orange-600 hover:scale-105 hover:bg-white/90 active:scale-95", // ✅ white pill when joinable
                          )}
                        >
                          {isJoining && joiningTeam === team.name ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                              <span>Joining...</span>
                            </>
                          ) : isFull ? (
                            "Team Full"
                          ) : (
                            "Join"
                          )}
                        </button>
                      ) : isUserInTeam ? (
                        // ✅ "You're here" badge for current user's team
                        <span className="relative z-10 rounded-full bg-white/20 px-4 py-1.5 font-outfit text-sm font-medium text-white">
                          ✓ Your Team
                        </span>
                      ) : null}
                    </div>
                    {team.members?.map((member, idx) => (
                      <li
                        key={member.userId ?? idx}
                        className="flex h-[40px] w-full max-w-[254px] items-center rounded-[100px] bg-[#FFFFFF33] px-[15px] font-inter text-[16px] font-normal leading-[100%] text-white sm:max-w-none"
                      >
                        {member.username || "Unnamed Player"}
                      </li>
                    ))}
                    {Array.from({
                      length: team.expectedMembers - team.members.length,
                    }).map((_, i) => (
                      <li
                        key={`empty-${i}`}
                        className="flex h-[40px] w-full max-w-[254px] items-center rounded-[100px] bg-[#FFFFFF33] px-[15px] font-inter text-[16px] font-normal leading-[100%] text-white sm:max-w-none"
                      >
                        <span className="opacity-30">
                          {" "}
                          Waiting for player...
                        </span>
                      </li>
                    ))}
                    <div className="flex w-full max-w-[254px] items-center justify-between font-outfit text-xs font-normal leading-[100%] text-white sm:max-w-none">
                      <div>
                        {" "}
                        {team.members.length}/{team.expectedMembers} Member
                      </div>
                      {isUserInTeam ? (
                        <span>You're in this team</span>
                      ) : (
                        <span>Already in another team</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <GradientCard
              className="mx-auto mb-[80px] w-fit max-w-fit sm:mb-[180px]"
              gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
              padding={3}
              radius={20}
            >
              <div className="flex flex-col items-center justify-center gap-6 bg-[#FFFFFF0D] px-[60px] py-10">
                <div className="font-outfit text-2xl font-normal text-white">
                  Session Code:
                </div>
                <div className="font-inter text-2xl font-semibold leading-[100%] tracking-widest text-white sm:leading-[70px] md:text-3xl xl:text-5xl">
                  {sessionData.sessionCode}
                </div>
                <div className="flex flex-row gap-5">
                  {isHost &&
                    (allTeamsFull ? (
                      <GradientButton
                        className="min-w-fit max-w-fit shadow-[0px_0px_34px_0px_#F5FFE633]"
                        onClick={handleStartGame}
                        disabled={isStarting}
                      >
                        {isStarting ? "Starting..." : "Start Match"}
                      </GradientButton>
                    ) : (
                      <GradientButton
                        className="shadow-[0px_0px_34px_0px_#F5FFE633]"
                        onClick={handleEndSession}
                        disabled={isEnding}
                        icon={false}
                      >
                        End Game
                      </GradientButton>
                    ))}
                  <Button
                    className={cn(
                      "gradient-border group",
                      "flex h-[40px] items-center px-5 py-0",
                      "transition-all duration-200 active:scale-95", // ✅ press effect
                    )}
                    onClick={handleCopyCode}
                    style={
                      {
                        "--border-gradient":
                          "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                        "--radius": `20px`,
                        "--padding": "1px",
                      } as React.CSSProperties
                    }
                  >
                    <div className="relative z-10 flex h-full flex-row items-center justify-center gap-2 text-lg">
                      {copied ? (
                        // ✅ Check icon fades in when copied
                        <>
                          <Check
                            size={18}
                            className="text-green-400 duration-200 animate-in fade-in zoom-in"
                          />
                          <span className="text-green-400 duration-200 animate-in fade-in">
                            Copied!
                          </span>
                        </>
                      ) : (
                        // ✅ Copy icon slides up slightly on hover
                        <>
                          <Copy
                            size={18}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5"
                          />
                          <span>Copy Code</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            </GradientCard>

            {/* Host Actions */}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1920"
          height="970"
          viewBox="0 0 1920 970"
          className="absolute left-0 top-[27%]"
          fill="none"
        >
          <g opacity="0.5" filter="url(#filter0_f_408_2460)">
            <path
              d="M1945.85 878.796C1751.03 782.934 1424.03 705.218 1023.67 688.82C324.075 660.164 -23.3907 638.305 -200.528 552.201L-173.357 489.777L-158.628 281.855C95.6798 407.879 459.209 478.942 1142.25 490.743C1568.31 502.145 1907.38 563.404 2035.58 620.317L1945.85 878.796Z"
              fill="url(#paint0_linear_408_2460)"
            />
          </g>
          <g opacity="0.5" filter="url(#filter1_f_408_2460)">
            <path
              d="M-23.8442 167.599C151.282 269.623 331.309 342.779 809.569 388.761C1364.79 442.143 1912.36 431.678 2071.74 523.606L2060.86 752.25L1954.93 735.103C1851.8 675.128 1127.41 653.498 467.768 552.043C297.562 525.865 219.051 534.983 -120.171 399.76L-23.8442 167.599Z"
              fill="url(#paint1_linear_408_2460)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_408_2460"
              x="-291.327"
              y="191.055"
              width="2417.7"
              height="778.54"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="45.4"
                result="effect1_foregroundBlur_408_2460"
              />
            </filter>
            <filter
              id="filter1_f_408_2460"
              x="-231.772"
              y="55.9986"
              width="2415.11"
              height="807.851"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="55.8"
                result="effect1_foregroundBlur_408_2460"
              />
            </filter>
            <linearGradient
              id="paint0_linear_408_2460"
              x1="1978.62"
              y1="704.565"
              x2="-103.255"
              y2="295.148"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0187462" stop-color="#FC9924" />
              <stop offset="1" stop-color="#FCD645" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_408_2460"
              x1="2290.81"
              y1="665.526"
              x2="-689.946"
              y2="256.907"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#7BFDFD" />
              <stop offset="0.716346" stop-color="#2884C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default WaitingRoom;
