import { z } from "zod";
import { DateField, emailField, nameField, passwordfield, phoneField } from ".";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordfield,
});

export const SignupSchema = z.object({
  firstname: nameField,
  lastname: nameField,
  email:emailField,
  DOB:DateField,
  password: passwordfield,
  phoneNo:phoneField,
});

export const ForgotPasswordChangeSchema = z
  .object({
    newpassword: passwordfield,
    confirmpassword: passwordfield,
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords do not match",
  });

export type SignupValues = z.infer<typeof SignupSchema>;
export type LoginValues = z.infer<typeof LoginSchema>;
export type ForgotPasswordValues = z.infer<typeof ForgotPasswordChangeSchema>;
