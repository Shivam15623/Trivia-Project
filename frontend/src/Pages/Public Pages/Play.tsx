const Story = () => {
  return (
    <>
      <section>
        <div className="hero-section w-full text-white orange-gradient  relative moon-banner z-0">
          <div className="sm:hero-section text-white bg-no-repeat bg-cover bg-bottom sm:bg-bottom md:bg-top sm:student-home-banner bg-simjim-banner relative z-[1]">
            <div className="container  px-4 mx-auto">
              <div className="text-center mx-auto max-w-2xl 2xl:max-w-6xl text-balance py-10 sm:py-20 2xl:pt-20 2xl:pb-3 pb-3 sm:pb-16">
                <h1 className="text-[1.875rem] leading-[2.25rem] sm:text-[2.25rem] sm:leading-[2.5rem] 2xl:text-[3rem] 2xl:leading-[1]">
                  Create A Game
                </h1>
                <div className="text-lg md:text-xl xl:text-2xl 2xl:text-4xl font-cairo mt-6 2xl:mt-12 leading-relaxed">
                  <p>
                    An interactive team game in which we test your knowledge and
                    culture
                  </p>
                  <p className="mt-5 sm:mt-10 2xl:mt-10">
                    To create a new game, click on{" "}
                    <span className="font-bold font-cairo inline-block">
                      (New Game)
                    </span>
                  </p>
                  <p>
                    To retrieve previous games, tap
                    <span className="font-bold font-cairo inline-block">
                      ( My Games )
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap justify-center mt-20 md:mt-10 2xl:mt-16 text-sm sm:text-base md:text-lg 2xl:text-2xl gap-1 lg:gap-2 xl:gap-3 2xl:gap-4 sm:items-end items-stretch">
                  <button className="text-white w-[22%] sm:w-24 md:w-28 lg:w-36 xl:w-40 2xl:w-72 h-16 sm:h-16 xl:h-[80px] 2xl:h-[120px]  p-2 rounded-t-xl 2xl:rounded-t-2xl font-bold bg-yellow-950 relative flex justify-center items-center">
                    <div>Create a game</div>
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-md:scroll-m-24 scroll-m-5">
        <div className="mt-10 md:mt-20">
          <h2 className=" text-4xl 2xl:text-8xl mb-2 font-bold font-cairo text-center">
            Select Categories
          </h2>
          <p className="font-cairo text-center mx-auto mt-8 text-[1.125rem] leading-[1.75rem] max-w-[min(768px,100%)] xl:text-[1.25rem] xl:leading-[1.75rem] 2xl:text-[1.5rem] 2xl:leading-[2rem] 2xl:max-w-6xl max-xl:text-balance">
            3 categories for your team, 3 categories for the opposing team, with
            a total of 6 categories with 36 different questions, choose the
            categories carefully to ensure the greatest chance of winning
          </p>
        </div>
      </section>
    </>
  );
};

export default Story;
