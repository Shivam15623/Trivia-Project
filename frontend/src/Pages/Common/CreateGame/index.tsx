type GameMode = "TEAM" | "SOLO" | "TIMED";

import PlayCard from "@/components/PlayCard";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import SoloGameTab from "./components/SoloGameTab";
import TeamGameTab from "./components/TeamGameTab";
import TimedGameTab from "./components/TimedGameTab";
import { cn } from "@/lib/utils";

// ── Valid modes (single source of truth) ──────────────────────────────────────
const VALID_MODES: GameMode[] = ["TEAM", "SOLO", "TIMED"];
const DEFAULT_MODE: GameMode = "SOLO";
const TIME_OPTIONS = [10, 20, 30];
const DEFAULT_TIME = TIME_OPTIONS[0];

// ── Helper: parse raw string → GameMode | null ────────────────────────────────
function parseMode(raw: string | null): GameMode | null {
  if (!raw) return null;
  const upper = raw.toUpperCase() as GameMode;
  return VALID_MODES.includes(upper) ? upper : null;
}

const CreateGame = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTime, setSelectedTime] = useState<number>(DEFAULT_TIME);

  // ── Derive mode from URL, fall back to default ────────────────────────────
  const rawMode = searchParams.get("mode");
  const parsedMode = parseMode(rawMode);

  // If URL has an invalid/missing mode, normalise it once on mount
  useEffect(() => {
    if (!parsedMode) {
      // Replace so the browser back button doesn't loop through bad URLs
      setSearchParams({ mode: DEFAULT_MODE.toLowerCase() }, { replace: true });
    }
  }, []); // intentionally only on mount

  // Resolved mode — always a valid GameMode
  const selectedMode: GameMode = parsedMode ?? DEFAULT_MODE;

  // ── Mode change: write to URL (history entry so back button works) ─────────
  const handleModeChange = useCallback(
    (mode: GameMode) => {
      // Reset time selection when switching away from TIMED
      if (mode !== "TIMED") setSelectedTime(DEFAULT_TIME);
      setSearchParams({ mode: mode.toLowerCase() });
    },
    [setSearchParams],
  );

  // ── Time change ────────────────────────────────────────────────────────────
  const handleTimeChange = useCallback((time: number) => {
    setSelectedTime(time);
  }, []);

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-black">
        <div className="relative flex flex-col gap-[80px] sm:gap-[180px]">
          <section className="Mode relative z-10 mt-0 flex flex-col items-center justify-center gap-[40px] sm:mt-[80px] sm:gap-[80px]">
            <div className="flex flex-row px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
              <img src="/watermelon.svg" alt="" className="hidden sm:block" />
              <div className="flex flex-col gap-[14px] text-center">
                <h1
                  className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white md:text-[64px] md:leading-[70px]"
                  style={{ letterSpacing: "-1%", textTransform: "capitalize" }}
                >
                  <span className="bg-sunset bg-clip-text text-transparent">
                    Create Your
                  </span>{" "}
                  Game
                </h1>
                <h3
                  className="mx-auto max-w-[335px] text-center font-outfit text-[14px] font-normal leading-[100%] text-white md:max-w-[504px] md:text-[24px]"
                  style={{ letterSpacing: "0%" }}
                >
                  Choose how you want to play, pick categories and start the
                  challenge.
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center gap-5 px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
                <h3
                  className="text-center font-outfit text-[14px] font-normal leading-[100%] text-white opacity-50 sm:text-[24px]"
                  style={{ letterSpacing: "0%" }}
                >
                  Select Mode
                </h3>
                <div className="mx-auto flex w-full max-w-[1280px] flex-wrap justify-center gap-5 md:gap-8 lg:gap-[70px]">
                  <div className="h-[370px] w-full sm:w-[48%] md:h-[400px] md:w-[42%] lg:h-[424px] lg:w-[380px]">
                    <PlayCard
                      color="#FED846"
                      image="/team-2.png"
                      title="Team"
                      subTitle="Team up with your friends! Combine scores and conquer together."
                      isSelected={selectedMode === "TEAM"}
                      selectChange={() => handleModeChange("TEAM")}
                    />
                  </div>

                  <div className="h-[370px] w-full sm:w-[48%] md:h-[400px] md:w-[42%] lg:h-[424px] lg:w-[380px]">
                    <PlayCard
                      color="#FE9B24"
                      image="/solo-2.png"
                      title="Solo"
                      subTitle="Just you against the questions. Perfect for a quick brain workout."
                      isSelected={selectedMode === "SOLO"}
                      selectChange={() => handleModeChange("SOLO")}
                    />
                  </div>

                  <div className="h-[370px] w-full sm:w-[48%] md:h-[400px] md:w-[42%] lg:h-[424px] lg:w-[380px]">
                    <PlayCard
                      color="#3BCCF6"
                      image="/alarm-2.png"
                      title="Timed"
                      subTitle="Tick-tock! Beat the clock on each question. Maximum pressure, maximum fun!"
                      isSelected={selectedMode === "TIMED"}
                      selectChange={() => handleModeChange("TIMED")}
                    />
                  </div>
                </div>
              </div>
              {selectedMode === "TIMED" && (
                <div className="flex flex-col gap-4 self-end px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
                  <span className="ml-auto font-outfit text-[20px] text-white opacity-60 sm:text-[24px]">
                    Per Question
                  </span>
                  <div className="flex flex-wrap justify-end gap-4">
                    {TIME_OPTIONS.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <div
                          key={time}
                          onClick={() => handleTimeChange(time)}
                          className={cn(
                            "gradient-border cursor-pointer transition-all duration-200",
                            isSelected && "scale-105",
                          )}
                          style={
                            {
                              "--border-gradient": isSelected
                                ? "linear-gradient(90deg, #7BFDFD, #FA9923)"
                                : "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
                              "--radius": "20px",
                              "--padding": "1px",
                            } as React.CSSProperties
                          }
                        >
                          <div
                            className={cn(
                              "relative z-10 flex h-[40px] items-center justify-center rounded-[20px] px-6 font-outfit text-[16px] transition-all duration-200 sm:text-[18px]",
                              isSelected
                                ? "bg-[#2985C8] text-white shadow-lg"
                                : "bg-transparent text-white hover:bg-[#2985C866]",
                            )}
                          >
                            {time} Sec
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {selectedMode && selectedMode === "SOLO" && <SoloGameTab />}
          {selectedMode && selectedMode === "TEAM" && <TeamGameTab />}
          {selectedMode && selectedMode === "TIMED" && (
            <TimedGameTab timerDuration={selectedTime} />
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[23%] z-0 h-[641.07px] w-[417.23px] -rotate-[45deg] rounded-[40px] bg-orange-sun opacity-80 blur-[51.6px] sm:rotate-[17.68deg] md:right-[3.5%] md:z-[2] md:h-[604.663px] lg:top-[7.5%] lg:w-[48.39%]" />

        <div className="absolute -left-[121px] top-[220px] z-[2] h-[508.8px] w-[700.54px] rotate-[150.39deg] rounded-[132px] bg-aqua-abyss opacity-80 blur-[51.6px] sm:h-[696.774px] md:z-0 lg:left-[11%] lg:top-[7%] lg:w-[40.81%]" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2426"
          height="970"
          className="pointer-events-none absolute bottom-[113px] max-h-[600px] w-[1920px] max-w-[1200px] sm:max-h-none sm:max-w-none sm:rotate-0"
          viewBox="0 0 1920 970"
          fill="none"
        >
          <g opacity="0.5" filter="url(#filter0_f_342_1557)">
            <path
              d="M1924.85 878.796C1730.03 782.934 1403.03 705.218 1002.68 688.82C303.077 660.164 -44.3887 638.305 -221.526 552.201L-194.355 489.777L-179.626 281.855C74.6818 407.879 438.211 478.942 1121.25 490.743C1547.31 502.145 1886.38 563.404 2014.58 620.317L1924.85 878.796Z"
              fill="url(#paint0_linear_342_1557)"
            />
          </g>
          <g opacity="0.5" filter="url(#filter1_f_342_1557)">
            <path
              d="M-44.8442 167.6C130.282 269.624 310.309 342.78 788.569 388.762C1343.79 442.144 1891.36 431.679 2050.74 523.607L2039.86 752.251L1933.93 735.104C1830.8 675.129 1106.41 653.499 446.768 552.044C276.562 525.866 198.051 534.984 -141.171 399.761L-44.8442 167.6Z"
              fill="url(#paint1_linear_342_1557)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_342_1557"
              x="-312.325"
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
                result="effect1_foregroundBlur_342_1557"
              />
            </filter>
            <filter
              id="filter1_f_342_1557"
              x="-252.772"
              y="55.9996"
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
                result="effect1_foregroundBlur_342_1557"
              />
            </filter>
            <linearGradient
              id="paint0_linear_342_1557"
              x1="1957.62"
              y1="704.565"
              x2="-124.253"
              y2="295.148"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0187462" stop-color="#FC9924" />
              <stop offset="1" stop-color="#FCD645" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_342_1557"
              x1="2269.81"
              y1="665.527"
              x2="-710.946"
              y2="256.908"
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

export default CreateGame;
