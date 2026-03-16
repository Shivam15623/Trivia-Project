import { CustomerNavHeader } from "@/Layouts/Customer/Components/CustomerNav";
import { Outlet } from "react-router-dom";

const CustomRoot = () => {
  return (
    <div className="bg-black min-h-screen  flex flex-col relative h-auto ">
      <CustomerNavHeader />

      <Outlet />
      <div className="px-5 py-0  relative z-10  sm:py-5 sm:px-[120px]">
        <div className="w-full flex flex-col gap-5 pb-5 sm:pb-0 sm:gap-10 items-center ">
          <img src="/heroTrivvy.png" className="w-[138px] h-[130px]" />
          <div className="flex flex-col items-center gap-5 sm:gap-[32px] w-full">
            <hr className="w-full h-px bg-white opacity-50 border-0" />
            <div className="flex flex-row gap-5 sm:gap-6 text-white leading-[150%] text-[14px] font-normal">
              <span>© 2026 IQ Clash</span>
              <div className="flex flex-col items-end justify-end sm:justify-center sm:flex-row gap-1 sm:gap-6">
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

export default CustomRoot;
