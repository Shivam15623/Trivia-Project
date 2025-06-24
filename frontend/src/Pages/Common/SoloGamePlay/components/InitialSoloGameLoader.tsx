const InitialSoloGameLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-orange-50 to-orange-100 ">
      <div className="w-full max-w-7xl game-container border-2 border-orange-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden bg-[#ffffffe6]">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-300 rounded-full opacity-20"></div>
        <div
          id="initial-loader"
          className="initial-loader relative z-10 flex flex-col items-center justify-center py-16 "
        >
          <div className="flex items-center justify-center mb-8">
            <div className="circle w-5 h-5 mx-1 rounded-full bg-orange-600"></div>
            <div className="circle w-5 h-5 mx-1 rounded-full bg-orange-600"></div>
            <div className="circle w-5 h-5 mx-1 rounded-full bg-orange-600"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Quiz Game
            </h2>
            <p className="text-gray-600">
              Preparing your knowledge challenge...
            </p>
          </div>
          <div className="mt-12 w-full max-w-md">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600 mr-2"
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
              <span className="text-sm font-medium text-gray-700">
                Loading categories
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-orange-600 h-2.5 rounded-full w-3/4"></div>
            </div>

            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Loading questions
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div className="bg-orange-600 h-2.5 rounded-full w-1/2"></div>
            </div>

            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                ></path>
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Preparing game assets
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-orange-600 h-2.5 rounded-full w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSoloGameLoader;
