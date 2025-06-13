import { z } from "zod";
import {
  DateField,
  emailField,
  imageField,
  nameField,
  passwordfield,
  phoneField,
} from ".";

// Schema
export const UserDetailsSchema = z.object({
  firstname: nameField,
  lastname: nameField,
  email: emailField,
  DOB: DateField,
  phoneNo: phoneField,
  profilePic: imageField,
});
// Schema
export const passwordChangeSchema = z
  .object({
    currentpassword: passwordfield,
    newpassword: passwordfield,
    confirmpassword: passwordfield,
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export type passwordChangeValue = z.infer<typeof passwordChangeSchema>;

export type UserDetailsValues = z.infer<typeof UserDetailsSchema>;
