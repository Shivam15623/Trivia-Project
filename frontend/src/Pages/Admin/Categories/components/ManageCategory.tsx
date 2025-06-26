import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader />
        </div>
      </DialogWrapper>
    );
  }
  return (
    <DialogWrapper
      type={isEdit ? "edit" : "add"}
      title={isEdit ? "Update Category" : "Add Category"}
      description={
        isEdit ? "Edit your category details." : "Fill category details."
      }
      trigger={trigger}
      resetForm={() => form.reset()}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`space-y-6 p-4 ${
            isSubmitting ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <RenderField
            Inputvariant="solidred"
            name="name"
            label="Name"
            control={form.control}
            inputProps={{ required: true, placeholder: "enter Category Name" }}
          />
          <RenderField
            Inputvariant="solidred"
            name="description"
            label="Description"
            type="textarea"
            control={form.control}
            inputProps={{ required: true, placeholder: "enter description" }}
          />
          <FileField
            control={form.control}
            label="Thumbnail"
            name="thumbnail"
            // inputProps={{
            //   placeholder: "Upload Thumbnail image",
            // }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Button
              type="submit"
              className="w-full"
              variant="gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>

            {/* Cancel button */}
            <DialogWrapper.CancelButton />
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
