import { useRegisterCustomerMutation } from "@/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { SignupSchema, SignupValues } from "@/SchemaValidations/AuthSchema";
import { RenderField } from "@/components/FormRender/renderFields";
import PasswordStrength from "@/components/PasswordStrength";
import { Loader2 } from "lucide-react";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import { GradientButton } from "@/components/GradientButton";

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

  const [signup, { isLoading }] = useRegisterCustomerMutation();
  const navigate = useNavigate();
  const password = form.watch("password");

  const handleSubmit = async (data: SignupValues) => {
    try {
      const response = await signup(data).unwrap();

      if (response.success === true) {
        showSuccess(
          "Signup successful. Please check your email to verify your account.",
        );
        navigate("/email-verification-sent");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4">
      <AuthCardWrapper>
        <div className="relative w-full p-6 sm:w-[450px]">
          {/* Loader */}
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-[#e34b4b]" />
            </div>
          )}

          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Create Account
          </h2>

          <p className="mb-6 text-center text-sm text-white/50">
            Sign up to get started
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* First + Last Name */}
              <div className="flex gap-3">
                <RenderField
                  control={form.control}
                  label="First Name"
                  name="firstname"
                  type="text"
                  labelClass="text-[#ffffffb3]"
                  className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
                  inputProps={{
                    placeholder: "John",
                    required: true,
                  }}
                />

                <RenderField
                  control={form.control}
                  label="Last Name"
                  name="lastname"
                  type="text"
                  labelClass="text-[#ffffffb3]"
                  className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
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
                labelClass="text-[#ffffffb3]"
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
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
                labelClass="text-[#ffffffb3]"
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] focus:outline-none"
                inputProps={{
                  required: true,
                }}
              />

              {/* Password */}
              <div>
                <RenderField
                  control={form.control}
                  label="Password"
                  name="password"
                  type="password"
                  labelClass="text-[#ffffffb3]"
                  className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
                  inputProps={{
                    placeholder: "••••••••",
                    required: true,
                  }}
                />

                <PasswordStrength password={password} />
              </div>

              {/* Phone */}
              <RenderField
                control={form.control}
                label="Phone No"
                name="phoneNo"
                type="phone"
                labelClass="text-[#ffffffb3]"
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] focus:outline-none"
                inputProps={{
                  required: true,
                }}
              />

              <GradientButton
                type="submit"
                disabled={isLoading}
                icon={false}
                className="w-full max-w-none font-outfit"
              >
                Sign Up
              </GradientButton>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 text-center">
          <p className="text-sm text-white/50">
            Already have an account?
            <Link
              to="/login"
              className="font-medium text-amber-400 hover:text-amber-300"
            >
              Login
            </Link>
          </p>
        </div>
      </AuthCardWrapper>

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[21%] lg:w-[48.39%]" />

        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[18%] lg:w-[40.81%]" />
      </div>
    </div>
  );
};

export default Signup;
