import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { showSuccess } from "@/components/toastUtills";
import { useForGotPassWordMutation } from "@/services";
import {
  ForgotPasswordChangeSchema,
  ForgotPasswordValues,
} from "@/SchemaValidations/AuthSchema";
import { RenderField } from "@/components/renderFields";
import logError from "@/utills/logError";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForGotPassWordMutation();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(ForgotPasswordChangeSchema),
    defaultValues: {
      newpassword: "",
      confirmpassword: "",
    },
  });

  const resetPassword = async (values: ForgotPasswordValues) => {
    try {
      if (token) {
        const response = await forgotPassword({
          token,
          newpassword: values.newpassword,
        }).unwrap();
        if (response?.statuscode === 200) {
          showSuccess(response.message);
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    } catch (err: unknown) {
      logError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(resetPassword)}>
            <div className="space-y-4">
              <RenderField
                control={form.control}
                label="New Password"
                name="newpassword"
                className="w-full"
                type="password"
                inputProps={{
                  placeholder: "••••••••",
                  required: true,
                }}
              />
              <RenderField
                control={form.control}
                label="Confirm Password"
                name="confirmpassword"
                className="w-full"
                type="password"
                inputProps={{
                  placeholder: "••••••••",
                  required: true,
                }}
              />

              <Button
                className="w-full mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
