import { z } from "zod";
import { imageField } from ".";

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Name is required"),
  thumbnail: imageField,
});

export type CategoryValue = z.infer<typeof CategorySchema>;
