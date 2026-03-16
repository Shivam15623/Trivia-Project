import { Link, useLocation } from "react-router-dom";
import AccountPopover from "../../../components/AccountPopover";
import { useDispatch, useSelector } from "react-redux";

import { selectAuth, setLoggedOut } from "@/redux/AuthSlice/authSlice";
import Loader from "@/components/Loader";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogoutMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";

export function CustomerNavHeader() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useSelector(selectAuth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navlinks = [
    {
      name: "Play",
      path: "/customer/CreateGame",
      mobileOnly: false,
    },
    {
      name: "Join Game",
      path: "/customer/joinGame",
      mobileOnly: false,
    },
    {
      name: "My Profile",
      path: `/customer/userProfile/${user?.slug}`,
      mobileOnly: true,
    },
  ];
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      const res = await logout(undefined).unwrap();
      if (res.statuscode === 200) {
        dispatch(setLoggedOut());
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="sticky top-0 z-50 bg-[#000000bf] px-[20px] pt-0 backdrop-blur-lg md:relative md:bg-transparent sm:px-[40px] md:pt-[40px] sm:backdrop-blur-none md:px-[60px] lg:px-[80px] xl:px-[120px]">
      <header className="w-full">
        <div className="relative overflow-visible bg-transparent">
          <div className="container mx-auto px-[10px] py-[20px] md:px-0 md:py-0">
            <div className="flex w-full items-center justify-between">
              <img
                src="/TrivvyLogo.png"
                className="h-[60px] w-[64px] md:h-[100px] md:w-[100px]"
              />
              <div className="flex flex-row items-center gap-[23px]">
                <div className="hidden gap-[23px] md:flex">
                  <nav className="flex gap-[23px] font-normal">
                    {navlinks
                      .filter((ll) => ll.mobileOnly === false)
                      .map((url) => (
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
                <div className="hidden md:block">
                  <AccountPopover />
                </div>
                <button
                  className="flex h-10 w-10 items-center justify-center text-[#ed9c5e] md:hidden"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X size={24} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col border-t border-[#ffffff1a] pb-4 font-michroma">
              {navlinks.map((url, index) => (
                <motion.div
                  key={url.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.25 }}
                >
                  <Link
                    to={url.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block p-[10px] font-michroma text-base ${
                      pathname === url.path
                        ? "text-[#FF6A00]"
                        : "text-[#ED9B5E] transition-colors hover:text-[#FF6A00]"
                    }`}
                  >
                    {url.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navlinks.length * 0.08, duration: 0.25 }}
              >
                <button
                  onClick={onLogout}
                  className="hover:text-destructive/80 flex w-full items-center gap-2 p-[10px] text-left text-base text-destructive"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
