import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResentEmailVerificationMutation } from "@/services";
import logError from "@/utills/logError";
import { Mail } from "lucide-react";

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
    <>
      <div className="bg-[#fff6f0] p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff100f] to-[#ffc070] p-6 text-center">
              <div className="bg-white/90 rounded-full w-20 h-20 mx-auto flex items-center justify-center hlogo-animation">
                <Mail className="w-10 h-10 text-[#e34b4b]" />
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-center mb-4 text-[#e34b4b]">
                Verify Your Email
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Enter your email to receive a verification link. This helps us
                ensure the security of your account.
              </p>

              {error && (
                <div
                  id="error-message"
                  className="hidden bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center mb-4"
                >
                  There was an error sending the verification email. Please try
                  again.
                </div>
              )}
              {message && (
                <div
                  id="success-message"
                  className="hidden success-animation bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm text-center mb-4"
                >
                  Verification email sent! Please check your inbox.
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
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
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white font-medium rounded-md hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  <span>
                    {isLoading ? "Sending..." : "Send Verification Email"}
                  </span>
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Already verified?{" "}
                  <a
                    href="#"
                    className="text-[#e34b4b] font-medium hover:underline"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the email? Check your spam folder.
                </p>
                <div className="flex justify-center space-x-2">
                  <a
                    href="#"
                    className="text-sm text-[#e34b4b] font-medium hover:underline"
                  >
                    Contact Support
                  </a>
                  <span className="text-gray-400">|</span>
                  <a
                    href="#"
                    className="text-sm text-[#e34b4b] font-medium hover:underline"
                  >
                    FAQ
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl shadow-sm border border-orange-200 p-5">
            <h3 className="text-lg font-semibold text-[#e34b4b] mb-4">
              What happens next?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-[#e34b4b] rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Check your inbox</p>
                  <p className="text-sm text-gray-500">
                    We'll send a verification link to your email
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#e34b4b] rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Click the verification link
                  </p>
                  <p className="text-sm text-gray-500">
                    Open the email and click the button or link
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#e34b4b] rounded-full w-6 h-6 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-gray-700 font-medium">
                    Access your account
                  </p>
                  <p className="text-sm text-gray-500">
                    Once verified, you'll have full access to all features
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyEmailVerification;
