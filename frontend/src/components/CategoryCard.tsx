import { Category } from "@/interfaces/categoriesInterface";
import React from "react";
import { Checkbox } from "./ui/checkbox";

type Props = {
  category: Category;
  selected: boolean;
  disabled: boolean;
  toggleCategory: (categoryId: string) => void;
};

const CategoryCard: React.FC<Props> = ({
  category,
  selected,
  disabled,
  toggleCategory,
}) => {
  return (
    <label
      key={category._id}
      className={` ${selected ? "gradient-border p-[2.62px]" : "p-[4.36px] sm:p-[7px]"}`}
      style={
        {
          "--border-gradient":
            "linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)",
          "--radius": `${8.72}px`,
          "--padding": `${2.62}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative z-10 flex h-full flex-col overflow-hidden">
        {selected && (
          <div className="absolute left-[40%] top-0 z-20 w-[43.7px] rounded-b-[4px] bg-[#7BFDFD] text-center font-michroma text-[6.54px] text-[#2884C7] sm:left-[35%] sm:w-[66px] sm:text-[10px]">
            Selected
          </div>
        )}
        <div
          className={`relative flex h-full w-full flex-col items-center justify-between gap-[4.36px] ${selected ? "rounded-[8.72px]" : "rounded-[14px]"} bg-gradient-to-b from-[#0B0B0B] to-[#000000] px-3 pb-4 pt-[1px] text-white sm:px-[28.67px] sm:pb-[34px]`}
        >
          <Checkbox
            id={category._id}
            checked={selected}
            onCheckedChange={() => !disabled && toggleCategory(category._id)}
            className="sr-only"
          />
          {/* Top-right corner */}
          {!selected && (
            <>
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[0px] top-[0px] h-[37.18px] w-[35.46px] sm:h-[57px] sm:w-[55px]"
                viewBox="0 0 55 57"
                fill="none"
              >
                <mask id="path-1-inside-1_501_671" fill="white">
                  <path d="M54.2031 56.8369L0.000228882 56.8369L0.00022382 -0.000334856L44.2031 -0.00033865C49.726 -0.000339124 54.2031 4.47681 54.2031 9.99966L54.2031 56.8369Z" />
                </mask>
                <path
                  d="M54.2031 56.8369L0.000228882 56.8369L54.2031 56.8369ZM0.000223687 -1.50033L44.2031 -1.50034C50.5544 -1.50034 55.7031 3.64838 55.7031 9.99966L52.7031 9.99966C52.7031 5.30524 48.8975 1.49966 44.2031 1.49966L0.000223954 1.49967L0.000223687 -1.50033ZM44.2031 -1.50034C50.5544 -1.50034 55.7031 3.64838 55.7031 9.99966L55.7031 56.8369L52.7031 56.8369L52.7031 9.99966C52.7031 5.30524 48.8975 1.49966 44.2031 1.49966L44.2031 -1.50034ZM0.000228882 56.8369L0.00022382 -0.000334856L0.000228882 56.8369Z"
                  fill="url(#paint0_linear_501_671)"
                  mask="url(#path-1-inside-1_501_671)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_501_671"
                    x1="27.1017"
                    y1="56.8369"
                    x2="27.1017"
                    y2="-0.000337182"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.389423" stop-color="#7BFDFD" />
                    <stop offset="0.615385" stop-color="#2884C7" />
                  </linearGradient>
                </defs>
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute bottom-[0px] left-[0px] h-[37.18px] w-[35.46px] sm:h-[57px] sm:w-[55px]"
                viewBox="0 0 55 57"
                fill="none"
              >
                <mask id="path-1-inside-1_501_670" fill="white">
                  <path d="M0 0H54.2029V56.8373H10C4.47716 56.8373 0 52.3601 0 46.8373V0Z" />
                </mask>
                <path
                  d="M0 0H54.2029H0ZM54.2029 58.3373H10C3.64873 58.3373 -1.5 53.1885 -1.5 46.8373H1.5C1.5 51.5317 5.30558 55.3373 10 55.3373H54.2029V58.3373ZM10 58.3373C3.64873 58.3373 -1.5 53.1885 -1.5 46.8373V0H1.5V46.8373C1.5 51.5317 5.30558 55.3373 10 55.3373V58.3373ZM54.2029 0V56.8373V0Z"
                  fill="url(#paint0_linear_501_670)"
                  mask="url(#path-1-inside-1_501_670)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_501_670"
                    x1="27.1014"
                    y1="0"
                    x2="27.1014"
                    y2="56.8373"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.389423" stop-color="#7BFDFD" />
                    <stop offset="0.615385" stop-color="#2884C7" />
                  </linearGradient>
                </defs>
              </svg>
            </>
          )}

          {/* Image */}
          <div className="h-[clamp(129.52px,15vw,198px)] w-[clamp(123.42px,14vw,188.67px)]">
            <img
              src={category.thumbnail}
              alt="Category"
              className="h-full w-full object-contain"
            />
          </div>

          <p className="text-center font-michroma text-[12px] tracking-wide opacity-90 sm:text-[13px]">
            {category.name}
          </p>
        </div>
      </div>
    </label>
  );
};

export default CategoryCard;
