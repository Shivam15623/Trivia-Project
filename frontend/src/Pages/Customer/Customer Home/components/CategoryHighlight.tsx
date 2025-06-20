import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFetchHomeCategoriesQuery } from "@/services";
import React from "react";

const CategoryHighlight = () => {
  const { data: fetchCategory } = useFetchHomeCategoriesQuery();
  const data = fetchCategory?.data;
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <section className="py-20 bg-[#FFF9F4] text-[#333]">
      <h1 className="text-center text-3xl font-extrabold mb-10 tracking-tight text-[#FF6B35]">
        Explore Categories
      </h1>

      <Carousel
        opts={{ align: "start" }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-11/12 md:w-3/4 mx-auto max-w-screen "
      >
        <CarouselContent className="-ml-1 overflow-visible ">
          {data?.map((cat, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 px-2"
            >
              <div className="relative aspect-[1/1.28] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.04]">
                <img
                  src={cat.thumbnail}
                  alt="Category Thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-[#FF6B35] bg-opacity-90 text-white text-center py-2">
                  <span className="font-bold text-sm sm:text-base">
                    {cat.name}
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant={"ghost"} className="hidden md:block" />
        <CarouselNext variant={"ghost"} className="hidden md:block" />
      </Carousel>
    </section>
  );
};

export default CategoryHighlight;
