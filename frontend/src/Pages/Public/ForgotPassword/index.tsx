import { Button } from "@/components/ui/button";
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
import { LoaderCircle, Lock, Shield, Verified } from "lucide-react";
import PasswordStrength from "@/components/PasswordStrength";
import PasswordRequirementSection from "@/components/PasswordRequirementSection";
import StepBullet from "@/components/StepBullet";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import SuccessErrorMessage from "@/components/SuccessErrorMessage";

const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");

  const navigate = useNavigate();

  const [forgotPassword, { error, isLoading }] = useForGotPassWordMutation();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordChangeSchema),
    defaultValues: {
      newpassword: "",
      confirmpassword: "",
    },
  });

  const password = form.watch("newpassword");

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
    <>
      <div className="bg-[#fff6f0] p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <AuthCardWrapper icon={<Lock className="w-10 h-10 text-[#e34b4b]" />}>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-center mb-2 text-[#e34b4b]">
                Reset Password
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Create a new password for your account
              </p>
              {error && (
                <SuccessErrorMessage
                  type="error"
                  message={"Something Went Wrong"}
                />
              )}

              <Form {...form}>
                <form
                  id="reset-form"
                  className="space-y-5"
                  onSubmit={form.handleSubmit(resetPassword)}
                >
                  <div className="space-y-2">
                    <RenderField
                      Inputvariant="solidred"
                      control={form.control}
                      label="New Password"
                      name="newpassword"
                      labelClass="block text-sm font-medium text-gray-700"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e34b4b] focus:border-transparent transition-all pr-10"
                      type="password"
                      inputProps={{
                        placeholder: "••••••••",
                        required: true,
                      }}
                    />

                    <PasswordStrength password={password} />

                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters and include
                      uppercase, lowercase, number and special character.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <RenderField
                      Inputvariant="solidred"
                      control={form.control}
                      label="Confirm Password"
                      name="confirmpassword"
                      labelClass="block text-sm font-medium text-gray-700"
                      className="w-full"
                      type="password"
                      inputProps={{
                        placeholder: "••••••••",
                        required: true,
                      }}
                    />

                    <p
                      id="match-message"
                      className="text-xs text-gray-500 hidden"
                    >
                      Passwords must match
                    </p>
                  </div>

                  <PasswordRequirementSection password={password} />

                  <Button
                    id="reset-button"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-[#e34b4b] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </AuthCardWrapper>

          <div className="mt-6 bg-white rounded-xl shadow-sm border border-orange-200 p-5">
            <h3 className="text-lg font-semibold text-[#e34b4b] mb-4">
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
      </div>{" "}
    </>
  );
};

export default ForgotPassword;
