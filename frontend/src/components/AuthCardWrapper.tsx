import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { ReactNode } from "react";

const AuthCardWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <GradientCard className="relative z-10">
      <div className="relative z-10 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg sm:w-auto">
        <div className="text-center">
          <img
            src="/TrivvyLogo.png"
            className="hlogo-animation mx-auto h-20 w-20 rounded-full"
          />
        </div>
        {children}
      </div>
    </GradientCard>
  );
};

export default AuthCardWrapper;
