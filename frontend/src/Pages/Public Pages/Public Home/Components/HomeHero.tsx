const HomeHero = () => {
  return (
    <>
      {" "}
      <section className="relative orange-gradient text-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight text-shadow">
                The Ultimate <br />
                Trivia Challenge
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-lg">
                Test your knowledge with friends or go solo in the most exciting
                trivia game experience. Choose from 6 categories and compete for
                glory!
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <a
                  href="#"
                  className="cta-button bg-[#a90000] hover:bg-red-800 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg text-center"
                >
                  Play Now
                </a>
                <a
                  href="#how-to-play"
                  className="bg-white text-[#a90000] text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors text-center"
                >
                  How to Play
                </a>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-70 animate-pulse-slow"></div>
                <div className="absolute top-1/4 -right-8 w-16 h-16 bg-red-500 rounded-full opacity-60 animate-float"></div>

                <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 z-10 relative">
                  <div className="bg-gray-100 rounded-xl p-4 mb-4">
                    <h3 className="text-gray-800 font-bold text-xl mb-3">
                      Pop Culture
                    </h3>
                    <p className="text-gray-700 font-medium">
                      Which actor played Iron Man in the Marvel Cinematic
                      Universe?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#a90000] text-white p-3 rounded-lg text-center font-medium">
                      Robert Downey Jr.
                    </div>
                    <div className="bg-gray-200 text-gray-700 p-3 rounded-lg text-center font-medium">
                      Chris Evans
                    </div>
                    <div className="bg-gray-200 text-gray-700 p-3 rounded-lg text-center font-medium">
                      Chris Hemsworth
                    </div>
                    <div className="bg-gray-200 text-gray-700 p-3 rounded-lg text-center font-medium">
                      Mark Ruffalo
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-[#a90000] font-bold">600 points</div>
                    <div className="bg-gray-200 rounded-full h-1.5 w-32">
                      <div className="bg-[#a90000] h-1.5 rounded-full w-1/4"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-10 -right-5 bg-white rounded-2xl shadow-xl p-4 transform -rotate-6 z-0 w-full">
                  <div className="h-40 bg-gray-100 rounded-lg"></div>
                </div>

                <div className="pulse-ring"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <svg
          width="100%"
          height="100%"
          id="svg"
          viewBox="0 0 1440 390"
          xmlns="http://www.w3.org/2000/svg"
          className="transition duration-300 ease-in-out delay-150"
        >
          <defs>
            <linearGradient id="gradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stop-color="#ff100f"></stop>
              <stop offset="100%" stop-color="#ffc070"></stop>
            </linearGradient>
          </defs>
          <path
            d="M 0,400 L 0,60 C 42.79018374645456,54.25670242939943 85.58036749290912,48.513404858798864 138,52 C 190.41963250709088,55.486595141201136 252.46871377481813,68.20308299420398 314,76 C 375.5312862251819,83.79691700579602 436.5447774078184,86.67426316438524 486,83 C 535.4552225921816,79.32573683561476 573.352176593908,69.09986434825501 625,64 C 676.647823406092,58.90013565174498 742.0465162165497,58.92627944259465 796,67 C 849.9534837834503,75.07372055740535 892.4617585398938,91.19501788136638 938,86 C 983.5382414601062,80.80498211863362 1032.1064496238748,54.293649031939815 1093,53 C 1153.8935503761252,51.706350968060185 1227.112442964607,75.63038599087433 1287,81 C 1346.887557035393,86.36961400912567 1393.4437785176965,73.18480700456283 1440,60 L 1440,400 L 0,400 Z"
            stroke="none"
            stroke-width="0"
            fill="url(#gradient)"
            fill-opacity="0.265"
            className="transition-all duration-300 ease-in-out delay-150 path-0"
            transform="rotate(-180 720 200)"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="5%" stop-color="#ff100f"></stop>
              <stop offset="95%" stop-color="#ffc070"></stop>
            </linearGradient>
          </defs>
          <path
            d="M 0,400 L 0,140 C 67.9218152669873,131.65672709335308 135.8436305339746,123.31345418670614 187,118 C 238.1563694660254,112.68654581329386 272.5472931310889,110.40291034652853 313,119 C 353.4527068689111,127.59708965347147 399.9671969416698,147.0749044271797 454,154 C 508.0328030583302,160.9250955728203 569.583919102232,155.29747194475271 634,144 C 698.416080897768,132.70252805524729 765.6971266494021,115.73520779380937 824,113 C 882.3028733505979,110.26479220619063 931.6275743001603,121.76169688000988 977,130 C 1022.3724256998397,138.23830311999012 1063.7925761499569,143.2180046861512 1113,150 C 1162.2074238500431,156.7819953138488 1219.2021211000122,165.36628437538536 1275,164 C 1330.7978788999878,162.63371562461464 1385.398939449994,151.31685781230732 1440,140 L 1440,400 L 0,400 Z"
            stroke="none"
            stroke-width="0"
            fill="url(#gradient)"
            fill-opacity="0.4"
            className="transition-all duration-300 ease-in-out delay-150 path-1"
            transform="rotate(-180 720 200)"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="5%" stop-color="#ff100f"></stop>
              <stop offset="95%" stop-color="#ffc070"></stop>
            </linearGradient>
          </defs>
          <path
            d="M 0,400 L 0,220 C 59.066272043408546,215.94011592058206 118.13254408681709,211.88023184116415 174,209 C 229.8674559131829,206.11976815883585 282.5360956961401,204.41918855592553 330,212 C 377.4639043038599,219.58081144407447 419.72307312862256,236.4430139351338 477,238 C 534.2769268713774,239.5569860648662 606.5716117893697,225.80875570353928 667,216 C 727.4283882106303,206.19124429646072 775.9904797138983,200.3219632507091 821,202 C 866.0095202861017,203.6780367492909 907.4664693550375,212.90339129362437 952,222 C 996.5335306449625,231.09660870637563 1044.1436428659515,240.06447157479346 1107,244 C 1169.8563571340485,247.93552842520654 1247.9589591811566,246.83872240720186 1306,242 C 1364.0410408188434,237.16127759279814 1402.0205204094218,228.58063879639906 1440,220 L 1440,400 L 0,400 Z"
            stroke="none"
            stroke-width="0"
            fill="url(#gradient)"
            fill-opacity="0.53"
            className="transition-all duration-300 ease-in-out delay-150 path-2"
            transform="rotate(-180 720 200)"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="5%" stop-color="#ff100f"></stop>
              <stop offset="95%" stop-color="#ffc070"></stop>
            </linearGradient>
          </defs>
          <path
            d="M 0,400 L 0,300 C 53.456209150326785,313.0649401899125 106.91241830065357,326.1298803798249 161,324 C 215.08758169934643,321.8701196201751 269.80653594771246,304.5454186706129 318,303 C 366.19346405228754,301.4545813293871 407.8614379084968,315.68844493772355 457,319 C 506.1385620915032,322.31155506227645 562.7477124183006,314.70080157849304 615,312 C 667.2522875816994,309.29919842150696 715.1477124183007,311.5083487483043 779,302 C 842.8522875816993,292.4916512516957 922.6614379084965,271.2658034282896 975,278 C 1027.3385620915035,284.7341965717104 1052.2065359477126,319.42843753853737 1096,319 C 1139.7934640522874,318.57156246146263 1202.5124183006535,283.0204464175608 1263,274 C 1323.4875816993465,264.9795535824392 1381.7437908496731,282.4897767912196 1440,300 L 1440,400 L 0,400 Z"
            stroke="none"
            stroke-width="0"
            fill="url(#gradient)"
            fill-opacity="1"
            className="transition-all duration-300 ease-in-out delay-150 path-3"
            transform="rotate(-180 720 200)"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default HomeHero;
