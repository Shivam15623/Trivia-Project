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
    <div className="bg-[#fff6f0] p-4 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <AuthCardWrapper icon={<Mail className="w-10 h-10 text-[#e34b4b]" />}>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#e34b4b]">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail width={16} height={16} className="text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e34b4b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <Button
                id="send-button"
                onClick={handleResendVerification}
                disabled={isLoading}
                variant={"gradient"}
                className="w-full py-2.5 px-4 "
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
                  className="text-[#e34b4b] font-medium hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder.
              </p>
              <div className="flex justify-center space-x-2">
                <Link
                  to="#"
                  className="text-sm text-[#e34b4b] font-medium hover:underline"
                >
                  Contact Support
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  to="#"
                  className="text-sm text-[#e34b4b] font-medium hover:underline"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </AuthCardWrapper>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-orange-200 p-5">
          <h3 className="text-lg font-semibold text-[#e34b4b] mb-4">
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
