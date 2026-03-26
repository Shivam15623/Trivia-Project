import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

import { GradientButton } from "@/components/GradientButton";
import { useSocket } from "@/hooks/useSocket";
import { useTimedSoloGame } from "./useTimeSolo";
import {
  useFetchCurrentQuestionQuery,
  useFetchGameSessionInfoQuery,
} from "@/services";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/AuthSlice/authSlice";

export default function TimedSoloGame() {
  const { sessionCode: codeFromParam } = useParams<{ sessionCode: string }>();
  const location = useLocation();
  const { user } = useSelector(selectAuth);
  const sessionCode = (location.state?.sessionCode ?? codeFromParam) as string;

  const { data: QuestionFromApi, isLoading } = useFetchCurrentQuestionQuery(
    sessionCode,
    { skip: !sessionCode, refetchOnMountOrArgChange: true },
  );
  const { data: sessionFromApi, isLoading: sinfoLoading } =
    useFetchGameSessionInfoQuery(sessionCode, {
      skip: !sessionCode,
      refetchOnMountOrArgChange: true,
    });

  const navigate = useNavigate();
  const socket = useSocket();

  const { state, submitAnswer, clearReveal } = useTimedSoloGame({
    socket,
    sessionCode,
    initialQuestion: QuestionFromApi?.data ?? null,
    onGameEnd: () => {
      console.log(`[UI] onGameEnd fired — navigating to SoloGameEnd`);
      navigate(`/game/SoloGameEnd/${sessionCode}`);
    },
  });

  const {
    phase,
    displayQuestion,
    remainingMs,
    timerPct,
    reveal,
    isReconnecting,
    isWaitingForServer,
    error,
  } = state;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const skipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [revealExiting, setRevealExiting] = useState(false);

  // ── Log every phase change ─────────────────────────────────────────────────
  const prevPhaseRef = useRef<typeof phase | null>(null);
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      console.log(
        `[UI] phase changed  ${prevPhaseRef.current ?? "—"} → ${phase}`,
      );
      prevPhaseRef.current = phase;
    }
  }, [phase]);

  // ── Log every displayQuestion change ──────────────────────────────────────
  const prevDisplayQRef = useRef<string | null>(null);
  useEffect(() => {
    const newId = displayQuestion?.questionId ?? null;
    if (prevDisplayQRef.current !== newId) {
      console.log(
        `[UI] displayQuestion changed  ${prevDisplayQRef.current ?? "—"} → ${newId ?? "null"}`,
      );
      prevDisplayQRef.current = newId;
    }
  }, [displayQuestion]);

  // ── Log reveal changes ────────────────────────────────────────────────────
  useEffect(() => {
    if (reveal) {
      console.log(
        `[UI] reveal appeared  source=${reveal.source}  isCorrect=${reveal.isCorrect}  correctAnswer="${reveal.correctAnswer}"`,
      );
    } else {
      console.log(`[UI] reveal cleared`);
    }
  }, [reveal]);

  // ── Clear selection when new question arrives ─────────────────────────────
  useEffect(() => {
    if (phase === "ACTIVE") {
      console.log(`[UI] phase=ACTIVE — clearing selectedIndex and showSkip`);
      setSelectedIndex(null);
      setShowSkip(false);
    }
  }, [phase]);

  const triggerRevealExit = useCallback(() => {
    if (revealExiting) {
      console.log(
        `[UI] triggerRevealExit called but already exiting — skipped`,
      );
      return;
    }
    console.log(
      `[UI] triggerRevealExit — starting overlay exit animation (350ms)`,
    );
    setRevealExiting(true);
    setTimeout(() => {
      console.log(`[UI] triggerRevealExit — 350ms done, calling clearReveal`);
      setRevealExiting(false);
      clearReveal();
    }, 350);
  }, [revealExiting, setRevealExiting, clearReveal]);

  // ── Skip timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "REVEALING") {
      console.log(
        `[UI] REVEALING started — arming auto-dismiss at 2500ms, skip unlock at 1200ms`,
      );
      // Show skip button at 1200ms
      const skipUnlock = setTimeout(() => {
        console.log(`[UI] skip button unlocked`);
        setShowSkip(true);
      }, 1200);
      // Auto dismiss at 2500ms
      skipTimerRef.current = setTimeout(() => {
        console.log(`[UI] auto-dismiss timeout fired (2500ms)`);
        triggerRevealExit();
      }, 2500);
      return () => {
        clearTimeout(skipUnlock);
        if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      };
    }
  }, [phase, triggerRevealExit]);

  const optionsLocked = phase !== "ACTIVE";

  const timerBarColor =
    timerPct > 0.4 ? "#2884C7" : timerPct > 0.2 ? "#FA9923" : "#FF4444";

  const statusText: Record<typeof phase, string> = {
    IDLE: "Loading…",
    ACTIVE: "Choose your answer",
    SUBMITTING: "Submitting…",
    TIME_UP_WAIT: "Time's up — waiting for server…",
    REVEALING:
      reveal?.source === "answer"
        ? reveal.isCorrect
          ? "Correct!"
          : "Incorrect"
        : "Time's up!",
    ENDED: "Game over",
  };

  function handleSubmit() {
    if (selectedIndex === null || !displayQuestion || optionsLocked) {
      console.log(
        `[UI] handleSubmit blocked  selectedIndex=${selectedIndex}  hasQuestion=${!!displayQuestion}  optionsLocked=${optionsLocked}`,
      );
      return;
    }
    console.log(
      `[UI] handleSubmit  selectedIndex=${selectedIndex}  questionId=${displayQuestion.questionId}  answer="${displayQuestion.options[selectedIndex]}"`,
    );
    submitAnswer(selectedIndex, displayQuestion.questionId);
  }

  const isWaitingForQuestion =
    (isLoading || sinfoLoading || phase === "IDLE") && !displayQuestion;

  if (isWaitingForQuestion) {
    console.log(
      `[UI] waiting for question  isLoading=${isLoading}  sinfoLoading=${sinfoLoading}  phase=${phase}`,
    );
    return (
      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#7BFDFD]" />
          </div>
          <p className="font-outfit text-sm text-white/50">Loading game…</p>
        </div>
      </div>
    );
  }

  const isUnauthorized =
    !sinfoLoading &&
    sessionFromApi?.data &&
    sessionFromApi.data.soloPlayer?.userId !== user?._id;

  if (isUnauthorized) {
    console.warn(`[UI] unauthorized — userId mismatch`);
    return (
      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.96L13.75 4a2 2 0 00-3.5 0L3.25 16A2 2 0 005.07 19z"
              />
            </svg>
          </div>
          <div>
            <p className="font-outfit text-xl font-semibold text-white">
              Not Your Game
            </p>
            <p className="mt-1.5 font-outfit text-sm text-white/50">
              This session belongs to a different player. You can only play your
              own games.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 rounded-xl border border-white/10 px-6 py-2.5 font-outfit text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (error?.includes("not the player")) {
    console.warn(`[UI] error includes "not the player" — showing error screen`);
    return (
      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.75-2.96L13.75 4a2 2 0 00-3.5 0L3.25 16A2 2 0 005.07 19z"
              />
            </svg>
          </div>
          <p className="font-outfit text-xl font-semibold text-white">
            Not Your Game
          </p>
          <p className="font-outfit text-sm text-white/50">
            This session belongs to a different player.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 rounded-xl border border-white/10 px-6 py-2.5 font-outfit text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col overflow-hidden px-4 sm:items-center sm:justify-center">
        <div className="relative z-10 mx-auto h-fit w-full max-w-[1096px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0">
          <div className="flex flex-col gap-6 py-6">
            {isReconnecting && (
              <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
                Reconnecting — your progress is saved
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            {/* ── Timer bar ─────────────────────────────────────────────── */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              {isWaitingForServer ? (
                <div
                  className="h-full w-full rounded-full bg-[#FF4444]"
                  style={{ animation: "pulse 1s ease-in-out infinite" }}
                />
              ) : (
                <div
                  className="h-full rounded-full transition-colors duration-500"
                  style={{
                    width: `${timerPct * 100}%`,
                    backgroundColor: timerBarColor,
                  }}
                />
              )}
            </div>

            {/* ── Timer label ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between font-inter text-sm text-white/60">
              <span>{displayQuestion?.category.name}</span>
              <span>{Math.ceil(remainingMs / 1000)}s</span>
            </div>

            {/* ── Question card ─────────────────────────────────────────── */}
            <div
              className={cn("gradient-border w-full")}
              style={
                {
                  "--border-gradient":
                    "linear-gradient(90.26deg, #2884C7 1.43%, #7BFDFD 36.33%, #FA9923 66.99%, #FF6E01 99.54%)",
                  "--radius": "20px",
                  "--padding": "3px",
                  animation: "fadeSlideIn 0.4s ease-out",
                } as React.CSSProperties
              }
            >
              <div className="relative z-10 flex h-full flex-col gap-3.5 rounded-[20px] bg-[#FFFFFF1A] px-[30px] pb-3.5 pt-10 font-outfit text-[18px] font-normal text-white sm:px-6">
                {/* ── Reveal overlay ──────────────────────────────────── */}
                {phase === "REVEALING" && reveal && (
                  <div
                    className={cn(
                      "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-[20px] backdrop-blur-sm",
                      reveal.isCorrect ? "bg-green-500/20" : "bg-red-500/20",
                    )}
                    style={{
                      animation: revealExiting
                        ? "overlayExit 0.35s ease-out forwards"
                        : "none",
                    }}
                  >
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full text-4xl",
                        reveal.isCorrect ? "bg-green-500/30" : "bg-red-500/30",
                      )}
                    >
                      {reveal.isCorrect ? "✓" : "✗"}
                    </div>

                    <p
                      className={cn(
                        "font-inter text-2xl font-bold",
                        reveal.isCorrect ? "text-green-400" : "text-red-400",
                      )}
                    >
                      {reveal.source === "timeout" && !reveal.isCorrect
                        ? "Time's up!"
                        : reveal.isCorrect
                          ? "Correct!"
                          : "Wrong!"}
                    </p>

                    {reveal?.answerImage && (
                      <img
                        src={reveal.answerImage}
                        alt="answer"
                        className="max-h-[180px] w-[70%] rounded-xl object-contain"
                      />
                    )}

                    <p className="font-outfit text-lg text-white">
                      Correct answer:{" "}
                      <span className="font-semibold text-green-400">
                        {reveal.correctAnswer}
                      </span>
                    </p>

                    {reveal.isCorrect && reveal.pointsAwarded > 0 && (
                      <p className="font-outfit text-base text-white/70">
                        +{reveal.pointsAwarded} pts
                      </p>
                    )}

                    {/* Progress bar */}
                    <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full w-full rounded-full bg-white"
                        style={{ animation: "shrink 2.5s linear forwards" }}
                        onAnimationEnd={() => {
                          console.log(
                            `[UI] shrink bar onAnimationEnd fired — calling triggerRevealExit`,
                          );
                          triggerRevealExit();
                        }}
                      />
                    </div>

                    {showSkip && (
                      <button
                        onClick={() => {
                          console.log(`[UI] skip button clicked`);
                          triggerRevealExit();
                        }}
                        className="mt-1 font-outfit text-sm text-white/50 underline transition-opacity hover:text-white/80"
                      >
                        Next →
                      </button>
                    )}
                  </div>
                )}

                {/* ── Question image ──────────────────────────────────── */}
                {displayQuestion?.questionImage ? (
                  <img
                    src={displayQuestion.questionImage}
                    alt="question"
                    className="mx-auto aspect-video w-full max-w-none object-contain sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
                  />
                ) : (
                  <div className="mx-auto aspect-video w-full max-w-none rounded-xl bg-white/5 sm:max-w-2xl" />
                )}

                <h3 className="text-center font-outfit text-sm font-medium leading-[150%] text-white sm:leading-[100%] lg:text-[32px]">
                  {displayQuestion?.questionText}
                </h3>
              </div>
            </div>

            {/* ── Options ───────────────────────────────────────────────── */}
            <div
              key={displayQuestion?.questionId}
              className={cn(
                "grid grid-cols-1 gap-[18px] sm:grid-cols-2",
                optionsLocked && "pointer-events-none",
              )}
              style={{ animation: "fadeSlideIn 0.45s ease-out" }}
            >
              {displayQuestion?.options.map((option, index) => {
                const isSelected = selectedIndex === index;
                const isCorrectAnswer =
                  phase === "REVEALING" && option === reveal?.correctAnswer;
                const isWrongSelected =
                  phase === "REVEALING" &&
                  isSelected &&
                  option !== reveal?.correctAnswer;

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
                      if (optionsLocked) return;
                      console.log(
                        `[UI] option selected  index=${index}  value="${option}"  questionId=${displayQuestion?.questionId}`,
                      );
                      setSelectedIndex(index);
                    }}
                    className={cn(
                      "relative flex h-[58px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[10px] p-5 font-outfit text-[18px] text-white transition-all duration-200 ease-out hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]",
                      isCorrectAnswer && "ring-2 ring-green-400 brightness-110",
                      isWrongSelected && "ring-2 ring-red-400 brightness-75",
                      optionsLocked &&
                        "cursor-default hover:scale-100 hover:brightness-100",
                    )}
                    style={{
                      background: isCorrectAnswer
                        ? "rgba(34,197,94,0.25)"
                        : isWrongSelected
                          ? "rgba(239,68,68,0.25)"
                          : baseGradient,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{ backgroundImage: "url('/Noise.png')" }}
                    />
                    <span className="relative z-10 font-medium">{option}</span>
                  </div>
                );

                return isSelected && !isCorrectAnswer && !isWrongSelected ? (
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

            {/* ── Status + Submit ───────────────────────────────────────── */}
            <div className="flex flex-row items-center justify-center gap-3.5 py-2">
              <p className="font-outfit text-sm text-white/50">
                {statusText[phase]}
              </p>
              <GradientButton
                onClick={handleSubmit}
                icon={false}
                disabled={selectedIndex === null || optionsLocked}
                className={cn(
                  "transition-opacity",
                  (selectedIndex === null || optionsLocked) &&
                    "cursor-not-allowed opacity-50",
                )}
              >
                {phase === "SUBMITTING" ? "Submitting…" : "Submit"}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Background SVG ──────────────────────────────────────────────── */}
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
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
}
