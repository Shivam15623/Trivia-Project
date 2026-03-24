import { CustomerNavHeader } from "@/Layouts/Customer/Components/CustomerNav";
import { Outlet } from "react-router-dom";

const CustomRoot = () => {
  return (
    <div className="relative flex h-auto min-h-screen flex-col bg-black">
      <CustomerNavHeader />

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
      </div>
    </div>
  );
};

export default CustomRoot;
