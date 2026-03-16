import CategoryCard from "@/components/CategoryCard";
import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton";
import { GradientButton } from "@/components/GradientButton";
import { showSuccess } from "@/components/toastUtills";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSocket } from "@/hooks/useSocket";
import {
  createGameSchema,
  CreateGameValue,
} from "@/SchemaValidations/GameSchema";
import {
  useFetchCategoryPublicQuery,
  useInitializeSoloGameMutation,
} from "@/services";

import { handleApiError } from "@/utills/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const TimedGameTab = ({ timerDuration }: { timerDuration: number }) => {
  const { data: categories, isLoading: categoriesLoading } =
    useFetchCategoryPublicQuery();
  const socket = useSocket();
  const [AddGames] = useInitializeSoloGameMutation();
  const navigate = useNavigate();
  const form = useForm<CreateGameValue>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      gameTitle: "",
      selectedCategories: [],
    },
  });

  const INITIAL_VISIBLE = 10; // matches your 5-col grid — 2 full rows
  const [showAll, setShowAll] = useState(false);

  // then inside your .map(), slice the categories:
  const visibleCategories = showAll
    ? categories?.data
    : categories?.data?.slice(0, INITIAL_VISIBLE);

  const onSubmit = async (data: CreateGameValue) => {
    try {
      if (!socket.id) {
        return;
      }
      const response = await AddGames({
        title: data.gameTitle,
        categoryIds: data.selectedCategories,
        mode: "timed_solo",
        socketId: socket?.id,
        timer: timerDuration,
      }).unwrap();
      if (response.success === true) {
        form.setValue("selectedCategories", []);
        form.setValue("gameTitle", "");
        showSuccess(response.message);

        navigate(`/game/SoloGame/${response.data.sessionCode}`);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <>
      {" "}
      <section className="relative z-10 flex flex-col items-center justify-center gap-[40px] px-[20px] sm:gap-[80px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="flex flex-row justify-center gap-[23px]">
          <div className="flex flex-col items-center justify-center gap-[14px]">
            <h1 className="text-center font-inter text-[44px] font-semibold leading-[100%] text-white sm:text-[64px] sm:leading-[70px]">
              Choose <br className="block sm:hidden" />
              <span className="relative bg-a-blue bg-clip-text text-transparent after:absolute after:-right-[51px] after:bottom-[6px] after:h-[40px] after:w-[50px] after:bg-[url('/eyes.svg')] after:bg-contain after:bg-no-repeat after:content-[''] sm:after:-right-[90px] sm:after:h-[70px] sm:after:w-[87px]">
                Categories
              </span>
            </h1>

            <h3
              className="mx-auto max-w-[504px] text-center font-outfit text-[14px] font-normal leading-[100%] text-white sm:text-[24px]"
              style={{ letterSpacing: "0%" }}
            >
              Select any 6 categories.
            </h3>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center gap-[80px] sm:gap-[180px]">
              <div className="flex flex-col items-center gap-[20px]">
                {" "}
                <FormField
                  control={form.control}
                  name="selectedCategories"
                  render={({ field }) => {
                    const selectedCategories = field.value || [];

                    const toggleCategory = (categoryId: string) => {
                      const updated = selectedCategories.includes(categoryId)
                        ? selectedCategories.filter(
                            (id: string) => id !== categoryId,
                          )
                        : selectedCategories.length < 6
                          ? [...selectedCategories, categoryId]
                          : selectedCategories;

                      field.onChange(updated);
                    };

                    return (
                      <FormItem>
                        <FormLabel className="sr-only">Categories</FormLabel>
                        <FormControl>
                          <div className="grid w-full max-w-[1280px] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-16">
                            {categoriesLoading
                              ? // ── Skeleton state ──────────────────────────
                                Array.from({ length: INITIAL_VISIBLE }).map(
                                  (_, i) => <CategoryCardSkeleton key={i} />,
                                )
                              : // ── Loaded state ─────────────────────────────
                                visibleCategories?.map((category) => (
                                  <CategoryCard
                                    key={category._id}
                                    disabled={
                                      selectedCategories.length >= 6 &&
                                      !selectedCategories.includes(category._id)
                                    }
                                    category={category}
                                    selected={selectedCategories.includes(
                                      category._id,
                                    )}
                                    toggleCategory={toggleCategory}
                                  />
                                ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {!categoriesLoading &&
                  !showAll &&
                  (categories?.data?.length ?? 0) > INITIAL_VISIBLE && (
                    <GradientButton
                      type="button"
                      className="w-full max-w-[150px]"
                      onClick={() => setShowAll(true)}
                    >
                      View All
                    </GradientButton>
                  )}
              </div>
              <section className="relative z-10 mb-20 flex flex-col items-center justify-center gap-10 sm:mb-[180px]">
                <div className="flex w-full flex-col items-center justify-center gap-3.5">
                  <h2 className="text-center font-inter text-[28px] font-semibold leading-[100%] text-white sm:text-[64px] sm:leading-[70px]">
                    Name Your <br className="block sm:hidden" />
                    <span className="relative bg-[#FC9924] bg-clip-text uppercase text-transparent after:absolute after:-top-[40px] after:left-[95%] after:hidden after:h-[100px] after:w-[100px] after:bg-[url('/3sparkles.svg')] after:bg-contain after:bg-no-repeat after:content-[''] sm:bg-a-sun sm:after:block">
                      Masterpiece
                    </span>
                  </h2>
                  <FormField
                    control={form.control}
                    name="gameTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <input
                            {...field}
                            className="h-[40px] w-full max-w-[330px] rounded-[100px] bg-white bg-opacity-20 px-5 ps-[29px] text-[14px] text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-[rgba(255,255,255,1)] placeholder:opacity-50 focus:outline-none"
                            placeholder="e.g. Ultimate Friday Night Quiz"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-[18px]">
                  {" "}
                  <GradientButton
                    type="submit"
                    className="w-full max-w-[155px]"
                  >
                    Start Now
                  </GradientButton>
                </div>
              </section>
            </div>
          </form>
        </Form>
      </section>
    </>
  );
};

export default TimedGameTab;
