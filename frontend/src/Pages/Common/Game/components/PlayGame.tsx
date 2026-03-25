import { cn } from "@/lib/utils";
import React from "react";
import { useParams } from "react-router-dom";
import { useGameEngine } from "../hooks/useGameEngine";
import { GradientButton } from "@/components/GradientButton";

const PlayGame = () => {
  const { sessionCode } = useParams<{ sessionCode: string }>();

  const {
    sessionInfo,
    questionData,
    isLoading,
    error,
    selectedOption,
    selectedIndex,
    setSelectedOption,
    setSelectedIndex,
    handleSubmit,
    isSubmitting,
    hasSubmitted,
    answerResult,
    isTransitioning, // ✅ new
  } = useGameEngine(sessionCode!);

  if (isLoading || !questionData || !sessionInfo) {
    return (
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        {/* Same layout structure as the real game */}
        <div className="relative z-10 mx-auto flex h-fit w-full max-w-[1096px] flex-col items-center justify-center gap-10">
          {/* Team banner skeleton */}
          <div className="h-[60px] w-[280px] animate-pulse rounded-[20px] bg-white/10" />

          {/* Question card skeleton */}
          <div className="flex w-full flex-col gap-4 rounded-[20px] bg-white/10 p-6">
            {/* Category name */}
            <div className="h-6 w-32 animate-pulse rounded-md bg-white/10" />
            {/* Question image */}
            <div className="mx-auto aspect-video w-full animate-pulse rounded-xl bg-white/10" />
            {/* Question text */}
            <div className="mx-auto h-8 w-3/4 animate-pulse rounded-md bg-white/10" />
          </div>

          {/* Options skeleton */}
          <div className="grid w-full grid-cols-1 gap-[18px] sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[58px] animate-pulse rounded-[10px] bg-white/10"
                style={{
                  animationDelay: `${i * 100}ms`, // ✅ staggered feel
                }}
              />
            ))}
          </div>
        </div>

        {/* Same background SVG so it doesn't flash */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2426"
            height="823"
            viewBox="0 0 1920 823"
            className="absolute bottom-[120px] max-h-[900px] w-[1920px] max-w-[1400px] sm:-bottom-[57px] sm:max-h-none sm:max-w-none sm:rotate-0"
            fill="none"
          >
            <g opacity="0.5" filter="url(#filter0_f_457_1966)">
              <path
                d="M1946.85 878.796C1752.03 782.934 1425.03 705.218 1024.68 688.82C325.077 660.164 -22.3887 638.305 -199.526 552.201L-172.355 489.777L-157.626 281.855C96.6818 407.879 460.211 478.942 1143.25 490.743C1569.31 502.145 1908.38 563.404 2036.58 620.317L1946.85 878.796Z"
                fill="url(#paint0_linear_457_1966)"
              />
            </g>
            <g opacity="0.5" filter="url(#filter1_f_457_1966)">
              <path
                d="M-22.8442 167.6C152.282 269.624 332.309 342.78 810.569 388.762C1365.79 442.144 1913.36 431.679 2072.74 523.607L2061.86 752.251L1955.93 735.104C1852.8 675.129 1128.41 653.499 468.768 552.044C298.562 525.866 220.051 534.984 -119.171 399.761L-22.8442 167.6Z"
                fill="url(#paint1_linear_457_1966)"
              />
            </g>
            <defs>
              <filter
                id="filter0_f_457_1966"
                x="-290.327"
                y="191.055"
                width="2417.71"
                height="778.541"
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
                  result="effect1_foregroundBlur_457_1966"
                />
              </filter>
              <filter
                id="filter1_f_457_1966"
                x="-230.772"
                y="55.9996"
                width="2415.11"
                height="807.852"
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
                  result="effect1_foregroundBlur_457_1966"
                />
              </filter>
              <linearGradient
                id="paint0_linear_457_1966"
                x1="1979.62"
                y1="704.565"
                x2="-102.253"
                y2="295.148"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.0187462" stopColor="#FC9924" />
                <stop offset="1" stopColor="#FCD645" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_457_1966"
                x1="2291.81"
                y1="665.527"
                x2="-688.946"
                y2="256.908"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7BFDFD" />
                <stop offset="0.716346" stopColor="#2884C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-black">
        <p className="font-inter text-lg text-red-400">
          Failed to load game session. Please try again.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col overflow-hidden px-4 sm:items-center sm:justify-center">
        <div className="relative z-10 mx-auto h-fit w-full max-w-[1096px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0">
          <div className="flex flex-col gap-6 py-6">
            {/* Question Card */}
            <div
              className={cn("gradient-border w-full")}
              style={
                {
                  "--border-gradient":
                    "linear-gradient(90.26deg, #2884C7 1.43%, #7BFDFD 36.33%, #FA9923 66.99%, #FF6E01 99.54%)",
                  "--radius": "20px",
                  "--padding": "3px",
                } as React.CSSProperties
              }
            >
              <div className="relative z-10 flex h-full flex-col gap-3.5 rounded-[20px] bg-[#FFFFFF1A] px-[30px] pb-3.5 pt-10 font-outfit text-[18px] font-normal text-white sm:px-6">
                {answerResult && (
                  <div
                    className={cn(
                      "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-[20px] backdrop-blur-sm",
                      answerResult.isCorrect
                        ? "bg-green-500/20"
                        : "bg-red-500/20",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full text-4xl",
                        answerResult.isCorrect
                          ? "bg-green-500/30"
                          : "bg-red-500/30",
                      )}
                    >
                      {answerResult.isCorrect ? "✓" : "✗"}
                    </div>

                    <p
                      className={cn(
                        "font-inter text-2xl font-bold",
                        answerResult.isCorrect
                          ? "text-green-400"
                          : "text-red-400",
                      )}
                    >
                      {answerResult.isCorrect ? "Correct!" : "Wrong!"}
                    </p>

                    {answerResult.answerImage && (
                      <img
                        src={answerResult.answerImage}
                        alt="answer"
                        className="max-h-[180px] w-[70%] rounded-xl object-contain"
                      />
                    )}

                    <p className="font-outfit text-lg text-white">
                      Correct answer:{" "}
                      <span className="font-semibold text-green-400">
                        {answerResult.correctAnswer}
                      </span>
                    </p>

                    {answerResult.isCorrect && (
                      <p className="font-outfit text-base text-white/70">
                        +{answerResult.pointsAwarded} pts
                      </p>
                    )}

                    <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full w-full rounded-full bg-white"
                        style={{ animation: "shrink 2.5s linear forwards" }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-row items-center justify-between font-inter text-2xl font-medium leading-[100%] text-white">
                  <h4 className="font-inter text-sm font-medium leading-[100%] text-white sm:text-2xl">
                    {questionData?.category.name}
                  </h4>
                </div>

                {/* ✅ Hide stale image during transition, show skeleton instead */}
                {isTransitioning ? (
                  <div className="mx-auto aspect-video w-full max-w-none animate-pulse rounded-xl bg-white/10 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl" />
                ) : (
                  <img
                    src={questionData?.questionImage}
                    alt="question image"
                    className="mx-auto aspect-video w-full max-w-none object-contain sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
                  />
                )}

                <h3 className="text-center font-outfit text-sm font-medium leading-[150%] text-white sm:leading-[100%] lg:text-[32px]">
                  {questionData?.questionText}
                </h3>
              </div>
            </div>

            {/* ✅ Options locked during transition to prevent clicks on stale data */}
            <div
              className={cn(
                "grid grid-cols-1 gap-[18px] sm:grid-cols-2",
                isTransitioning && "pointer-events-none opacity-40",
              )}
            >
              {questionData?.options.map((option, index) => {
                const isSelected = selectedIndex === index;

                const baseGradient = isSelected
                  ? "rgba(255,255,255,0.1)"
                  : index === 1 || index === 2
                    ? "linear-gradient(180deg, #FF6D00 0%, #FA9923 100%)"
                    : "linear-gradient(179.03deg, #2884C7 0.83%, #7BFDFD 181.09%)";

                const selectedBorderGradient =
                  "linear-gradient(90.26deg, #2884C7 1.43%, #7BFDFD 36.33%, #FA9923 66.99%, #FF6E01 99.54%)";

                const innerCard = (
                  <div
                    onClick={() => {
                      if (hasSubmitted) return;
                      setSelectedIndex(index);
                      setSelectedOption(option);
                    }}
                    className="relative flex h-[58px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[10px] p-5 font-outfit text-[18px] text-white transition-all duration-200 ease-out hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]"
                    style={{ background: baseGradient }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{ backgroundImage: "url('/Noise.png')" }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-200 hover:opacity-20" />
                    <span className="relative z-10 font-medium">{option}</span>
                  </div>
                );

                return isSelected ? (
                  <div
                    key={index}
                    className="gradient-border overflow-hidden transition-all duration-200 ease-out hover:scale-[1.03]"
                    style={
                      {
                        "--border-gradient": selectedBorderGradient,
                        "--radius": "12px",
                        "--padding": "3px",
                      } as React.CSSProperties
                    }
                  >
                    <div className="relative z-10 flex h-full">{innerCard}</div>
                  </div>
                ) : (
                  <div key={index}>{innerCard}</div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex flex-row items-center justify-center gap-3.5 py-2">
              <GradientButton
                onClick={handleSubmit}
                icon={false}
                disabled={
                  !selectedOption ||
                  hasSubmitted ||
                  isSubmitting ||
                  isTransitioning
                } // ✅ also disabled during transition
                className={cn(
                  "transition-opacity",
                  (!selectedOption ||
                    hasSubmitted ||
                    isSubmitting ||
                    isTransitioning) &&
                    "cursor-not-allowed opacity-50",
                )}
              >
                {isSubmitting
                  ? "Submitting..."
                  : hasSubmitted
                    ? "Submitted"
                    : "Submit"}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="2426"
          height="823"
          viewBox="0 0 1920 823"
          className="absolute bottom-[120px] max-h-[900px] w-[1920px] max-w-[1400px] sm:-bottom-[57px] sm:max-h-none sm:max-w-none sm:rotate-0"
          fill="none"
        >
          <g opacity="0.5" filter="url(#filter0_f_457_1966)">
            <path
              d="M1946.85 878.796C1752.03 782.934 1425.03 705.218 1024.68 688.82C325.077 660.164 -22.3887 638.305 -199.526 552.201L-172.355 489.777L-157.626 281.855C96.6818 407.879 460.211 478.942 1143.25 490.743C1569.31 502.145 1908.38 563.404 2036.58 620.317L1946.85 878.796Z"
              fill="url(#paint0_linear_457_1966)"
            />
          </g>
          <g opacity="0.5" filter="url(#filter1_f_457_1966)">
            <path
              d="M-22.8442 167.6C152.282 269.624 332.309 342.78 810.569 388.762C1365.79 442.144 1913.36 431.679 2072.74 523.607L2061.86 752.251L1955.93 735.104C1852.8 675.129 1128.41 653.499 468.768 552.044C298.562 525.866 220.051 534.984 -119.171 399.761L-22.8442 167.6Z"
              fill="url(#paint1_linear_457_1966)"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_457_1966"
              x="-290.327"
              y="191.055"
              width="2417.71"
              height="778.541"
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
                result="effect1_foregroundBlur_457_1966"
              />
            </filter>
            <filter
              id="filter1_f_457_1966"
              x="-230.772"
              y="55.9996"
              width="2415.11"
              height="807.852"
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
                result="effect1_foregroundBlur_457_1966"
              />
            </filter>
            <linearGradient
              id="paint0_linear_457_1966"
              x1="1979.62"
              y1="704.565"
              x2="-102.253"
              y2="295.148"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0187462" stopColor="#FC9924" />
              <stop offset="1" stopColor="#FCD645" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_457_1966"
              x1="2291.81"
              y1="665.527"
              x2="-688.946"
              y2="256.908"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7BFDFD" />
              <stop offset="0.716346" stopColor="#2884C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default PlayGame;
