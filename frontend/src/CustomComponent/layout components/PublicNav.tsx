import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AccountPopover from "../AccountPopover";
import {  MenuIcon } from "lucide-react";

export function NavHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <header className="sticky top-0 z-52 w-full">
      <div className="bg-[#EFEFEF] py-2.5 sm:py-4 relative">
        <div className="px-4 sm:px-5 2xl:px-10">
          <div className="flex justify-between items-center w-full gap-1 sm:gap-2 md:gap-3.5 lg:gap-3 md:text-lg xl:text-xl 2xl:text-2xl">
            {/* Left Section */}
            <div className="flex items-center gap-3.5 md:gap-7">
              {user ? <AccountPopover /> : <></>}
              <AccountPopover />
              <a className="whitespace-nowrap" href="/login">
                {user?.firstname
                  ? `${user.firstname} ${user.lastname}`
                  : "Login"}
              </a>

              {/* <Button className="bg-[#F0522B] text-white text-xs lg:text-base 2xl:text-lg font-Cairo px-2.5 hover:bg-[#F0522B] cursor-pointer sm:px-4 py-1.5 sm:py-2.5 rounded-full">
                Total Games Remaining <span>: 0</span>
              </Button> */}
            </div>

            {/* Right Section */}
            <div className="grid gap-1.5 sm:gap-3 md:gap-4 2xl:gap-20 grid-flow-col items-center">
              {/* Navigation */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="font-bold gap-2 lg:gap-4 xl:gap-5">
                  <NavigationMenuItem>
                    {/* <a
                      href="/contactus"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] ${
                        pathname === "/contactus"
                          ? "bg-[#a90000] text-white"
                          : ""
                      }`}
                    >
                      contact
                    </a> */}
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <a
                      href="/"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] ${
                        pathname === "/" ? "bg-[#a90000] text-white" : ""
                      }`}
                    >
                      story
                    </a>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <a
                      href="/play"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] ${
                        pathname === "/play" ? "bg-[#a90000] text-white" : ""
                      }`}
                    >
                      play
                    </a>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger className="md:hidden block">
                  <Button variant="ghost" size="icon">
                    <MenuIcon color="#a90000"/>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="top"
                  className="p-4 !top-[72px] animate-slide-down border-t border-border  [&>button]:hidden "
                >
                  <nav className="grid gap-4 font-bold">
                    {/* <a
                      href="/contactus"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] inline-block w-fit ${
                        pathname === "/contactus"
                          ? "bg-[#a90000] text-white"
                          : ""
                      }`}
                    >
                      contact
                    </a> */}
                    <a
                      href="/"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] inline-block w-fit ${
                        pathname === "/" ? "bg-[#a90000] text-white" : ""
                      }`}
                    >
                      story
                    </a>
                    <a
                      href="/play"
                      className={`px-3 lg:px-5 py-2 rounded-[999px] inline-block w-fit ${
                        pathname === "/play" ? "bg-[#a90000] text-white" : ""
                      }`}
                    >
                      play
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
              {/* Logo */}
              <a className="w-10 sm:w-14 2xl:w-24 h-14 2xl:h-24 grid place-content-center">
                <img src="/Trivial logo.png" alt="Logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
