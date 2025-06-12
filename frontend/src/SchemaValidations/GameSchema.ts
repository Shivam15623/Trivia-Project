import { z } from "zod";

export const createGameSchema = z.object({
  gameTitle: z.string().min(1, "Title is required"),
  selectedCategories: z
    .array(z.string())
    .length(6, "You must select exactly 6 categories"),
});
export type CreateGameValue = z.infer<typeof createGameSchema>;


