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
import { Button } from "@/components/ui/button";
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

  const [addQuestionToCategory] = useAddQuestiontoCategoryMutation();
  const [editQuestion] = useUpdateQuestionMutation();
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
      description={
        isEdit
          ? "Update the question details below."
          : "Add a new question to the category."
      }
      size="2xl"
      resetForm={() => form.reset()} // ✅ resets when dialog closes
    >
      {" "}
      <Form {...form}>
        <form
          className="space-y-6 p-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Category Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RenderField
              Inputvariant="solidred"
              name="categoryId"
              label="Category"
              control={form.control}
              type="select"
              options={categoryList?.data || []}
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt._id}
              inputProps={{ required: true }}
            />
            <RenderField
              Inputvariant="solidred"
              name="points"
              label="Points"
              control={form.control}
              type="select"
              options={Points}
              inputProps={{ required: true }}
            />
          </div>
          <RenderField
            Inputvariant="solidred"
            name="questionText"
            label="Question"
            control={form.control}
            type="textarea"
            inputProps={{ placeholder: "Enter question text", required: true }}
          />

          {/* Answer */}
          <RenderField
            Inputvariant="solidred"
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
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {field.value.map((option, index) => (
                      <Input variant="solidred"
                        key={index}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...field.value];
                          newOptions[index] = e.target.value;
                          field.onChange(newOptions);
                        }}
                        className="p-3 border rounded-lg"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Question Image */}
          <hr className="my-3 h-[1px] bg-[#e2e8f0]" />
          <div className="flex w-full flex-row gap-2">
            <div className="w-1/2">
              <FileField
                name="questionImage"
                label="Question Image"
                control={form.control}
              />
            </div>

            {/* Vertical Divider */}
            <div className="w-px bg-[#e2e8f0]" />

            <div className="w-1/2">
              <FileField
                name="answerImage"
                label="Answer Image"
                control={form.control}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="grid grid-col-1 md:grid-cols-2 mt-4 gap-3">
            <Button
              type="submit"
              variant={"gradient"}
              className="w-full   rounded-lg"
            >
              Submit
            </Button>
            <DialogWrapper.CancelButton />
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
