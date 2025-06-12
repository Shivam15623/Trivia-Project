import CreateGameHero from "@/CustomComponent/layout components/heroes/CreateGameHero";
import { useFetchCategoryPublicQuery } from "@/services";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useCreateGameByUserMutation } from "@/services/GameApi";

import logError from "@/utills/logError";
import { showSuccess } from "@/CustomComponent/toastUtills";
import CategoryCardSelector from "@/components/CategoryCardSelector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RenderField } from "@/temp/renderFields";
import {
  createGameSchema,
  CreateGameValue,
} from "@/SchemaValidations/GameSchema";

const CustomerPlay = () => {
  const { data: categories, isLoading } = useFetchCategoryPublicQuery();
  const [AddGames] = useCreateGameByUserMutation();
  const navigate = useNavigate();
  const form = useForm<CreateGameValue>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      gameTitle: "",
      selectedCategories: [],
    },
  });
  const selectedCategories = form.watch("selectedCategories") || [];

  const onSubmit = async (data: CreateGameValue) => {
    try {
      const response = await AddGames({
        title: data.gameTitle,
        categories: data.selectedCategories,
      }).unwrap();
      if (response.success === true) {
        form.setValue("selectedCategories", []);
        form.setValue("gameTitle", "");
        showSuccess(response.message);

        navigate("/customer/mygames");
      }
    } catch (err) {
      logError(err);
    }
  };

  return (
    <>
      <CreateGameHero />
      <section className="px-3 sm:px-8 md:px-12 lg:px-20 xl:px-27 2xl:px-32 py-6 bg-[#FFF9F4]">
        <h2 className="text-3xl 2xl:text-7xl mb-2  font-bold font-cairo text-center">
          Categories
        </h2>
        <p className="para-text font-cairo text-center max-w-[min(768px,_100%)] 2xl:max-w-6xl mx-auto mt-8 max-xl:text-balance">
          3 categories for your team, 3 categories for the opposing team, with a
          total of 6 categories with 36 different questions, choose the
          categories carefully to ensure the greatest chance of winning
        </p>

        {isLoading ? (
          <p>Loading categories...</p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-20 sm:mt-30"
            >
              <FormField
                control={form.control}
                name="selectedCategories"
                render={({ field }) => {
                  const selectedCategories = field.value || [];

                  const toggleCategory = (categoryId: string) => {
                    const updated = selectedCategories.includes(categoryId)
                      ? selectedCategories.filter(
                          (id: string) => id !== categoryId
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-3.5 sm:gap-x-5 gap-y-3.5 md:gap-y-13 sm:gap-y-8 lg:gap-y-20 max-w-[1574px] mx-auto justify-center">
                          {categories?.data.map((category) => (
                            <CategoryCardSelector
                              key={category._id}
                              category={category}
                              selected={selectedCategories.includes(
                                category._id
                              )}
                              disabled={
                                selectedCategories.length >= 6 &&
                                !selectedCategories.includes(category._id)
                              }
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

              <div
                id="createGame"
                className="flex justify-center gap-10 2xl:gap-x-20 md:grid-cols-2 mt-10 md:mt-16 max-w-4xl 4xl:max-w-6xl mx-auto"
              >
                <div className="flex flex-col">
                  <div className="font-cairo min-w-[300px] xl:min-w-[350px] 2xl:min-w-[370px]">
                    <RenderField
                      control={form.control}
                      label=""
                      name="gameTitle"
                      type="text"
                      className="border border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 xl:py-4 rounded-full placeholder:text-inherit text-lg 2xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                      inputProps={{
                        placeholder: "Enter game title",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center mt-10 2xl:mt-20 4xl:mt-44">
                <Button
                  type="submit"
                  disabled={
                    selectedCategories.length === 0 ||
                    selectedCategories.length > 6
                  }
                  className="text-2xl xl:text-3xl 4xl:text-5xl font-arabic-semibold px-8 xl:px-16 4xl:px-28 py-3.5 xl:py-5 2xl:py-10 text-white rounded-full orange-gradient"
                >
                  Create Game
                </Button>
              </div>
            </form>
          </Form>
        )}
      </section>
    </>
  );
};

export default CustomerPlay;
