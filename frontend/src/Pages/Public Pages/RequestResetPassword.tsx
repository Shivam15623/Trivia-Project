import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordRequestMutation } from "@/services";
import logError from "@/utills/logError";

const RequestResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordRequestMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async () => {
    setError(null);
    setMessage(null);

    try {
      console.log("Requesting password reset for:", email);
      const response = await resetPassword({ email }).unwrap();
      if (response?.statuscode === 200) {
        setMessage("Reset link sent! Check your email.");
      }
    } catch (err) {
      logError(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Enter your email, and we'll send you a password reset link.
        </p>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && (
          <p className="text-green-500 text-sm text-center">{message}</p>
        )}

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            className="w-full mt-2"
            onClick={handleRequestReset}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPassword;
