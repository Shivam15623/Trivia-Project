import * as yup from "yup";

export const updateProfileSchema = yup.object({
  firstname: yup
    .string()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .required("First name is required"),
  lastname: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phoneNo: yup
    .string()
    .matches(
      /^\+?[1-9]\d{7,14}$/,
      "Please enter a valid international phone number"
    )
    .required("Phone number is required"),
  DOB: yup
    .date()
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 4)),
      "User must be at least 4 years old and DOB cannot be in the future"
    )
    .required("Date of birth is required"),
});

export const updatePasswordSchema = yup.object({
  currentpassword: yup.string().required("Current password is required"),

  newpassword: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/,
      "New password must include at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("New password is required"),

  confirmpassword: yup
    .string()
    .oneOf([yup.ref("newpassword")], "Confirm password must match new password")
    .required("Confirm password is required"),
});
