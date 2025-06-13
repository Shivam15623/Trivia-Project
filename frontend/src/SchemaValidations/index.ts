import { z } from "zod";

export const imageField = z.union([
  z.string(), // for existing image URLs
  z.instanceof(File),
]);
export const nameField = z
  .string()
  .min(2, "Last name is too short")
  .regex(/^[A-Za-z]+$/, "Only use Letters No Numbers");
export const passwordfield = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number");
export const DateField = z.coerce
  .date({ message: "Invalid date format" })
  .max(new Date(), { message: "Date of birth cannot be in the future" })
  .refine(
    (date) => {
      const today = new Date();
      const fiveYearsAgo = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );
      return date <= fiveYearsAgo;
    },
    { message: "You must be at least 5 years old" }
  );
export const phoneField = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must contain only digits");
export const emailField = z
  .string()
  .email("Invalid email address")
  .regex(
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    "Please enter a valid email"
  );
