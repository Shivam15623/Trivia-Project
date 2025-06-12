import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),

  thumbnail: z.union([
    z.string(), // URL from API or empty string
    z
      .any()
      .refine(
        (fileList) => fileList instanceof FileList && fileList.length > 0,
        {
          message: "Profile picture is required",
        }
      ),
  ]),
});

export type CategoryValue = z.infer<typeof CategorySchema>;
