import { Form } from "@/components/ui/form";
import { showSuccess } from "@/components/toastUtills";
import { useForGotPassWordMutation } from "@/services";
import {
  ForgotPasswordChangeSchema,
  ForgotPasswordValues,
} from "@/SchemaValidations/AuthSchema";
import { RenderField } from "@/components/FormRender/renderFields";
import { handleApiError } from "@/utills/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {  Lock, Shield, Verified } from "lucide-react";

import StepBullet from "@/components/StepBullet";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import SuccessErrorMessage from "@/components/SuccessErrorMessage";
import { GradientButton } from "@/components/GradientButton";
import { ThemeLoader } from "@/components/ThemeLoader";

const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const navigate = useNavigate();

  const [forgotPassword, { error, isLoading }] = useForGotPassWordMutation();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordChangeSchema),
    defaultValues: { newpassword: "", confirmpassword: "" },
  });

  const resetPassword = async (values: ForgotPasswordValues) => {
    try {
      if (token) {
        const response = await forgotPassword({
          token,
          newpassword: values.newpassword,
        }).unwrap();
        if (response?.statuscode === 200) {
          showSuccess("Password reset successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    } catch (err: unknown) {
      handleApiError(err);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {/* Main card */}
        <AuthCardWrapper>
          <div className="relative w-full">
            {isLoading && (
              <div
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-[inherit]"
                style={{
                  background: "#00000059",
                }}
              >
                <ThemeLoader />
                <span className="theme-shimmer-text text-xs tracking-widest">
                  Signing in...
                </span>
              </div>
            )}
            <div className="relative w-full p-6">
              <h2 className="mb-2 text-center text-2xl font-bold text-white">
                Reset Password
              </h2>
              <p className="mb-6 text-center text-sm text-white/50">
                Create a new password for your account
              </p>

              {error && (
                <SuccessErrorMessage
                  type="error"
                  message="Something went wrong"
                />
              )}

              <Form {...form}>
                <form
                  className="space-y-5"
                  onSubmit={form.handleSubmit(resetPassword)}
                >
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <RenderField
                      control={form.control}
                      label="New Password"
                      name="newpassword"
                      type="password"
                      labelClass="text-[#ffffffb3]"
                      className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
                      inputProps={{ placeholder: "••••••••", required: true }}
                    />

                    <p className="pl-2 text-xs text-white/30">
                      At least 8 characters with uppercase, lowercase, number
                      and special character.
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <RenderField
                      control={form.control}
                      label="Confirm Password"
                      name="confirmpassword"
                      type="password"
                      labelClass="text-[#ffffffb3]"
                      className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
                      inputProps={{ placeholder: "••••••••", required: true }}
                    />
                  </div>

                  {/* <PasswordRequirementSection password={password} /> */}

                  <GradientButton
                    type="submit"
                    disabled={isLoading}
                    icon={false}
                    className="w-full max-w-none font-outfit"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </GradientButton>
                </form>
              </Form>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-4 text-center">
              <p className="text-sm text-white/50">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-amber-400 hover:text-amber-300"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </AuthCardWrapper>

        {/* Security tips — styled as a dark glass panel */}
        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-white/80">
            Password Security Tips
          </h3>
          <div className="space-y-3">
            <StepBullet
              bullet={Shield}
              title="Use unique passwords"
              description="Don't reuse passwords across different websites"
            />
            <StepBullet
              bullet={Lock}
              title="Consider a password manager"
              description="Use a tool to generate and store strong passwords"
            />
            <StepBullet
              bullet={Verified}
              title="Enable two-factor authentication"
              description="Add an extra layer of security to your account"
            />
          </div>
        </div>
      </div>

      {/* Background Glow — same as Signup */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[21%] lg:w-[48.39%]" />
        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[18%] lg:w-[40.81%]" />
      </div>
    </div>
  );
};

export default ForgotPassword;
