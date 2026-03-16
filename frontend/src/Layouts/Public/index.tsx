import { Outlet } from "react-router-dom";
import { PublicHeader } from "./Components/PublicNav";


const PublicRoot = () => {
  return (
    <div className="relative flex h-auto min-h-screen flex-col bg-black">
      <PublicHeader />

      <Outlet />
      <div className="relative z-10 px-5 py-0 sm:px-[120px] sm:py-5">
        <div className="flex w-full flex-col items-center gap-5 pb-5 sm:gap-10 sm:pb-0">
          <img src="/heroTrivvy.png" className="h-[130px] w-[138px]" />
          <div className="flex w-full flex-col items-center gap-5 sm:gap-[32px]">
            <hr className="h-px w-full border-0 bg-white opacity-50" />
            <div className="flex flex-row gap-5 text-[14px] font-normal leading-[150%] text-white sm:gap-6">
              <span>© 2026 IQ Clash</span>
              <div className="flex flex-col items-end justify-end gap-1 sm:flex-row sm:justify-center sm:gap-6">
                {" "}
                <div className="flex flex-row gap-2 sm:gap-6">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                </div>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRoot;
