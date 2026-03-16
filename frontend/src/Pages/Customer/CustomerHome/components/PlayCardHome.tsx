import { GradientLink } from "@/components/GradientButton";
import React from "react";

interface PlayCardProps {
  playLink?: string;
  image: string;
  title: string;
  subTitle: string;
  color: string;
}

const PlayCardHome: React.FC<PlayCardProps> = ({
  playLink,
  image,
  title,
  subTitle,
  color,
}) => {
  return (
    <div
      className="relative h-full w-full rounded-[20px]"
      style={{ boxShadow: "-20px 0px 20px 0px #00000033" }}
    >
      <div
        className="relative z-0 h-full w-full overflow-hidden rounded-[20px]"
        style={{ backgroundColor: color }}
      >
        {/* Noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10 "
          style={{
            backgroundImage: "url('/Noise.png')",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Text content */}
        <div className="relative z-20 m-[24px] flex flex-col gap-2">
          <h3 className="font-michroma text-[23px] font-normal leading-[100%] text-[#111111] sm:text-[40px]">
            {title}
          </h3>
          <h6
            className="max-w-[75%] font-outfit text-[10.23px] font-light leading-[100%] text-[#111111] sm:max-w-[233px] sm:text-[18px]"
            style={{ letterSpacing: "0%" }}
          >
            {subTitle}
          </h6>
        </div>

        {/* Play button */}
        {playLink && (
          <div className="absolute bottom-0 left-0 z-30 p-[8px]">
            <GradientLink icon={false} to={playLink}>
              Play {title}
            </GradientLink>
          </div>
        )}

        {/* Card image */}
        <img
          src={image}
          className="absolute bottom-0 right-0 z-20"
          alt={title}
        />
      </div>
    </div>
  );
};

export default PlayCardHome;
