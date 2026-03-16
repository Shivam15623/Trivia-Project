const baseClasses = `
  group relative flex h-[40px] max-w-[150px]
  items-center justify-center gap-2
  rounded-[20px] px-5 font-outfit text-[18px]
  text-white transition-all duration-300 ease-out
`;

import React from "react";
import { Link } from "react-router-dom";

type GradientButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: boolean;
  type?: "button" | "submit" | "reset";
};

type GradientLinkProps = {
  children: React.ReactNode;
  to: string;
  className?: string;
  icon?: boolean;
};

export const GradientLink: React.FC<GradientLinkProps> = ({
  children,
  to,
  className = "",
  icon = true,
}) => {
  return (
    <Link
      to={to}
      className={` ${baseClasses} cursor-pointer hover:shadow-[0_10px_25px_rgba(41,133,200,0.45)] ${className} `}
    >
      {/* Gradient Border */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[linear-gradient(93.58deg,#67C3FF_8.55%,#010A2A_47.56%,#67C3FF_94.76%)] p-[1.5px]">
        <div className="h-full w-full rounded-[18px] bg-[#2985C8]" />
      </div>

      <span className="relative z-10">{children}</span>

      {icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M15.1449 6.50586L20.9659 12.8151L14.6567 18.636"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.98081 12.1309L20.7972 12.8077"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
};
export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  icon = true,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={` ${baseClasses} ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:shadow-[0_10px_25px_rgba(41,133,200,0.45)]"
      } ${className} `}
    >
      {/* Gradient Border */}
      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[linear-gradient(93.58deg,#67C3FF_8.55%,#010A2A_47.56%,#67C3FF_94.76%)] p-[1.5px]">
        <div
          className={`h-full w-full rounded-[18px] ${
            disabled ? "bg-[#1E4F73]" : "bg-[#2985C8]"
          }`}
        />
      </div>

      <span className="relative z-10 text-lg leading-[100%]  ">{children}</span>

      {icon && !disabled && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path
            d="M15.1449 6.50586L20.9659 12.8151L14.6567 18.636"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.98081 12.1309L20.7972 12.8077"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};
