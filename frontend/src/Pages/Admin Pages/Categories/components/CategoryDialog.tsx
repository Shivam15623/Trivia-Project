import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { DialogWrapper } from "@/components/DialogWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { Edit, Plus } from "lucide-react";
import { FileField } from "@/components/renderFileField";
import { RenderField } from "@/components/renderFields";

type Props = {
  slug?: string;
  triggerLabel?: string;
  triggerclass?: string;
};

export function CategoryDialog({ slug, triggerLabel, triggerclass }: Props) {
  const isEdit = Boolean(slug);
  const { data, isLoading } = useFetchCategorybyslugQuery(slug!, {
    skip: !slug,
  });
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const form = useForm<CategoryValue>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: "", description: "", thumbnail: undefined },
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEdit && data?.data) {
      console.log("Fetched category:", data.data); // ✅ Check this
      const { name, description, thumbnail } = data.data;
      form.reset({ name, description, thumbnail });
      console.log("Form reset with:", form.getValues("thumbnail")); // ✅ Check this
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

  if (isEdit && isLoading) return <div className="p-4">Loading...</div>;

  return (
    <DialogWrapper
      type={isEdit ? "edit" : "add"}
      title={isEdit ? "Update Category" : "Add Category"}
      description={
        isEdit ? "Edit your category details." : "Fill category details."
      }
      triggerLabel={triggerLabel}
      icon={isEdit ? <Edit /> : <Plus />}
      triggerClassName={triggerclass}
      dialogClassName="sm:max-w-md"
      variant={isEdit ? "ghost" : "default"}
      resetForm={() => form.reset()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
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

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {isEdit ? "Update" : "Add"}
          </Button>
        </form>
      </Form>
    </DialogWrapper>
  );
}
