import { useState } from "react";
import { useResetPasswordRequestMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { Mail } from "lucide-react";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import { GradientButton } from "@/components/GradientButton";
import { Link } from "react-router-dom";
import { ThemeLoader } from "@/components/ThemeLoader";

const RequestResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordRequestMutation();
  const [message, setMessage] = useState<string | null>(null);

  const handleRequestReset = async () => {
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
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4">
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
          <div className="relative w-full p-6 sm:w-[450px]">
            {/* Loader overlay */}

            <h2 className="mb-2 text-center text-2xl font-bold text-white">
              Forgot Password?
            </h2>
            <p className="mb-6 text-center text-sm text-white/50">
              Enter your email and we'll send you a reset link.
            </p>

            {/* Success message */}
            {message && (
              <p className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400">
                {message}
              </p>
            )}

            <div className="space-y-6">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="text-sm text-[#ffffffb3]">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] pl-10 pr-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none"
                  />
                </div>
                <p className="pl-2 text-xs text-white/30">
                  We'll send a reset link to this email address.
                </p>
              </div>

              <GradientButton
                icon={false}
                disabled={isLoading}
                className="w-full max-w-none font-outfit"
                onClick={handleRequestReset}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </GradientButton>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 text-center">
            <p className="text-sm text-white/50">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-amber-400 hover:text-amber-300"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </AuthCardWrapper>

      {/* Background Glow — same as Signup */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[21%] lg:w-[48.39%]" />
        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[18%] lg:w-[40.81%]" />
      </div>
    </div>
  );
};

export default RequestResetPassword;
