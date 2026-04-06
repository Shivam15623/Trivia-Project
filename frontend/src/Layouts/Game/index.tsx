import { Outlet } from "react-router-dom";

const GameRoot = () => {
  return (
    <div className="relative flex h-auto min-h-screen flex-col bg-black">
      <Outlet />

      <div className="relative z-10 block px-5 py-0 sm:hidden sm:px-[120px] sm:py-5">
        <div className="flex w-full items-center justify-end gap-2 pb-3 pt-2">
          <span className="text-[12px] text-white opacity-60">
            Designed & Developed by
          </span>
          <a
            href="https://ifoxsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            <img
              src="/ifox-logo.png"
              className="h-5 w-5"
              alt="Ifox Solutions"
            />
            <span className="text-[12px] font-medium text-white opacity-80 transition-opacity hover:opacity-100">
              Ifox Solutions
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GameRoot;
