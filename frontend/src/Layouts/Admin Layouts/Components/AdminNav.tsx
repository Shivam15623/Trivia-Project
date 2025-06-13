import { useLocation } from "react-router-dom";
import AccountPopover from "../../../components/AccountPopover";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MobileMenu from "@/components/MobileMenu";

const AdminNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const userdata = useSelector((state: RootState) => state.auth.user);
  const navlinks = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "My Games",
      path: "/admin/mygames",
    },
    {
      name: "Category",
      path: "/admin/categories",
    },
    {
      name: "Play",
      path: "/admin/CreateGame",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="bg-[#EFEFEF] py-2.5 sm:py-4 relative shadow-sm">
          <div className="container mx-auto px-4 sm:px-5 2xl:px-10">
            <div className="flex justify-between items-center w-full gap-1 sm:gap-2 md:gap-3.5 lg:gap-3 md:text-lg xl:text-xl 2xl:text-2xl">
              <div className="flex items-center gap-3.5 md:gap-7">
                <div className="relative">
                  <AccountPopover />
                </div>
                <a
                  href={`/${userdata?.role}`}
                  className="whitespace-nowrap font-medium"
                >
                  {userdata?.firstname
                    ? `${userdata?.firstname} ${userdata?.lastname}`
                    : "entrance"}
                </a>
              </div>

              <div className="grid gap-1.5 sm:gap-3 md:gap-4 2xl:gap-20 grid-flow-col items-center">
                <div className="hidden md:flex">
                  <nav className="font-bold flex gap-2 lg:gap-4 xl:gap-5">
                    {navlinks.map((url) => (
                      <a
                        href={url.path}
                        className={`px-3 lg:px-5 py-2 rounded-[999px] ${
                          pathname === url.path ? "bg-[#a90000] text-white" : ""
                        }`}
                      >
                        {url.name}
                      </a>
                    ))}
                  </nav>
                </div>

                <MobileMenu urls={navlinks} isPublic={false} />
                <a
                  className="w-10 sm:w-11 2xl:w-18 h-11 2xl:h-18 grid border-2 p-1 orange-gradient  border-[#a90000] rounded-full place-content-center"
                  href="/customer"
                >
                  <img src="/Trivial logo.png" alt="Logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default AdminNav;
