import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  useAddQuestiontoCategoryMutation,
  useFetchCategoriesQuery,
  useFetchQuestionByIdQuery,
  useUpdateQuestionMutation,
} from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";

import { DialogWrapper } from "@/components/DialogWrapper";
import { FileField } from "@/components/FormRender/renderFileField";
import {
  QuestionSchema,
  QuestionValues,
} from "@/SchemaValidations/QuestionSchema";

import { ReactNode, useEffect } from "react";
import { RenderField } from "@/components/FormRender/renderFields";
import { Loader2 } from "lucide-react";
import { GradientButton } from "@/components/GradientButton";

const Points = [200, 400, 600];
type Props = {
  id?: string;
  trigger: ReactNode;
};
export function QuestionDialog({ id, trigger }: Props) {
  const isEdit = Boolean(id);
  const form = useForm<QuestionValues>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      categoryId: "",
      questionText: "",
      answer: "",
      points: 200,
      options: ["", "", "", ""],
      questionImage: undefined,
      answerImage: undefined,
    },
  });

  const [addQuestionToCategory, { isLoading: addLoading }] =
    useAddQuestiontoCategoryMutation();
  const [editQuestion, { isLoading: editLoading }] =
    useUpdateQuestionMutation();
  const { data: categoryList } = useFetchCategoriesQuery();
  const { data: questionData } = useFetchQuestionByIdQuery(id!, {
    skip: !id, // Skip if not editing
  });
  const handleSubmit = async (data: QuestionValues) => {
    try {
      // FormData will be used for file uploads

      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("questionText", data.questionText);
      formData.append("answer", data.answer);
      formData.append("points", data.points.toString());

      for (const value of data.options) {
        if (value?.trim()) {
          formData.append("options", value.trim());
        }
      }
      if (data.questionImage instanceof File) {
        formData.append("questionImage", data.questionImage);
      }

      if (data.answerImage instanceof File) {
        formData.append("answerImage", data.answerImage);
      }

      const res = isEdit
        ? await editQuestion({
            formData: formData,
            questionId: id ?? "",
          }).unwrap()
        : await addQuestionToCategory(formData).unwrap();

      if (res.success) {
        showSuccess(res.message);
        form.reset();
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  const isSubmitting = addLoading || editLoading;
  useEffect(() => {
    if (isEdit && questionData) {
      form.reset({
        categoryId: questionData.data.categoryId,
        questionText: questionData.data.questionText,
        answer: questionData.data.answer,
        points: questionData.data.points,
        options: questionData.data.options || ["", "", "", ""],
        questionImage: questionData.data.questionImage, // Reset file input
        answerImage: questionData.data.answerImage, // Reset file input
      });
    }
  }, [isEdit, questionData, form]);

  return (
    <DialogWrapper
      title={isEdit ? "Update Question" : "Add Question"}
      type={isEdit ? "edit" : "add"}
      trigger={trigger}
      size="3xl"
      resetForm={() => form.reset()} // ✅ resets when dialog closes
    >
      {" "}
      <Form {...form}>
        <form
          className={`space-y-3.5 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Category Dropdown */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
            <RenderField
              name="categoryId"
              label="Category"
              className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
              labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
              control={form.control}
              type="select"
              options={categoryList?.data || []}
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt._id}
              inputProps={{ required: true }}
            />

            <RenderField
              name="points"
              labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
              className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
              label="Points"
              control={form.control}
              type="select"
              options={Points}
              inputProps={{ required: true }}
            />
          </div>
          <RenderField
            labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
            className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            name="questionText"
            label="Question"
            control={form.control}
            type="textarea"
            inputProps={{ placeholder: "Enter question text", required: true }}
          />

          {/* Answer */}
          <RenderField
            className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
            name="answer"
            label="Answer"
            control={form.control}
            type="text"
            inputProps={{ placeholder: "Enter answer", required: true }}
          />

          {/* Options */}
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-outfit text-lg font-normal text-white">
                  Options
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {field.value.map((option, index) => (
                      <Input
                        className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...field.value];
                          newOptions[index] = e.target.value;
                          field.onChange(newOptions);
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Question Image */}

          <div className="grid w-full grid-cols-1 gap-6 font-outfit font-normal leading-[100%] text-white sm:max-w-[60%] sm:grid-cols-2">
            <FileField
              name="questionImage"
              label="Question Image"
              className="max-h-[120px] max-w-[200px]"
              control={form.control}
            />
            <FileField
              name="answerImage"
              className="max-h-[120px] max-w-[200px]"
              label="Answer Image"
              control={form.control}
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-row gap-[18px]">
            <GradientButton
              type="submit"
              className="w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </GradientButton>
            <DialogWrapper.CancelButton />
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
