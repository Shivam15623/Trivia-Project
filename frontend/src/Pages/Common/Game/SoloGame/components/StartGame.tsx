import { GradientButton } from "@/components/GradientButton";
import Loader from "@/components/Loader";
import { showSuccess } from "@/components/toastUtills";
import { Button } from "@/components/ui/button";
import { Category } from "@/interfaces/categoriesInterface";
import { GameSession } from "@/interfaces/GameSessionInterface";
import { cn } from "@/lib/utils";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import { useEndSoloGameMutation, useStartSoloGameMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface StartGameProps {
  session: GameSession;
}
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
            loading="lazy"
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
const StartGame: React.FC<StartGameProps> = ({ session }) => {
  const { sessionCode } = useParams<{ sessionCode: string }>();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);


  const [startGame, { isLoading: isStarting }] = useStartSoloGameMutation();
  const [endGame, { isLoading: isEnding }] = useEndSoloGameMutation();

  /* 🔥 Start Game */
  const handleStartGame = async () => {
    try {
      const response = await startGame(session._id).unwrap();

      if (response.success) {
        showSuccess(response.message);

        // ── Navigate to game screen based on mode ──────────────────────────
        // TimedSoloGame mounts here — hook auto-joins room and emits player-ready
        if (session.mode === "timed_solo") {
          navigate(`/game/timed/${sessionCode}`, {
            state: {
              sessionId: session._id, // hook needs this for submit-answer
              sessionCode: sessionCode, // hook needs this for room join
            },
          });
        } else {
          // Regular solo — goes to the existing REST-based game screen
          navigate(`/game/SoloGame/${sessionCode}`);
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  /* 🔥 End Game */
  const handleEndGame = async () => {
    try {
      const response = await endGame(sessionCode!).unwrap();

      if (response.success) {
        showSuccess(response.message);
        navigate(`/${user?.role}/CreateGame`);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isStarting || isEnding) return <Loader />;

  return (
    <>
      <div className="relative flex-1 overflow-hidden bg-black px-[20px] sm:mt-20 sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="relative z-10 flex h-full min-h-full flex-col gap-[80px] sm:gap-[180px]">
          <div className="mx-auto flex flex-col justify-center gap-6">
            {/* Title */}
            <div className="flex flex-col items-center gap-3.5 text-center">
              <h2 className="bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)] bg-clip-text font-inter text-[28px] font-semibold text-transparent sm:text-[44px]">
                {session.title}
              </h2>

              <div
                className={cn("gradient-border", "h-[40px]")}
                style={
                  {
                    "--border-gradient":
                      "linear-gradient(93.58deg, rgba(103,195,255,0.4) 8.55%, rgba(1,10,42,0.4) 47.56%, rgba(103,195,255,0.4) 94.76%)",
                    "--radius": `20px`,
                    "--padding": `1px`,
                  } as React.CSSProperties
                }
              >
                <div className="relative z-10 flex h-full items-center justify-center gap-[10px] rounded-[20px] bg-[#2985C866] px-5 font-outfit text-[18px] text-white">
                  <span className="h-[10px] w-[10px] rounded-full bg-[linear-gradient(180deg,_#7BFDFD_38.94%,_#2884C7_61.54%)]" />
                  <span>Solo Game</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <h4 className="hidden font-outfit text-[14px] text-white opacity-50 sm:block sm:text-[24px]">
              Categories
            </h4>

            <div className="grid max-w-[1200px] grid-cols-2 gap-x-[21px] gap-y-[21px] sm:gap-x-20 sm:gap-y-6 md:grid-cols-3 xl:grid-cols-4">
              {/* First Row */}
              {session.categories.slice(0, 4).map((cat) => (
                <CategoryCard key={cat._id} cat={cat} />
              ))}
              {/* Second Row */}
              <div className="hidden xl:block" /> {/* empty cell */}
              {session.categories.slice(4, 6).map((cat) => (
                <CategoryCard key={cat._id} cat={cat} />
              ))}
              <div className="hidden xl:block" /> {/* empty cell */}
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <GradientButton
                onClick={handleStartGame}
                className="w-full max-w-[168px]"
                icon
              >
                Start Game
              </GradientButton>

              <Button
                className={cn(
                  "gradient-border group w-full max-w-[168px]",
                  "flex h-[40px] items-center px-5 py-0",
                  "transition-all duration-200 active:scale-95", // ✅ press effect
                )}
                onClick={handleEndGame}
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
                  End Game
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[29%] lg:w-[48.39%]" />

        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[31%] lg:w-[40.81%]" />
      </div>
    </>
  );
};

export default StartGame;
