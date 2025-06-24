const StartSoloGameLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-orange-50 to-orange-100 ">
      <div className="w-full max-w-7xl game-container border-2 border-orange-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden bg-[#ffffffe6]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-300 rounded-full opacity-20"></div>
        <div id="start-loader" className="start-loader relative z-10 hidden">
          <div className="flex items-center justify-center mb-2">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h1 className="game-title text-4xl md:text-5xl font-extrabold">
              QuizMaster
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg mb-10">
            Get ready to test your knowledge!
          </p>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="icon w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Starting Game
            </h2>
            <p className="text-gray-600 mb-8">Prepare for the challenge!</p>

            <div className="w-full max-w-md mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="progress-bar bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-medium text-sm">
                Loading Questions
              </div>
              <div className="px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-medium text-sm">
                Setting Timer
              </div>
              <div className="px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-medium text-sm">
                Preparing UI
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm animate-pulse">
              Your game will start in a few seconds...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartSoloGameLoader;
