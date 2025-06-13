import MobileMenu from "@/components/MobileMenu"; // ✅ make sure path is correct

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
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 orange-gradient p-1 rounded-full border-2 border-[#a90000] flex items-center justify-center">
              <img src="/Trivial logo.png" alt="Logo" />
            </div>
            <span className="text-2xl font-bold gradient-text">Trivia</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="font-medium text-gray-800 hover:text-[#a90000] transition-colors"
            >
              Home
            </a>
            <a
              href="#how-to-play"
              className="font-medium text-gray-800 hover:text-[#a90000] transition-colors"
            >
              How to Play
            </a>
            <a
              href="#categories"
              className="font-medium text-gray-800 hover:text-[#a90000] transition-colors"
            >
              Categories
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <a
              href="/login"
              className="hidden sm:inline-block font-medium text-gray-800 hover:text-[#a90000] transition-colors"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="bg-[#a90000] hidden sm:inline-block text-white px-5 py-2 rounded-full font-medium hover:bg-red-800 transition-colors shadow-md"
            >
              Sign Up
            </a>

            {/* Mobile Menu */}
            <MobileMenu urls={mobileUrls} isPublic />
          </div>
        </div>
      </div>
    </header>
  );
}
