import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const WelcomeSection = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userRole = user?.role;
  const userName = user?.firstname || "there";

  // Dynamic content based on role
  const isAdmin = userRole === "admin";
  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {isAdmin ? `Welcome back, Admin!` : `Welcome back, ${userName}!`}
            </h1>
            <p className="text-gray-600">
              {isAdmin
                ? "Manage and monitor all trivia games from here."
                : "Ready for your next trivia challenge?"}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to={`${userRole}/CreateGame`}
              className="cta-button bg-[#a90000] hover:bg-red-800 text-white font-bold px-6 py-3 rounded-full shadow-lg"
            >
              Create New Game
            </Link>
            <Link
              to={`${userRole}/mygames`}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-full shadow-lg transition-colors"
            >
              Join Game
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
