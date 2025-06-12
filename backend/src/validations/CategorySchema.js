import yup from "yup";

export const categorySchema = yup.object({
  name: yup
    .string()
    .matches(
      /^[A-Za-z\s]+$/,
      "Category name must contain only letters and spaces"
    ),
  description: yup.string().required("Description is required"),
});

export const deletecategorySchema = yup.object({
  id: yup.string().required("Category ID is required"),
});