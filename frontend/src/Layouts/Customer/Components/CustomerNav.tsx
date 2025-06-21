import { Link, useLocation } from "react-router-dom";
import AccountPopover from "../../../components/AccountPopover";
import { useSelector } from "react-redux";

import MobileMenu from "@/components/MobileMenu";
import { selectAuth } from "@/redux/AuthSlice/authSlice";
import Loader from "@/components/Loader";

export function CustomerNavHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const {user} = useSelector(selectAuth);
  const navlinks = [
    {
      name: "My Games",
      path: "/customer/mygames",
    },
    {
      name: "Home",
      path: "/customer",
    },
    {
      name: "Play",
      path: "/customer/CreateGame",
    },
  ];
  
    if (!user) {
      return <Loader />;
    }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-[#EFEFEF] py-2.5 sm:py-4 relative shadow-sm">
          <div className="container mx-auto px-4 sm:px-5 2xl:px-10">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3.5 md:gap-7">
                <div className="relative">
                  <AccountPopover />
                </div>
                <Link
                  to={`/${user?.role}`}
                  className="whitespace-nowrap font-medium text-gray-800 hover:text-[#a90000] transition-colors"
                >
                  {user?.firstname
                    ? `${user?.firstname} ${user?.lastname}`
                    : "entrance"}
                </Link>
              </div>

              <div className="grid gap-1.5 sm:gap-3 md:gap-4 2xl:gap-20 grid-flow-col items-center">
                <div className="hidden md:flex">
                  <nav className="font-bold flex gap-2 lg:gap-4 xl:gap-5">
                    {navlinks.map((url) => (
                      <Link
                        to={url.path}
                        className={`px-3 lg:px-5 py-2 rounded-full  ${
                          pathname === url.path
                            ? "bg-[#a90000] text-white"
                            : "text-gray-800 hover:text-[#a90000] transition-colors"
                        }`}
                      >
                        {url.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <MobileMenu urls={navlinks} isPublic={false} />
                <Link
                  className="w-10 sm:w-11 sm:h-11 2xl:w-18 h-10 2xl:h-18 grid border-2 p-1 orange-gradient border-[#a90000] rounded-full place-content-center"
                  to="/customer"
                >
                  <img src="/Trivial logo.png" alt="Logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
