import React from "react";

interface PlayCardProps {
  image: string;
  title: string;
  subTitle: string;
  color: string;

  isSelected?: boolean;
  selectChange?: () => void;
}

const PlayCard: React.FC<PlayCardProps> = ({
  image,
  title,
  subTitle,
  color,
  selectChange,
  isSelected,
}) => {
  const isSelectable = typeof selectChange === "function";

  const selectedBorderStyle = isSelected
    ? {
        padding: "4px",
        background: "linear-gradient(142.35deg, #00C201 4.39%, #006300 98.62%)",
      }
    : {};

  return (
    <div
      onClick={selectChange}
      className={`relative h-full w-full transition-all duration-300 ease-out ${
        isSelectable
          ? "cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          : ""
      } `}
      style={{
        boxShadow: "-20px 0px 20px 0px #00000033",
        borderRadius: "20px",
        ...selectedBorderStyle,
      }}
    >
      <div
        style={{ backgroundColor: color }}
        className="relative z-0 h-full max-h-[424px] w-full max-w-[586px] overflow-hidden rounded-[20px]"
      >
        {isSelected && (
          <img
            src="/PlaySelect.png"
            className="absolute right-[16px] top-[16px] z-20"
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: "url('/Noise.png')",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-20 m-[24px] flex flex-col gap-2">
          <h3 className="font-michroma text-[23px] font-normal leading-[100%] text-[#111111] sm:text-[40px]">
            {title}
          </h3>

          <h6
            style={{ letterSpacing: "0%" }}
            className="max-w-[75%] font-outfit text-[10.23px] font-light leading-[100%] text-[#111111] sm:max-w-[233px] sm:text-[18px]"
          >
            {subTitle}
          </h6>
        </div>

        <img src={image} className="absolute bottom-0 right-0 z-20" />
      </div>
    </div>
  );
};

export default PlayCard;
