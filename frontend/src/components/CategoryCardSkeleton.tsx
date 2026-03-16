export const CategoryCardSkeleton = () => (
  <div className="p-[4.36px] sm:p-[7px]">
    <div className="relative z-10 flex h-full flex-col overflow-hidden">
      <div
        className="relative flex h-full w-full flex-col items-center justify-between gap-[4.36px] rounded-[14px] bg-gradient-to-b from-[#0B0B0B] to-[#000000] px-3 pb-4 pt-[1px] sm:px-[28.67px] sm:pb-[34px]"
      >
        {/* Top-right corner SVG — same as unselected card */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-[0px] top-[0px] h-[37.18px] w-[35.46px] sm:h-[57px] sm:w-[55px]"
          viewBox="0 0 55 57"
          fill="none"
        >
          <mask id="skel-mask-tr" fill="white">
            <path d="M54.2031 56.8369L0.000228882 56.8369L0.00022382 -0.000334856L44.2031 -0.00033865C49.726 -0.000339124 54.2031 4.47681 54.2031 9.99966L54.2031 56.8369Z" />
          </mask>
          <path
            d="M54.2031 56.8369L0.000228882 56.8369L54.2031 56.8369ZM0.000223687 -1.50033L44.2031 -1.50034C50.5544 -1.50034 55.7031 3.64838 55.7031 9.99966L52.7031 9.99966C52.7031 5.30524 48.8975 1.49966 44.2031 1.49966L0.000223954 1.49967L0.000223687 -1.50033ZM44.2031 -1.50034C50.5544 -1.50034 55.7031 3.64838 55.7031 9.99966L55.7031 56.8369L52.7031 56.8369L52.7031 9.99966C52.7031 5.30524 48.8975 1.49966 44.2031 1.49966L44.2031 -1.50034ZM0.000228882 56.8369L0.00022382 -0.000334856L0.000228882 56.8369Z"
            fill="rgba(255,255,255,0.08)"
            mask="url(#skel-mask-tr)"
          />
        </svg>

        {/* Bottom-left corner SVG — same as unselected card */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-[0px] left-[0px] h-[37.18px] w-[35.46px] sm:h-[57px] sm:w-[55px]"
          viewBox="0 0 55 57"
          fill="none"
        >
          <mask id="skel-mask-bl" fill="white">
            <path d="M0 0H54.2029V56.8373H10C4.47716 56.8373 0 52.3601 0 46.8373V0Z" />
          </mask>
          <path
            d="M0 0H54.2029H0ZM54.2029 58.3373H10C3.64873 58.3373 -1.5 53.1885 -1.5 46.8373H1.5C1.5 51.5317 5.30558 55.3373 10 55.3373H54.2029V58.3373ZM10 58.3373C3.64873 58.3373 -1.5 53.1885 -1.5 46.8373V0H1.5V46.8373C1.5 51.5317 5.30558 55.3373 10 55.3373V58.3373ZM54.2029 0V56.8373V0Z"
            fill="rgba(255,255,255,0.08)"
            mask="url(#skel-mask-bl)"
          />
        </svg>

        {/* Image zone — matches clamp sizing from real card */}
        <div className="h-[clamp(129.52px,15vw,198px)] w-[clamp(123.42px,14vw,188.67px)] animate-pulse rounded-[6px] bg-[rgba(255,255,255,0.06)]" />

        {/* Name label */}
        <div className="h-[13px] w-[55%] animate-pulse rounded-full bg-[rgba(255,255,255,0.07)]" />
      </div>
    </div>
  </div>
);