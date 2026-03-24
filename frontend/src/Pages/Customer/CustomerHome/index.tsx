import FAQAccordion from "./components/FAQAccordian";

import { useFetchCategoryPublicQuery } from "@/services";
import TestimonialSlider from "./components/TestimonialSlider";
import { GradientButton, GradientLink } from "@/components/GradientButton";

import PlayCardHome from "./components/PlayCardHome";
import { useState } from "react";
import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/AuthSlice/authSlice";

const Home = () => {
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoryPublicQuery();
  const INITIAL_VISIBLE = 10; // matches your 5-col grid — 2 full rows
  const { user } = useSelector(selectAuth);
  const [showAll, setShowAll] = useState(false);
  const getProtectedRoute = (target: string) => {
    return user ? target : "/login";
  };
  // then inside your .map(), slice the categories:
  const visibleCategories = showAll
    ? categories?.data
    : categories?.data?.slice(0, INITIAL_VISIBLE);
  return (
    <>
      <div className="min-h-screen overflow-hidden bg-black">
        {" "}
        <div className="relative mt-5 flex flex-col gap-20 bg-black sm:gap-[180px] md:mt-10">
          <div className="relative mb-[60px] flex flex-col items-center justify-between gap-[40px] px-[20px] pt-[54px] sm:mb-[80px] sm:px-[40px] md:gap-14 md:px-[60px] md:pt-0 lg:mb-[120px] lg:flex-row lg:px-[80px] xl:px-[120px]">
            <div className="relative z-10 flex flex-col items-center justify-center gap-[24px] lg:max-w-[49.6%] lg:items-start lg:justify-start">
              <div className="flex flex-col items-center justify-center gap-[14px] lg:items-start lg:justify-normal">
                <img
                  src="/heroTrivvy.png"
                  className="hidden h-auto w-full max-w-[280px] lg:block lg:max-w-[43.3%]"
                />
                <h1 className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[48px] sm:leading-[70px] md:text-[52px] lg:text-start lg:text-[48px] xl:text-[64px]">
                  Think smarter. Play faster.
                </h1>
                <h3 className="w-full text-center font-outfit text-[16px] leading-[100%] text-white sm:text-lg md:w-[80%] md:text-xl lg:w-[430px] lg:text-start xl:w-[614px] xl:text-[24px]">
                  A smart, competitive trivia game with daily challenges, live
                  duels, and real rankings.
                </h3>
              </div>
              <GradientLink to={getProtectedRoute(`CreateGame`)}>
                Play Now
              </GradientLink>
            </div>

            <img
              src="/mascot.svg"
              className="relative z-20 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[32%]"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-[80px] px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
            <div className="flex flex-col items-center justify-center gap-[8px]">
              <h1 className="font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[64px] sm:leading-[70px]">
                What is{" "}
                <span className="/* 👈 THIS IS THE FIX */ relative bg-a-blue bg-clip-text text-transparent after:absolute after:-right-[40px] after:-top-[20px] after:block after:h-[50px] after:w-[50px] after:bg-[url('/smiley.png')] after:bg-contain after:bg-no-repeat after:content-[''] sm:after:-right-[112px] sm:after:-top-[2px] sm:after:h-[100px] sm:after:w-[100px]">
                  Trivvy
                </span>
              </h1>

              <h4 className="text-center font-outfit text-[16px] font-normal text-white sm:text-[24px]">
                A multiplayer trivia game built for thinkers and competitors.
              </h4>
            </div>
            <div className="relative mx-auto flex h-fit max-w-[1280px] flex-col items-center gap-[14px] overflow-hidden rounded-[20px] lg:h-[532px] lg:flex-row">
              <div className="relative z-10 flex flex-col gap-[18px] pl-0 sm:gap-6 sm:pl-[20px] md:pl-[35px] lg:w-[53%] lg:pl-[50px]">
                <h3
                  className="font-inter text-[34px] font-semibold leading-[100%] text-white sm:text-[38px] md:text-[42px] xl:text-[48px]"
                  style={{ letterSpacing: "-1%", textTransform: "capitalize" }}
                >
                  Test your knowledge across hundreds of categories
                </h3>
                <h5 className="font-outfit text-sm font-normal leading-[100%] text-white sm:text-lg">
                  Trivvy combines speed, strategy, and intelligence. Play solo,
                  challenge friends, or compete globally with real rankings that
                  matter.
                </h5>
                <GradientLink to={getProtectedRoute(`CreateGame`)}>
                  Play Now
                </GradientLink>
              </div>

              <img
                src="/home/allCategories.svg"
                className="relative z-10 w-full object-contain lg:absolute lg:bottom-0 lg:right-0 lg:h-auto lg:w-[45%]"
              />
              <img
                src="/home/trivvyBg.svg"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="relative z-10 mb-10 flex flex-col items-center justify-center gap-[80px] px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
            <div className="flex flex-col gap-4">
              {" "}
              <h1
                className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[64px]"
                style={{ letterSpacing: "-1%", textTransform: "capitalize" }}
              >
                <span className="relative bg-a-sun bg-clip-text text-transparent before:absolute before:-left-[28px] before:-top-[20px] before:h-[50px] before:w-[50px] before:bg-[url('/sparkle.png')] before:bg-contain before:bg-no-repeat before:content-[''] sm:before:-left-[64px] sm:before:-top-[47px] sm:before:h-[100px] sm:before:w-[100px]">
                  Ready
                </span>{" "}
                for <br className="inline-block sm:hidden" />
                Exciting game?
              </h1>
              <h5 className="text-center font-outfit text-[18px] font-normal text-white">
                Select a mode that fits your mood.
              </h5>
            </div>

            <div className="flex min-h-[424px] w-full max-w-[1280px] flex-col items-center justify-center gap-3 sm:gap-5 md:flex-row md:gap-0">
              {/* Team Card */}
              <div className="flex-2 h-[242.4px] w-full max-w-[85.42%] transition-all duration-300 ease-out hover:[transform:scale(1.03)] md:h-[380px] md:w-[45.77%] md:max-w-none md:[transform:translateX(2.1%)_rotate(2.3deg)] md:hover:z-10 md:hover:[transform:translateX(2.1%)_rotate(0deg)_translateY(-12px)_scale(1.03)] xl:h-[424px]">
                <PlayCardHome
                  color="#FED846"
                  playLink={getProtectedRoute("CreateGame?mode=team")}
                  image="/team.png"
                  title="Team"
                  subTitle="Team up with your Friends! Combine scores and conquer together."
                />
              </div>

              {/* Solo Card */}
              <div className="h-[348px] w-full max-w-[79.3%] transition-all duration-300 ease-out [transform:rotate(-3.86deg)] hover:z-10 hover:[transform:rotate(0deg)_translateY(-12px)_scale(1.03)] md:h-[380px] md:w-[29.69%] md:max-w-none xl:h-[424px]">
                <PlayCardHome
                  color="#FE9B24"
                  playLink={getProtectedRoute("CreateGame?mode=solo")}
                  image="/solo-2.png"
                  title="Solo"
                  subTitle="Just you against the questions. Perfect for a quick brain workout."
                />
              </div>

              {/* Timed Card */}
              <div className="h-[362px] w-full max-w-[79.3%] transition-all duration-300 ease-out hover:[transform:scale(1.03)] md:h-[380px] md:w-[29.69%] md:max-w-none md:[transform:translateX(-1.48%)_rotate(1.67deg)] md:hover:z-10 md:hover:[transform:translateX(-1.48%)_rotate(0deg)_translateY(-12px)_scale(1.03)] xl:h-[424px]">
                <PlayCardHome
                  color="#3BCCF6"
                  playLink={getProtectedRoute("CreateGame?mode=timed")}
                  image="/alarm-2.png"
                  title="Timed"
                  subTitle="Tick-tock! Beat the clock on each question. Maximum pressure, maximum fun!"
                />
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center gap-[40px] px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
            <div className="flex flex-col gap-4">
              {" "}
              <h1
                className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[64px] sm:leading-[70px]"
                style={{ letterSpacing: "-1%", textTransform: "capitalize" }}
              >
                Pick your categories and
                <br />
                <span className="relative bg-h-blue bg-clip-text text-transparent before:absolute before:bottom-[8px] before:left-[97%] before:h-[50px] before:w-[50px] before:bg-[url('/2spark.png')] before:bg-contain before:bg-no-repeat before:content-[''] sm:before:-bottom-[28px] sm:before:left-[98%] sm:before:h-[100px] sm:before:w-[100px]">
                  start playing
                </span>
              </h1>
              <h5 className="text-center font-outfit text-[18px] font-normal text-white">
                Let the game surprise you.
              </h5>
            </div>
            <div className="flex flex-col items-center justify-center gap-[64px] sm:gap-[64px]">
              <div className="grid max-w-[1280px] grid-cols-2 gap-[21px] md:grid-cols-3 md:gap-16 lg:grid-cols-4 xl:grid-cols-5">
                {categoriesLoading
                  ? // ── Skeleton state ──────────────────────────
                    Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
                      <CategoryCardSkeleton key={i} />
                    ))
                  : // ── Loaded state ─────────────────────────────
                    visibleCategories?.map((cat) => (
                      <div
                        key={cat._id}
                        className="gradient-border w-full p-[2.62px]"
                        style={
                          {
                            "--border-gradient":
                              "linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)",
                            "--radius": `${8.72}px`,
                            "--padding": `${2.62}px`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="relative z-10 flex h-full flex-col overflow-hidden p-[3px]">
                          <div className="relative flex h-full w-full flex-col items-center justify-between gap-[4.36px] rounded-[8.72px] bg-gradient-to-b from-[#0B0B0B] to-[#000000] px-3 pb-4 pt-[1px] text-white sm:px-[18.67px] sm:pb-[30px]">
                            {/* image container */}
                            <div className="aspect-square w-full max-w-[188px]">
                              <img
                                src={cat.thumbnail}
                                alt="Category"
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <p className="text-center font-michroma text-[12px] tracking-wide opacity-90 sm:text-[13px]">
                              {cat.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              {!categoriesLoading &&
                !showAll &&
                (categories?.data?.length ?? 0) > INITIAL_VISIBLE && (
                  <GradientButton
                    type="button"
                    className="w-full max-w-[150px]"
                    onClick={() => setShowAll(true)}
                  >
                    View All
                  </GradientButton>
                )}
            </div>
          </div>
          <div className="relative z-10 flex w-full items-center justify-center px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
            <TestimonialSlider />
            {/* Background blur shapes */}

            <img
              src="/home/homeGrb.svg"
              className="pointer-events-none absolute -top-[145%] max-h-[1497px] w-full min-w-[1920px] max-w-none rotate-[5deg] object-cover sm:-top-[215%] sm:max-h-[1497px] sm:rotate-0"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
            <div className="relative z-10 mb-10 flex w-full max-w-[1280px] flex-col gap-[40px]">
              <div className="flex flex-col items-start justify-start gap-6 sm:gap-4">
                {" "}
                <h1
                  className="font-inter text-[44px] font-semibold leading-[120%] text-white sm:text-[64px]"
                  style={{ letterSpacing: "-1%", textTransform: "capitalize" }}
                >
                  <span className="relative bg-a-sun bg-clip-text text-transparent">
                    FAQs
                  </span>{" "}
                </h1>
                <h5 className="text-center font-outfit text-[14px] font-normal leading-[150%] text-white sm:text-[18px]">
                  Quick answers to get you playing faster
                </h5>
              </div>
              <div>
                <FAQAccordion />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden">
        <div className="absolute left-[-28.96px] top-[140px] h-[250px] w-[385px] rotate-[17.68deg] rounded-[40px] bg-orange-sun opacity-80 blur-[54px] sm:left-[-100px] sm:top-[152px] sm:h-[604.663px] sm:max-h-[604.663px] sm:w-[929.051px] sm:max-w-[929.051px] sm:blur-[126.6px]" />

        <div className="absolute right-[-70px] top-[320px] h-[356px] w-[437px] rotate-[150.39deg] rounded-[132px] bg-aqua-abyss opacity-80 blur-[54px] sm:right-[-230px] sm:h-[696.774px] sm:w-[783.48px] sm:max-w-[783.48px] sm:blur-[126.6px] lg:top-[65px] lg:max-h-[696.774px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-x-hidden">
        <img
          src="/home/skyShot1.svg"
          className="absolute right-[10%] top-[4.5%] w-[35.37%] opacity-80 lg:left-[35%] lg:right-auto lg:top-[1.5%] lg:w-[22%]"
        />
        <img
          src="/home/skyShot2.svg"
          className="z-2 absolute left-[9%] top-[5.7%] w-[45.57%] opacity-80 lg:left-[53%] lg:right-auto lg:top-[4.5%] lg:w-[22%]"
        />
      </div>
    </>
  );
};

export default Home;
