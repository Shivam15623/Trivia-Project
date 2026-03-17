import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResentEmailVerificationMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { Mail } from "lucide-react";
import StepBullet from "@/components/StepBullet";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import { Label } from "@/components/ui/label";
import SuccessErrorMessage from "@/components/SuccessErrorMessage";
import { Link } from "react-router-dom";

const ApplyEmailVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resendVerification, { isLoading }] =
    useResentEmailVerificationMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setError(null);
    setMessage(null);

    try {
      const response = await resendVerification(email).unwrap();
      if (response?.success) {
        setMessage("Verification email sent! Please check your inbox.");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff6f0] p-4">
      <div className="w-full max-w-md">
        <AuthCardWrapper>
          <div className="p-6">
            <h2 className="mb-4 text-center text-2xl font-semibold text-[#e34b4b]">
              Verify Your Email
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600">
              Enter your email to receive a verification link. This helps us
              ensure the security of your account.
            </p>

            {error && (
              <SuccessErrorMessage
                message="There was an error sending the verification email. Please try
                again."
                type="error"
              />
            )}
            {message && (
              <SuccessErrorMessage
                message="Verification email sent! Please check your inbox."
                type="success"
              />
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail width={16} height={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 transition-all focus:border-transparent focus:outline-none "
                  />
                </div>
              </div>

              <Button
                id="send-button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="w-full px-4 py-2.5"
              >
                <span>
                  {isLoading ? "Sending..." : "Send Verification Email"}
                </span>
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#e34b4b] hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <div className="border-t border-orange-100 bg-[#fff8f0] p-4 text-center">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder.
              </p>
              <div className="flex justify-center space-x-2">
                <Link
                  to="#"
                  className="text-sm font-medium text-[#e34b4b] hover:underline"
                >
                  Contact Support
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="#"
                  className="text-sm font-medium text-[#e34b4b] hover:underline"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </AuthCardWrapper>

        <div className="mt-8 rounded-xl border border-orange-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#e34b4b]">
            What happens next?
          </h3>

          <div className="space-y-4">
            <StepBullet
              title="Check your inbox"
              bullet={1}
              description="We'll send a verification link to your email"
            />
            <StepBullet
              title="Click the verification link"
              bullet={2}
              description="Open the email and click the button or link"
            />
            <StepBullet
              title="Access your account"
              bullet={3}
              description="Once verified, you'll have full access to all features"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyEmailVerification;
