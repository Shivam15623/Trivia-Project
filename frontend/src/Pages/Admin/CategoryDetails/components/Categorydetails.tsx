import { Category } from "@/interfaces/categoriesInterface";
import { CategoryDialog } from "../../Categories/components/ManageCategory";
import { Edit } from "lucide-react";

import { QuestionDialog } from "./QuestionDialog/Manage";
import DeleteCategory from "../../Categories/components/DeleteCategory";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/Pages/Customer/CustomerHome/components/GradientBorderCard";
import { GradientButton } from "@/components/GradientButton";

type Props = {
  category: Category;
  totalQuestions: number;
};
const CategoryDetails = ({ category, totalQuestions }: Props) => {
  return (
    <>
      <GradientCard
        className=""
        gradient="linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)"
        padding={3}
        radius={12}
      >
        <div className="flex flex-col items-center gap-5 p-6 sm:flex-row">
          <img
            src={category.thumbnail}
            alt="Web Development"
            className="h-32 object-contain sm:h-40 md:h-[200px] md:w-[200px]"
          />

          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-[36px] font-semibold text-white">
                    {category.name}
                  </h1>
                </div>
                <p className="mt-2 font-inter text-sm text-white sm:text-lg">
                  {category.description}
                </p>
              </div>

              <div className="flex space-x-2 self-end sm:self-auto">
                <div className="flex items-center gap-2">
                  <CategoryDialog
                    slug={category.slug}
                    trigger={
                      <Button
                        className="rounded-md text-white transition-colors hover:bg-blue-50 hover:text-blue-600"
                        variant={"ghost"}
                      >
                        <Edit className="text-[24px]" />
                      </Button>
                    }
                  />

                  <DeleteCategory
                    categoryId={category._id}
                    categoryName={category.name}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-row gap-[54px]">
              <div className="flex items-center space-x-3">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="39"
                    height="39"
                    rx="19.5"
                    fill="white"
                    fill-opacity="0.1"
                  />
                  <path
                    d="M15 14.0707C15 12.7312 15.5268 11.4466 16.4645 10.4995C17.4021 9.55231 18.6739 9.0202 20 9.0202C21.3261 9.0202 22.5979 9.55231 23.5355 10.4995C24.4732 11.4466 25 12.7312 25 14.0707C25 15.5414 24.67 16.404 24.243 17.0202C23.829 17.6182 23.293 18.0434 22.606 18.5909L22.379 18.7707C21.612 19.3848 20.731 20.1323 20.068 21.3141C19.4 22.503 19 24.0424 19 26.1919C19 26.4598 19.1054 26.7167 19.2929 26.9062C19.4804 27.0956 19.7348 27.202 20 27.202C20.2652 27.202 20.5196 27.0956 20.7071 26.9062C20.8946 26.7167 21 26.4598 21 26.1919C21 24.301 21.35 23.1253 21.807 22.3101C22.269 21.4879 22.887 20.9414 23.621 20.3545L23.851 20.1717C24.511 19.6505 25.287 19.0364 25.882 18.1768C26.581 17.1667 27 15.8838 27 14.0707C27 12.1954 26.2625 10.397 24.9497 9.07096C23.637 7.74495 21.8565 7 20 7C18.1435 7 16.363 7.74495 15.0503 9.07096C13.7375 10.397 13 12.1954 13 14.0707C13 14.3386 13.1054 14.5955 13.2929 14.785C13.4804 14.9744 13.7348 15.0808 14 15.0808C14.2652 15.0808 14.5196 14.9744 14.7071 14.785C14.8946 14.5955 15 14.3386 15 14.0707ZM20 32C20.3315 32 20.6495 31.867 20.8839 31.6302C21.1183 31.3934 21.25 31.0722 21.25 30.7374C21.25 30.4025 21.1183 30.0813 20.8839 29.8446C20.6495 29.6078 20.3315 29.4747 20 29.4747C19.6685 29.4747 19.3505 29.6078 19.1161 29.8446C18.8817 30.0813 18.75 30.4025 18.75 30.7374C18.75 31.0722 18.8817 31.3934 19.1161 31.6302C19.3505 31.867 19.6685 32 20 32Z"
                    fill="url(#paint0_linear_832_3802)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_832_3802"
                      x1="20"
                      y1="7"
                      x2="20"
                      y2="32"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                  </defs>
                </svg>

                <div>
                  <h3 className="mb-[7px] font-outfit text-xs font-medium leading-[100%] text-white">
                    Total Questions
                  </h3>
                  <p className="font-outfit text-base font-semibold leading-[100%] text-white">
                    {totalQuestions}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="39"
                    height="39"
                    rx="19.5"
                    fill="white"
                    fill-opacity="0.1"
                  />
                  <path
                    d="M27 11.5H13C11.8954 11.5 11 12.3954 11 13.5V27.5C11 28.6046 11.8954 29.5 13 29.5H27C28.1046 29.5 29 28.6046 29 27.5V13.5C29 12.3954 28.1046 11.5 27 11.5Z"
                    stroke="url(#paint0_linear_832_3832)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24 9.5V13.5"
                    stroke="url(#paint1_linear_832_3832)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 9.5V13.5"
                    stroke="url(#paint2_linear_832_3832)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 17.5H29"
                    stroke="url(#paint3_linear_832_3832)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_832_3832"
                      x1="20"
                      y1="11.5"
                      x2="20"
                      y2="29.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_832_3832"
                      x1="24.5"
                      y1="9.5"
                      x2="24.5"
                      y2="13.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_832_3832"
                      x1="16.5"
                      y1="9.5"
                      x2="16.5"
                      y2="13.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_832_3832"
                      x1="20"
                      y1="17.5"
                      x2="20"
                      y2="18.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                  </defs>
                </svg>

                <div>
                  <h3 className="mb-[7px] font-outfit text-xs font-medium leading-[100%] text-white">
                    Created
                  </h3>
                  <p className="font-outfit text-base font-semibold leading-[100%] text-white">
                    {category.createdAt &&
                      new Date(category.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <svg
                  width="39"
                  height="39"
                  viewBox="0 0 39 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="39"
                    height="39"
                    rx="19.5"
                    fill="white"
                    fill-opacity="0.1"
                  />
                  <path
                    d="M16.9996 14.7004C16.9996 13.0429 18.3421 11.7004 19.9996 11.7004C21.6571 11.7004 22.9996 13.0429 22.9996 14.7004C22.9996 16.3579 21.6571 17.7004 19.9996 17.7004C18.3421 17.7004 16.9996 16.3579 16.9996 14.7004ZM24.7996 14.7004C24.7996 12.0491 22.6509 9.90039 19.9996 9.90039C17.3484 9.90039 15.1996 12.0491 15.1996 14.7004C15.1996 17.3516 17.3484 19.5004 19.9996 19.5004C22.6509 19.5004 24.7996 17.3516 24.7996 14.7004ZM13.3996 27.9004C13.3996 25.2491 15.5484 23.1004 18.1996 23.1004H21.7996C24.4509 23.1004 26.5996 25.2491 26.5996 27.9004V28.2004C26.5996 28.6991 27.0009 29.1004 27.4996 29.1004C27.9984 29.1004 28.3996 28.6991 28.3996 28.2004V27.9004C28.3996 24.2554 25.4446 21.3004 21.7996 21.3004H18.1996C14.5546 21.3004 11.5996 24.2554 11.5996 27.9004V28.2004C11.5996 28.6991 12.0009 29.1004 12.4996 29.1004C12.9984 29.1004 13.3996 28.6991 13.3996 28.2004V27.9004Z"
                    fill="url(#paint0_linear_832_3826)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_832_3826"
                      x1="19.9996"
                      y1="9.90039"
                      x2="19.9996"
                      y2="29.1004"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.384615" stop-color="#FCD645" />
                      <stop offset="0.519231" stop-color="#FCB734" />
                      <stop offset="0.620192" stop-color="#FC9924" />
                    </linearGradient>
                  </defs>
                </svg>

                <div>
                  <h3 className="mb-[7px] font-outfit text-xs font-medium leading-[100%] text-white">
                    Status
                  </h3>
                  <p className="font-outfit text-base font-semibold leading-[100%] text-white">
                    {category.isPublic ? <>Public</> : <>Not Public</>}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <QuestionDialog
                trigger={
                  <GradientButton
                    className="max-w-[183px] shadow-[0px_0px_34px_0px_#F5FFE633]"
                    icon={true}
                  >
                    Add Question
                  </GradientButton>
                }
              />
            </div>
          </div>
        </div>
      </GradientCard>
    </>
  );
};
export default CategoryDetails;
