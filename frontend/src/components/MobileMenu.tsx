import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
type MobileMenuProps = {
  urls: {
    name: string;
    path: string;
  }[];
  isPublic: boolean;
};
const MobileMenu = ({ urls, isPublic=false }: MobileMenuProps) => {
  const pathname = location.pathname;

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="lg" aria-label="Open menu">
            <Menu color="#a90000" strokeWidth={2.5} />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-72 sm:w-80 px-4 p-0"
          hideCloseButton
        >
  
          <div className="flex items-center justify-between p-4 border-b-1 border-[#f3f4f6 ">
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
          <nav className="px-4 py-6 space-y-4 flex flex-col">
            {urls.map((url) => (
              <a
                href={url.path}
                className={`block  px-5 py-2 rounded-full font-semibold transition-colors ${
                  pathname === url.path
                    ? "bg-[#a90000] text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {url.name}
              </a>
            ))}
          </nav>
          {isPublic && (
            <div className="mt-6">
              <a
                href="/signup"
                className="block w-full bg-[#a90000] hover:bg-red-800 text-white text-center px-5 py-2 rounded-full font-medium transition-colors shadow-md"
              >
                Sign Up
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
