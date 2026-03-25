import { GradientButton } from "@/components/GradientButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useFetchScoreBoardQuery } from "@/services";
import { fireConfetti } from "@/utills/confetti";
import { Icon } from "@iconify/react";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EndGame = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const { user } = useSelector(selectAuth);
  const userId = user?._id;
  const userRole = user?.role;
  const navigate = useNavigate();

  // ❌ Don't run query if user is not ready
  const shouldSkip = !userId;
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchScoreBoardQuery(sessionCode!, { skip: shouldSkip });
  console.log(sessionData);

  const isWinner = useMemo(() => {
    return (
      sessionData?.data?.winner?.members?.some(
        (player) => player.userId === userId,
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <LoaderCircle className="mr-2 h-8 w-8 animate-spin" />
        <span>Initializing user...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white">
        <LoaderCircle className="mb-4 h-8 w-8 animate-spin" />
        <p className="animate-pulse text-xl">Fetching final results...</p>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <div className="text-center">
          <p className="mb-4 text-2xl font-semibold">Failed to load results</p>
          <Button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 transition hover:bg-rose-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { winner, loser, isDraw, teams } = sessionData.data;

  return (
    <>
      <div className="relative mb-20 flex flex-1 items-center justify-center overflow-hidden bg-black px-[20px] sm:px-[40px] md:mb-[180px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-[40px] sm:gap-[80px]">
          <div className="w-full">
            <h1 className="mb-4 text-center font-inter text-[44px] font-semibold text-white md:text-[64px]">
              Game Over
            </h1>

            {isWinner && (
              <div
                className="gradient-border mx-auto mb-10 max-w-fit animate-bounce text-center"
                style={
                  {
                    "--border-gradient":
                      "linear-gradient(93.58deg, rgba(103, 195, 255, 0.4) 8.55%, rgba(1, 10, 42, 0.4) 47.56%, rgba(103, 195, 255, 0.4) 94.76%)",
                    "--radius": `20px`,
                    "--padding": `1px`,
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[#2985C866] px-5 py-2 text-white shadow-lg">
                  <Icon icon={"noto:trophy"} className="text-2xl" />
                  <span className="font-outfit font-semibold">
                    Congratulations! You won the game!
                  </span>
                </div>
              </div>
            )}

            {isDraw ? (
              <div className="mx-auto grid w-full max-w-[1540px] grid-cols-1 gap-6 lg:grid-cols-2">
                {[
                  {
                    team: teams[0], // in a draw, winner/loser are both equal teams
                    title: "Draw!",
                    imgUrl: "/soloR.svg",
                    winMsg: "Well played!",
                  },
                  {
                    team: teams[1],
                    title: "Draw!",
                    imgUrl: "/soloR.svg",
                    winMsg: "Well played!",
                  },
                ].map(({ team, winMsg, title, imgUrl }, _idx) => {
                  console.log(team, "fdgdfgf");
                  return (
                    <div
                      key={team?.name}
                      className="relative flex flex-col gap-5 overflow-hidden rounded-[20px] bg-[linear-gradient(179.03deg,_#2884C7_0.83%,_#7BFDFD_181.09%)] p-3 sm:rounded-[40px] md:px-[30px] md:py-[30px] lg:px-[60px] xl:px-[100px] xl:py-10 2xl:px-[150px] 2xl:py-[60px]"
                    >
                      <div
                        className={cn(
                          "absolute h-[58%] w-fit sm:h-[72.5%] sm:bg-[linear-gradient(180deg,rgba(85,197,228,0)_75.97%,#55C6E4_100%)]",
                          _idx === 0
                            ? "top-[6%] sm:-bottom-[2%] sm:-left-[3%] sm:top-auto sm:max-w-[40%]"
                            : "right-[0] top-[6%] sm:-bottom-[2%] sm:-right-[3%] sm:top-auto sm:max-w-[40%]",
                        )}
                      >
                        <img
                          src={imgUrl}
                          className={cn(
                            "h-full w-full object-cover",
                            _idx === 1 && "scale-x-[-1]",
                          )}
                        />
                      </div>

                      <h2 className="hidden text-center font-inter text-5xl font-semibold leading-[100%] text-white sm:block">
                        Team{" "}
                        <span
                          className={
                            _idx === 0
                              ? `bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-transparent`
                              : `bg-[linear-gradient(180deg,_#7BFDFD_62.5%,_#2884C7_100%)] bg-clip-text text-transparent`
                          }
                        >
                          {team?.name}
                        </span>
                      </h2>

                      <h3 className="hidden bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-center font-inter text-[32px] font-semibold leading-[100%] text-transparent sm:block">
                        {title}
                      </h3>

                      <div
                        className={cn(
                          "flex max-w-fit flex-col gap-1 rounded-[20px] bg-[#FFFFFF1A] px-[30px] py-5 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] sm:mx-auto sm:items-center sm:justify-center md:px-[60px]",
                          _idx === 0
                            ? "ml-auto mr-0 items-end justify-end"
                            : "ml-0 mr-auto items-start justify-start",
                        )}
                      >
                        <p className="font-outfit text-sm font-normal leading-[100%] text-white opacity-80">
                          Final Score
                        </p>
                        <div className="font-inter text-5xl font-semibold leading-[100%] text-white">
                          {team?.score}
                        </div>
                        <p className="font-outfit text-2xl font-normal leading-[100%] text-white opacity-80">
                          {winMsg}
                        </p>
                      </div>

                      <div className="relative mx-auto flex w-[100%] flex-col gap-[10px] rounded-[20px] bg-[#FFFFFF1A] px-[14px] py-5 text-right text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] sm:w-fit sm:px-10">
                        <div className="grid grid-cols-5 gap-x-[12px] gap-y-[10px] text-center">
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Name
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Score
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Correct
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Wrong
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Total
                          </div>

                          {team?.members.map((pl) => {
                            const totalAttempts = pl.attemptHistory.length;
                            const correct = pl.attemptHistory.filter(
                              (a) => a.isCorrect,
                            ).length;
                            const wrong = totalAttempts - correct;
                            return (
                              <React.Fragment key={pl.userId}>
                                <div className="font-outfit text-[12px] sm:text-[14px]">
                                  {pl.username}
                                </div>
                                <div className="font-outfit text-[12px] sm:text-[14px]">
                                  {pl.score}
                                </div>
                                <div className="font-outfit text-[12px] sm:text-[14px]">
                                  {correct}
                                </div>
                                <div className="font-outfit text-[12px] sm:text-[14px]">
                                  {wrong}
                                </div>
                                <div className="font-outfit text-[12px] sm:text-[14px]">
                                  {totalAttempts}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mx-auto grid w-full max-w-[1540px] grid-cols-1 gap-6 lg:grid-cols-2">
                {[
                  {
                    team: winner,
                    title: "Winnns!",
                    imgUrl: "/soloR.svg",
                    winMsg: "Victory secured!",
                  },
                  {
                    team: loser,
                    title: "Loss!!",
                    imgUrl: "/LostRe.svg",
                    winMsg: "Don't give up!!",
                  },
                ].map(({ team, winMsg, title, imgUrl }, _idx) => {
                  return (
                    <div
                      key={team?.name}
                      className="relative flex flex-col gap-5 overflow-hidden rounded-[20px] bg-[linear-gradient(179.03deg,_#2884C7_0.83%,_#7BFDFD_181.09%)] p-3 md:rounded-[40px] md:px-[30px] md:py-[30px] lg:px-[60px] xl:px-[100px] xl:py-10 2xl:px-[150px] 2xl:py-[60px]"
                    >
                      <div
                        className={cn(
                          "absolute h-[58%] w-fit sm:h-[72.5%] sm:bg-[linear-gradient(180deg,rgba(85,197,228,0)_75.97%,#55C6E4_100%)]",
                          _idx === 0
                            ? "top-[6%] sm:-bottom-[2%] sm:-left-[3%] sm:top-auto sm:max-w-[40%]"
                            : "right-[2%] top-[4%] sm:-bottom-[1%] sm:-right-[4%] sm:top-auto sm:max-w-[40%]",
                        )}
                      >
                        <img
                          src={imgUrl}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h2 className="hidden text-center font-inter text-5xl font-semibold leading-[100%] text-white sm:block">
                        Team{" "}
                        <span
                          className={
                            _idx === 0
                              ? `bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-transparent`
                              : `bg-[linear-gradient(180deg,_#7BFDFD_62.5%,_#2884C7_100%)] bg-clip-text text-transparent`
                          }
                        >
                          {team?.name}
                        </span>
                      </h2>
                      <h3 className="hidden bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-center font-inter text-[32px] font-semibold leading-[100%] text-transparent sm:block">
                        {title}
                      </h3>
                      <div
                        className={cn(
                          "flex max-w-fit flex-col gap-1 rounded-[20px] bg-[#FFFFFF1A] px-[30px] py-5 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] sm:mx-auto sm:items-center sm:justify-center md:px-[60px]",
                          _idx === 0
                            ? "ml-auto mr-0 items-end justify-end"
                            : "ml-0 mr-auto items-start justify-start",
                        )}
                      >
                        <p className="font-outfit text-sm font-normal leading-[100%] text-white opacity-80">
                          Final Score
                        </p>
                        <div className="font-inter text-5xl font-semibold leading-[100%] text-white">
                          {team?.score}
                        </div>
                        <p className="font-outfit text-2xl font-normal leading-[100%] text-white opacity-80">
                          {winMsg}
                        </p>
                      </div>
                      <div className="relative mx-auto flex w-[100%] flex-col gap-[10px] rounded-[20px] bg-[#FFFFFF1A] px-[14px] py-5 text-right text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] sm:w-fit sm:px-10">
                        <div className="grid grid-cols-5 gap-x-[12px] gap-y-[10px] text-center">
                          {/* Header Row */}
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Name
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Score
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Correct
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Wrong
                          </div>
                          <div className="font-outfit text-[14px] sm:text-[16px]">
                            Total
                          </div>

                          {/* Rows */}
                          {team?.members.map((pl) => {
                            const totalAttempts = pl.attemptHistory.length;

                            const correct = pl.attemptHistory.filter(
                              (a) => a.isCorrect,
                            ).length;

                            const wrong = totalAttempts - correct;

                            return (
                              <React.Fragment key={pl.userId}>
                                <div
                                  key={`${pl.userId}-name`}
                                  className="font-outfit text-[12px] sm:text-[14px]"
                                >
                                  {pl.username}
                                </div>

                                <div
                                  key={`${pl.userId}-score`}
                                  className="font-outfit text-[12px] sm:text-[14px]"
                                >
                                  {pl.score}
                                </div>

                                <div
                                  key={`${pl.userId}-correct`}
                                  className="font-outfit text-[12px] sm:text-[14px]"
                                >
                                  {correct}
                                </div>

                                <div
                                  key={`${pl.userId}-wrong`}
                                  className="font-outfit text-[12px] sm:text-[14px]"
                                >
                                  {wrong}
                                </div>

                                <div
                                  key={`${pl.userId}-total`}
                                  className="font-outfit text-[12px] sm:text-[14px]"
                                >
                                  {totalAttempts}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="font-outfit text-[16px] font-normal leading-[100%] text-white opacity-80">
              Session Code
            </p>
            <div className="font-inter text-lg font-semibold leading-[100%] text-white">
              {sessionCode}
            </div>
          </div>
          <GradientButton
            className="max-w-fit"
            icon={true}
            onClick={() => navigate(`/${userRole}/CreateGame`)}
          >
            Play Again
          </GradientButton>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[36%] z-[5] h-[261.87px] sm:h-[384px] md:h-[500px] w-[75%] rotate-[160.75deg] rounded-[20px] bg-aqua-abyss opacity-60 blur-[11.6px] lg:top-auto  lg:bottom-[195px] lg:left-[75px] lg:h-[641.07px] lg:w-[36.6%] lg:rounded-[144px] lg:blur-[56.6px]" />

        <div className="absolute -right-[22%] top-[28%] h-[206.5px] w-[80%] sm:h-[330px] md:h-[400px] rotate-[17.68deg] rounded-[40px] bg-orange-sun opacity-60 blur-[11.6px] lg:bottom-[182px] lg:right-[60px] lg:top-auto lg:h-[493.38px] lg:w-[39.5%] lg:blur-[56.6px]" />
      </div>
    </>
  );
};

export default EndGame;
