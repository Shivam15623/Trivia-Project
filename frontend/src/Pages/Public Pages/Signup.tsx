import { useRegisterCustomerMutation } from "@/services";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import logError from "@/utills/logError";
import { showSuccess } from "@/components/toastUtills";
import { SignupSchema, SignupValues } from "@/SchemaValidations/AuthSchema";
import { RenderField } from "@/components/renderFields";

const Signup = () => {
  const form = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      DOB: undefined,
      password: "",
      phoneNo: "",
    },
  });

  const [signup] = useRegisterCustomerMutation();
  const navigate = useNavigate();

  const handleSubmit = async (data: SignupValues) => {
    try {
      const response = await signup(data).unwrap();
      if (response.success === true) {
        showSuccess(response.message);
        navigate("/login");
      }
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="h-full flex min-h-screen patt items-center justify-center px-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <CardHeader className="text-center py-6">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-500">Create your account</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* First Name */}
                <RenderField
                  control={form.control}
                  label="First Name"
                  name="firstname"
                  type="text"
                  inputProps={{
                    placeholder: "john",
                    required: true,
                  }}
                />

                {/* Last Name */}
                <RenderField
                  control={form.control}
                  label="Last Name"
                  name="lastname"
                  type="text"
                  inputProps={{
                    placeholder: "Doe",
                    required: true,
                  }}
                />
              </div>

              {/* Email */}
              <RenderField
                control={form.control}
                label="Email"
                name="email"
                type="email"
                inputProps={{
                  placeholder: "you@example.com",
                  required: true,
                }}
              />
              {/* DOB */}
              <RenderField
                control={form.control}
                label="Date of Birth"
                name="DOB"
                type="date"
                inputProps={{
                  required: true,
                }}
              />
              <RenderField
                control={form.control}
                label="Password"
                name="password"
                className="w-full"
                type="password"
                inputProps={{
                  placeholder: "••••••••",
                  required: true,
                }}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        country="in"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        inputStyle={{
                          width: "100%",
                          height: "38px",
                          borderRadius: "0.375rem",
                          border: form.formState.errors.phoneNo
                            ? "1px solid #ef4444" // red-500
                            : "1px solid #d1d5db", // gray-300
                          paddingLeft: "50px",
                        }}
                        buttonStyle={{
                          borderTopLeftRadius: "0.375rem",
                          borderBottomLeftRadius: "0.375rem",
                          border: "1px solid #d1d5db",
                        }}
                        dropdownStyle={{
                          zIndex: 10000,
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="pt-4 flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  Submit
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Login
                  </a>
                </p>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
