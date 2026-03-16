import { GradientButton } from "@/components/GradientButton";
import { showWarning } from "@/components/toastUtills";
import { cn } from "@/lib/utils";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
  const navigate = useNavigate();

  const [sessionCode, setSessionCode] = useState("");
  const handleJoinSession = () => {
    if (!sessionCode.trim()) {
      showWarning("Please enter a session code.");
      return;
    }
    navigate(`/game/Waitingroom/${sessionCode}`);
  };
  return (
    <>
      <div className="flex-1 overflow-hidden bg-black px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative flex flex-col gap-[80px] sm:gap-[180px]">
          <div
            className={cn(
              "gradient-border",
              "relative z-10 mx-auto block h-[40px] max-w-[135px] sm:hidden",
            )}
            style={
              {
                "--border-gradient":
                  "linear-gradient(93.58deg, rgba(103, 195, 255, 0.4) 8.55%, rgba(1, 10, 42, 0.4) 47.56%, rgba(103, 195, 255, 0.4) 94.76%)",
                "--radius": `20px`,
                "--padding": `1px`,
              } as React.CSSProperties
            }
          >
            <div className="relative z-10 flex h-full flex-row items-center justify-center gap-[10px] rounded-[20px] bg-[#2985C866] px-5 font-outfit text-[14px] font-normal text-white">
              <span className="h-[10px] w-[10px] rounded-full bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)]" />
              <span>Team Battle</span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-6">
            <h2 className="mt-6 hidden bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_83.17%)] bg-clip-text text-center text-[64px] font-semibold leading-[100%] text-transparent sm:block">
              Join Games
            </h2>

            <GradientCard
              padding={3}
              radius={20}
              gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
              className="mb-[80px] w-full max-w-[600px] bg-[#FFFFFF1A] sm:mb-[180px]"
            >
              <div className="flex flex-col items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 md:px-14">
                <h4 className="text-center font-outfit text-lg text-white opacity-80 sm:text-xl md:text-2xl">
                  Add Session Code
                </h4>

                <input
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  className="h-10 w-full rounded-full bg-white/20 px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                  placeholder="e.g. Ultimate Friday Night Quiz"
                />

                <GradientButton
                  onClick={handleJoinSession}
                  icon={false}
                  type="button"
                  className="w-full sm:w-auto"
                >
                  Join Game
                </GradientButton>
              </div>
            </GradientCard>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[109px] top-[133.68px] z-[7] h-[328.07px] w-[504.23px] rotate-[17.68deg] rounded-[40px] bg-orange-sun opacity-60 blur-[65.6px] sm:left-auto sm:right-[83px] sm:top-[195px] sm:h-[604.663px] sm:w-[929.051px]" />
        <div className="absolute -left-[235px] top-[100px] z-[4] h-[378px] w-[425px] rotate-[150.39deg] rounded-[132px] bg-aqua-abyss opacity-60 blur-[65.6px] sm:left-[230px] sm:top-[179px] sm:h-[696.774px] sm:w-[783.48px]" />
      </div>
    </>
  );
};

export default JoinGame;
