import { z } from "zod";

// Schema
export const UserDetailsSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name is too short")
    .regex(/^[A-Za-z]+$/, "Only use Letters No Numbers"),
  lastname: z
    .string()
    .min(2, "Last name is too short")
    .regex(/^[A-Za-z]+$/, "Only use Letters No Numbers"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ),
  DOB: z.coerce
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
    ),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{7,14}$/, "Phone number must contain only digits"),
  profilePic: z.union([
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
// Schema
export const passwordChangeSchema = z
  .object({
    currentpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    newpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmpassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export type passwordChangeValue = z.infer<typeof passwordChangeSchema>;

export type UserDetailsValues = z.infer<typeof UserDetailsSchema>;