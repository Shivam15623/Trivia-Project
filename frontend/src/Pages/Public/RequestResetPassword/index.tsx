import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordRequestMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { Mail } from "lucide-react";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import { Link } from "react-router-dom";

const RequestResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordRequestMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async () => {
    setError(null);
    setMessage(null);

    try {
      const response = await resetPassword(email).unwrap();

      if (response?.statuscode === 200) {
        setMessage("Reset link sent! Check your email.");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex items-center patt justify-center min-h-screen ">
      <AuthCardWrapper icon={<Mail className="w-10 h-10 text-[#e34b4b]" />}>
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-2 text-[#e34b4b]">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email, and we'll send you a password reset link.
          </p>

          {error && (
            <p
              className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm text-center mb-4
          "
            >
              {error}
            </p>
          )}
          {message && (
            <p className=" success-message bg-green-50 border border-green-200 text-green-600 p-3 rounded-md text-sm text-center mb-4">
              {message}
            </p>
          )}
          <div className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 " />
                </div>
                <Input
                  type="email"
                  id="email"
                  name="email" variant="solidred"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e34b4b] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500">
                We'll send a link to reset your password to this email address.
              </p>
            </div>

            <Button
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
              onClick={handleRequestReset}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </div>
        <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-[#e34b4b] hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </AuthCardWrapper>
    </div>
  );
};

export default RequestResetPassword;
