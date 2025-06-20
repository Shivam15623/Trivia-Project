import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
type MobileMenuProps = {
  urls: {
    name: string;
    path: string;
  }[];
  isPublic: boolean;
};
const MobileMenu = ({ urls, isPublic = false }: MobileMenuProps) => {
  const pathname = location.pathname;

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 rounded-xl text-[#a90000] hover:bg-[#fef1f0] focus-visible:ring-2 focus-visible:ring-[#a90000]/40 transition-all"
            size="icon"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" strokeWidth={2} />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-72 sm:w-80 px-4 p-0 gap-0"
          hideCloseButton
        >
          <div className="flex items-center justify-between  p-2.5 border-b-1 border-[#f3f4f6] ">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 orange-gradient p-1 rounded-full border-2 border-[#a90000] flex items-center justify-center">
                <img
                  src="/Trivial logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold gradient-text">Trivia</span>
            </div>
            <SheetClose asChild>
              <X />
            </SheetClose>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-2 space-y-4 flex flex-col">
            {urls.map((url) => (
              <Link
                to={url.path}
                className={`block  px-5 py-2 rounded-full font-semibold transition-colors ${
                  pathname === url.path
                    ? "bg-[#a90000] text-white"
                    : "text-gray-800 hover:text-[#a90000] transition-colors"
                }`}
              >
                {url.name}
              </Link>
            ))}
          </nav>
          {isPublic && (
            <div className="mt-6">
              <Link
                to="/signup"
                className="block w-full bg-[#a90000] hover:bg-red-800 text-white text-center px-5 py-2 rounded-full font-medium transition-colors shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
