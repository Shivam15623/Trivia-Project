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
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { SignupSchema, SignupValues } from "@/SchemaValidations/AuthSchema";
import { RenderField } from "@/components/renderFields";
import PasswordStrength from "@/components/PasswordStrength";

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
  const password = form.watch("password");

  const handleSubmit = async (data: SignupValues) => {
    try {
      const response = await signup(data).unwrap();
      if (response.success === true) {
        showSuccess(
          "Signup successful. Please check your email to verify your account."
        );
        navigate("/email-verification-sent");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="h-full flex min-h-screen patt  items-center justify-center px-4">
      <Card className="w-full max-w-xl shadow-lg p-0 overflow-hidden rounded-2xl ">
        <CardHeader className="text-center py-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-[#e34b4b]">Sign Up</h2>
          <p className="text-sm text-gray-500">Create your account</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row w-full  gap-4">
                {/* First Name */}
                <div className="w-1/2">
                  <RenderField
                    control={form.control}
                    label="First Name"
                    name="firstname"
                    type="text"
                    labelClass="block text-sm font-medium text-gray-700 mb-1"
                    inputProps={{
                      placeholder: "john",
                      required: true,
                    }}
                  />
                </div>

                {/* Last Name */}
                <div className="w-1/2">
                  {" "}
                  <RenderField
                    control={form.control}
                    label="Last Name"
                    name="lastname"
                    type="text"
                    labelClass="block text-sm font-medium text-gray-700 mb-1"
                    inputProps={{
                      placeholder: "Doe",
                      required: true,
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <RenderField
                control={form.control}
                label="Email"
                name="email"
                type="email"
                className="w-full"
                labelClass="block text-sm font-medium text-gray-700 mb-1"
                inputProps={{
                  placeholder: "you@example.com",
                  required: true,
                }}
              />
              {/* DOB */}
              <RenderField
                control={form.control}
                label="Date of Birth"
                labelClass="block text-sm font-medium text-gray-700 mb-1"
                name="DOB"
                type="date"
                className="w-full"
                inputProps={{
                  required: true,
                }}
              />
              <div className="space-y-2">
                {" "}
                <RenderField
                  control={form.control}
                  label="Password"
                  labelClass="block text-sm font-medium text-gray-700 mb-1"
                  name="password"
                  className="w-full"
                  type="password"
                  inputProps={{
                    placeholder: "••••••••",
                    required: true,
                  }}
                />
                <PasswordStrength password={password} />
              </div>

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </FormLabel>
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
              <div className="pt-4 flex flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Submit
                </Button>
              </div>
              <p className="text-sm text-center text-gray-600">
                Already have an account?
                <a
                  href="/login"
                  className="text-[#e34b4b] hover:underline font-medium"
                >
                  Login
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-[#fff8f0] p-4 text-center  border-t border-orange-100">
          <div className="flex justify-center space-x-4 mx-auto">
            <a href="#" className="text-sm text-gray-500 hover:text-[#e34b4b]">
              Help
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#e34b4b]">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#e34b4b]">
              Terms
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
