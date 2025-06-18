import { ReactNode } from "react";

const AuthCardWrapper = ({
  icon,

  children,
}: {
  icon: ReactNode;

  children: ReactNode;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#ff100f] to-[#ffc070] p-6 text-center">
        <div className="bg-white/90 rounded-full w-20 h-20 mx-auto flex items-center justify-center hlogo-animation">
          {icon}
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthCardWrapper;
