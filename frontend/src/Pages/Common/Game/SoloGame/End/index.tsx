import { GradientButton } from "@/components/GradientButton";

import { cn } from "@/lib/utils";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useFetchGameSessionInfoQuery } from "@/services";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const EndGame = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const {
    data: sessionData,
    isLoading,
    error,
  } = useFetchGameSessionInfoQuery(sessionCode!, {
    skip: !sessionCode,
    refetchOnMountOrArgChange: true,
  });
  const { user } = useSelector(selectAuth);

  const navigate = useNavigate();

  const correctCount = useMemo(() => {
    if (!sessionData?.data?.soloPlayer?.attemptHistory) return 0;
    return sessionData.data.soloPlayer?.attemptHistory.filter(
      (a) => a.isCorrect,
    ).length;
  }, [sessionData]);

  const attemptedCount =
    sessionData?.data?.soloPlayer?.attemptHistory?.length || 0;
  const accuracy =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const getFeedbackMessage = () => {
    if (accuracy === 100) return "Perfect Score 🏆";
    if (accuracy >= 80) return "Great Job 🔥";
    if (accuracy >= 50) return "Good Effort !";
    return "Keep Trying";
  };

  if (isLoading)
    return (
      <div className="mt-10 text-center text-lg text-orange-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="mt-10 text-center font-semibold text-red-600">
        Something Went Wrong
      </div>
    );

  if (sessionData?.data.soloPlayer?.userId !== user?._id) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-xl font-semibold text-red-700">
        ❌ Unauthorized Access
      </div>
    );
  }
  const score = sessionData?.data?.soloPlayer?.score ?? 0;
  if (sessionData?.data.status !== "completed") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-xl font-semibold text-orange-500">
        ⏳ Game is still in progress...
      </div>
    );
  }

  return (
    <>
      <div className="mb-[80px] overflow-hidden bg-black px-[20px] sm:mt-20 sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative flex h-full min-h-full flex-col items-center justify-center gap-[80px] sm:gap-[180px]">
          <div className="relative z-10 flex w-full max-w-[850px] flex-col items-center justify-center gap-10">
            <h2 className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[48px] md:text-[56px] lg:text-[64px]">
              Game Completed!
            </h2>
            <div
              className={cn(
                "relative z-[1] flex w-full max-w-[750px] flex-col gap-5 overflow-hidden rounded-[40px] bg-[linear-gradient(179.03deg,_#2884C7_0.83%,_#7BFDFD_181.09%)] p-[30px] sm:items-center sm:justify-center lg:px-[180px] lg:py-[60px]",
                score < 4680
                  ? "items-start justify-start"
                  : "items-end justify-end",
              )}
            >
              <div
                className={cn(
                  "sm:bg-[linear-gradient(180deg,_rgba(85, 197, 228, 0)_75.97%,_#55C6E4_100%)] absolute sm:h-full sm:w-fit sm:max-w-[305px]",
                  score < 4680
                    ? "right-4 top-[62px] sm:-bottom-[23px] sm:-right-[24px] sm:top-auto"
                    : "left-[7px] top-[27px] sm:-bottom-[15px] sm:-left-[24px] sm:top-auto",
                )}
              >
                <img
                  src={score < 4680 ? "/LostRe.svg" : "/soloR.svg"}
                  className="h-full w-full object-contain"
                />
              </div>

              <div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                  backgroundImage: "url('/Noise.png')",
                  backgroundRepeat: "repeat",
                }}
              />
              <div
                className={cn(
                  "relative z-10 flex w-full max-w-[220px] flex-col gap-[10px] rounded-[20px] bg-[#FFFFFF1A] px-[30px] py-5 text-white backdrop-blur-sm sm:w-fit sm:max-w-none sm:gap-2 sm:px-[60px] sm:text-center",
                  score < 4680 ? "text-left" : "text-right",
                )}
              >
                <h5 className="font-outfit text-[14px] font-normal leading-[100%] opacity-80">
                  Your Score
                </h5>
                <h4 className="font-inter text-[48px] font-semibold leading-[100%]">
                  {score}
                </h4>
                <p className="font-outfit text-[24px] font-normal leading-[100%] opacity-80">
                  {getFeedbackMessage()}
                </p>
              </div>
              <div className="relative z-10 flex w-[105%] flex-col gap-[10px] rounded-[20px] bg-[#FFFFFF1A] px-[14px] py-5 text-right text-white sm:w-fit sm:px-10">
                <table className="w-full border-separate border-spacing-x-1 border-spacing-y-2 p-0 text-center sm:border-spacing-x-3">
                  <thead>
                    <tr className="p-0">
                      <th className="p-0 font-outfit text-[14px] font-normal leading-[100%] sm:text-[16px]">
                        Name
                      </th>
                      <th className="p-0 font-outfit text-[14px] font-normal leading-[100%] sm:text-[16px]">
                        Attempted
                      </th>
                      <th className="p-0 font-outfit text-[14px] font-normal leading-[100%] sm:text-[16px]">
                        Corrected
                      </th>
                      <th className="p-0 font-outfit text-[14px] font-normal leading-[100%] sm:text-[16px]">
                        Accuracy
                      </th>
                    </tr>
                  </thead>
                  <tbody className="p-0">
                    <tr>
                      <td className="p-0 font-outfit text-[12px] font-normal leading-[100%] sm:text-[14px]">
                        {sessionData?.data.soloPlayer?.username}
                      </td>
                      <td className="p-0 font-outfit text-[12px] font-normal leading-[100%] sm:text-[14px]">
                        {attemptedCount}
                      </td>
                      <td className="p-0 font-outfit text-[12px] font-normal leading-[100%] sm:text-[14px]">
                        {correctCount}
                      </td>
                      <td className="p-0 font-outfit text-[12px] font-normal leading-[100%] sm:text-[14px]">
                        {accuracy}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-row gap-5">
              <GradientButton
                className="max-w-fit"
                icon={true}
                onClick={() => navigate(`/${user?.role}/CreateGame`)}
              >
                Play Again
              </GradientButton>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-[75px] top-[190px] z-[5px] h-[206.54px] w-[317.23px] rotate-[17.68deg] rounded-[40px] bg-[linear-gradient(180deg,_#FE8520_0%,_#FED554_100%)] blur-[50px] sm:left-[35.5%] sm:top-[15.5%] sm:h-[493.663px] sm:w-[758.051px] sm:rotate-[17.68deg] sm:blur-[126.6px]" />
        <div className="z-1 absolute -left-[3px] top-[323px] h-[261.87px] w-[294.46px] rotate-[160.75deg] rounded-[20px] bg-[linear-gradient(180deg,_#72FDFD_0%,_#021842_100%)] blur-[50px] sm:left-[21.5%] sm:top-[21.75%] sm:h-[625.774px] sm:w-[703.48px] sm:rounded-[144px] sm:blur-[126.6px]" />
      </div>
    </>
  );
};

export default EndGame;
