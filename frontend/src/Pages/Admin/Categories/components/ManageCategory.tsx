import { Form } from "@/components/ui/form";

import { DialogWrapper } from "@/components/DialogWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useFetchCategorybyslugQuery,
  useUpdateCategoryMutation,
} from "@/services";
import {
  CategorySchema,
  CategoryValue,
} from "@/SchemaValidations/CategorySchema";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";

import { FileField } from "@/components/FormRender/renderFileField";
import { RenderField } from "@/components/FormRender/renderFields";
import Loader from "@/components/Loader";
import { GradientButton } from "@/components/GradientButton";
import { Loader2 } from "lucide-react";

type Props = {
  slug?: string;
  trigger: ReactNode;
};

export function CategoryDialog({ slug, trigger }: Props) {
  const isEdit = Boolean(slug);
  const { data, isLoading } = useFetchCategorybyslugQuery(slug!, {
    skip: !slug,
  });
  const [createCategory, { isLoading: addLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: editLoading }] =
    useUpdateCategoryMutation();

  const form = useForm<CategoryValue>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: "", description: "", thumbnail: undefined },
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEdit && data?.data) {
      const { name, description, thumbnail } = data.data;
      form.reset({
        name: name,
        description: description,
        thumbnail: thumbnail,
      });
    }
  }, [data, form, isEdit]);

  const handleSubmit = async (values: CategoryValue) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description)
        formData.append("description", values.description);
      if (values.thumbnail instanceof File) {
        formData.append("thumbnail", values.thumbnail);
      }

      const response = isEdit
        ? await updateCategory({
            categoryId: data?.data?._id || "",
            updatedData: formData,
          }).unwrap()
        : await createCategory(formData).unwrap();

      if (response.success || response.statuscode === 200) {
        showSuccess(response.message);
        form.reset();
      }
    } catch (err) {
      handleApiError(err);
    }
  };
  const isSubmitting = addLoading || editLoading;
  if (isEdit && isLoading) {
    return (
      <DialogWrapper
        type="edit"
        title="Update Category"
        description="Edit your category details."
        trigger={trigger}
        resetForm={() => form.reset()}
      >
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader />
        </div>
      </DialogWrapper>
    );
  }
  return (
    <DialogWrapper
      type={isEdit ? "edit" : "add"}
      title={isEdit ? "Update Category" : "Add Category"}
      trigger={trigger}
      size="xl"
      resetForm={() => form.reset()}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`space-y-3.5 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <RenderField
            className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            name="name"
            labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
            label="Name"
            control={form.control}
            inputProps={{ required: true, placeholder: "enter Category Name" }}
          />
          <RenderField
            className="h-10 w-full rounded-[20px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            name="description"
            label="Description"
            labelClass="text-lg text-white font-normal leading-[100%] font-outfit"
            type="textarea"
            control={form.control}
            inputProps={{ required: true, placeholder: "enter description" }}
          />
          <FileField
            control={form.control}
            className="h-[128px] w-[128px]"
            label="Thumbnail"
            name="thumbnail"
            // inputProps={{
            //   placeholder: "Upload Thumbnail image",
            // }}
          />
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

            {/* Cancel button */}
            <DialogWrapper.CancelButton />
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
