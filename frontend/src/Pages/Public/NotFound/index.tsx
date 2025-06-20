import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <body className="bg-[#f8f9fa]">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="relative mb-8 hlogo-animation">
            <div className="w-40 h-40 mx-auto orange-gradient rounded-full flex items-center justify-center shadow-lg">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <span className="text-7xl font-bold gradient-text title-font">
                  404
                </span>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black opacity-10 rounded-full blur-md"></div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 title-font">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          {/* <div className="flex justify-center gap-8 mb-10">
        <div className="w-12 h-12 red-gradient rounded-full flex items-center justify-center shadow-md pulse-animation">
          <span className="text-2xl font-bold text-white">?</span>
        </div>
        <div className="w-12 h-12 orange-gradient rounded-full flex items-center justify-center shadow-md pulse-animation" style="animation-delay: 0.5s">
          <span className="text-2xl font-bold text-white">?</span>
        </div>
        <div className="w-12 h-12 red-gradient rounded-full flex items-center justify-center shadow-md pulse-animation" style="animation-delay: 1s">
          <span className="text-2xl font-bold text-white">?</span>
        </div>
      </div>
       */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-8 py-3 bg-[#ff7546] text-white font-semibold rounded-full shadow-md hover:bg-orange-500 transition-colors"
            >
              Go to Home
            </Link>
            <Button
              onClick={() => navigate(-1)}
              className="px-8 py-3 border-2 h-auto border-[#a90000] text-[#a90000] bg-transparent font-semibold rounded-full hover:bg-red-50 transition-colors"
            >
              Go Back
            </Button>
          </div>

          <div className="mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Did You Know?
            </h3>
            <p className="text-gray-600 mb-4">
              The 404 error code originated when a page couldn't be found on the
              server.
            </p>
            <div className="flex justify-center">
              <Link
                to="/CreateGame"
                className="text-[#a90000] font-medium hover:underline flex items-center"
              >
                Try a trivia game instead
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2023 Trivia Game. All rights reserved.</p>
        </div>
      </div>
    </body>
  );
};

export default NotFound;
