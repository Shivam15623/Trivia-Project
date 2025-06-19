import MobileMenu from "@/components/MobileMenu"; // ✅ make sure path is correct
import { Link } from "react-router-dom";

export function PublicHeader() {
  const mobileUrls = [
    { name: "Home", path: "/" },
    { name: "How to Play", path: "#how-to-play" },
    { name: "Categories", path: "#categories" },
    { name: "Log In", path: "/login" },
  ];

  return (
    <header className="bg-[#efefef] sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 orange-gradient rounded-full flex items-center justify-center shadow-md">
              <img src="/Trivial logo.png" alt="Logo" />
            </div>
            <span className="text-2xl font-bold gradient-text tracking-tight">
              Trivia
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <a
              href="/"
              className=" font-medium px-3 lg:px-4 py-2 rounded-full  hover:text-[#a90000] transition-colors"
            >
              Home
            </a>
            <a
              href="#how-to-play"
              className="font-medium px-3 lg:px-4 py-2 rounded-full  hover:text-[#a90000] transition-colors"
            >
              How to Play
            </a>
            <a
              href="#categories"
              className="font-medium px-3 lg:px-4 py-2 rounded-full  hover:text-[#a90000] transition-colors"
            >
              Categories
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/login"
              className="hidden sm:inline-block font-medium text-gray-700 px-2 hover:text-[#a90000] transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="hidden sm:inline-flex items-center bg-[#a90000] text-white px-4 py-2 rounded-full font-medium hover:bg-red-800 transition-colors shadow-md"
            >
              Sign Up
            </Link>

            {/* Mobile Menu */}
            <MobileMenu urls={mobileUrls} isPublic />
          </div>
        </div>
      </div>
    </header>
  );
}
