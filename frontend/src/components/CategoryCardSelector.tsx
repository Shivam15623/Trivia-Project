import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/interfaces/categoriesInterface";

type Props = {
  category: Category;
  selected: boolean;
  disabled: boolean;
  toggleCategory: (categoryId: string) => void;
};

const CategoryCardSelector = ({
  category,
  selected,
  disabled,
  toggleCategory,
}: Props) => {
  return (
    <div key={category._id} className="relative">
      <Checkbox
        id={category._id}
        checked={selected}
        onCheckedChange={() => !disabled && toggleCategory(category._id)}
        className="sr-only"
      />
      <label
        htmlFor={category._id}
        className={`block rounded-xl overflow-hidden cursor-pointer duration-100 h-full aspect-[1/1.26] relative 
    ${selected ? "ring-4 ring-[#3193e9]" : ""}`}
      >
        <figure
          className={`h-full relative  ${
            disabled ? "grayscale opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img
            src={category.thumbnail}
            alt={category.name}
            className={`w-full h-full object-cover transition-all duration-200`}
          />
          <div className="absolute top-3/4 left-0 right-0 bottom-0 bg-[#FF7546] border-t-2 border-t-black flex justify-center items-center">
            <figcaption className="inline-block whitespace-nowrap text-white font-bold text-center custom-font-size-teen sm:text-[12px] lg:text-lg 4xl:text-xl">
              {category.name}
            </figcaption>
          </div>
        </figure>
      </label>
    </div>
  );
};

export default CategoryCardSelector;
