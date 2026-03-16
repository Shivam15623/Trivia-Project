import React from "react";
import { GradientCard } from "./GradientBorderCard";
interface TestimonialProp {
  gradient?: string;
  borderWidth?: number;
  radius?: number;
  review: string;
  user?: {
    name: string;
    picture: string;
    job: string;
  };
}
const TestimonialCard: React.FC<TestimonialProp> = ({
  gradient = "linear-gradient(254.74deg, #FCD645 37.35%, #FCB734 47.07%, #FC9924 61.5%)",
  borderWidth = 4,
  radius = 20,
  review,
  user,
}) => {
  return (
    <GradientCard
      className="flex h-full min-h-[273px] w-full max-w-[900px] flex-col"
      radius={radius}
      padding={borderWidth}
      gradient={gradient}
    >
      <div className="flex h-full flex-1 flex-col gap-[32px] p-[32px]">
        {/* ⭐ Stars */}
        <div className="mb-4 flex gap-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <img src="/home/rateStar.svg" key={i} />
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <p className="mb-6 max-w-md font-michroma text-[18px] leading-[150%] text-white opacity-90">
            "{review}"
          </p>

          {/* 👤 User */}
          <div className="flex items-center gap-3">
            <img
              src={user?.picture ? user.picture : "https://i.pravatar.cc/40"}
              className="h-12 w-12 rounded-full"
              alt="User avatar"
            />
            <div className="text-white">
              <div className="font-outfit text-[16px] font-normal">
                {user ? user.name : "Name Surname"}
              </div>
              <div className="font-outfit text-[12px] font-normal">
                {user ? user.job : "Gamer"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GradientCard>
  );
};

export default TestimonialCard;
