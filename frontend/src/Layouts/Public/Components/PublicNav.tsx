import AccountPopover from "@/components/AccountPopover";

import { Link, useLocation } from "react-router-dom";

export function PublicHeader() {
  const location = useLocation();
  const pathname = location.pathname;

  const navlinks = [
    {
      name: "Play",
      path: `/login`,
    },
    {
      name: "Join Game",
      path: `/login`,
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-[#0000000D] px-[20px] pt-0 backdrop-blur-sm sm:relative sm:bg-transparent sm:px-[40px] sm:pt-[40px] sm:backdrop-blur-none md:px-[60px] lg:px-[80px] xl:px-[120px]">
      <header className="w-full">
        <div className="relative overflow-visible bg-transparent">
          <div className="container mx-auto px-[10px] py-[20px] sm:px-0 sm:py-0">
            <div className="flex w-full items-center justify-between sm:justify-end">
              <img
                src="/TrivvyLogo.png"
                className="block h-[60px] w-[64px] sm:hidden sm:h-[100px] sm:w-[100px]"
              />
              <div className="flex flex-row items-center gap-[23px]">
                <div className="hidden gap-[23px] md:flex">
                  <nav className="flex gap-[23px] font-normal">
                    {navlinks.map((url) => (
                      <Link
                        to={url.path}
                        className={`p-[10px] font-michroma text-[24px] ${
                          pathname === url.path
                            ? "text-[#FF6A00]"
                            : "text-[#ED9B5E] transition-colors hover:text-[#FF6A00]"
                        }`}
                      >
                        {url.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                <AccountPopover />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
