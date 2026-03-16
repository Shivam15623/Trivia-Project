import AuthCardWrapper from "@/components/AuthCardWrapper";
import StepBullet from "@/components/StepBullet";
import { useVerifyEmailMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { GradientButton } from "@/components/GradientButton";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const LazyVerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (token) verifyUserEmail();
  }, [token,]);

  const verifyUserEmail = async (): Promise<void> => {
    try {
      if (token) {
        const response = await verifyEmail(token).unwrap();
        if (response?.statuscode === 200) {
          setIsVerified(true);
          confetti();
        }
      }
    } catch (err) {
      setIsVerified(false);
      handleApiError(err);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {/* Main card */}
        <AuthCardWrapper>
          <div className="w-full p-6 text-center sm:w-[450px]">
            {isLoading ? (
              <>
                <div className="mb-4 flex justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Verifying Your Email
                </h2>
                <p className="mb-6 text-sm text-white/50">
                  Please wait while we verify your email address...
                </p>
                {/* Progress bar */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />
                </div>
              </>
            ) : isVerified === true ? (
              <>
                <div className="mb-4 text-5xl">🎉</div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Email Verified!
                </h2>
                <p className="mb-6 text-sm text-white/50">
                  Your email has been verified. You now have full access to all
                  features.
                </p>
                <GradientButton
                  icon={false}
                  className="mx-auto max-w-[200px] font-outfit"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </GradientButton>
              </>
            ) : (
              <>
                <div className="mb-4 text-5xl">❌</div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Verification Failed
                </h2>
                <p className="mb-6 text-sm text-white/50">
                  We couldn't verify your email. The link may have expired or is
                  invalid.
                </p>
                <GradientButton
                  icon={false}
                  className="mx-auto max-w-[200px] font-outfit"
                  onClick={verifyUserEmail}
                >
                  Retry Verification
                </GradientButton>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 text-center">
            <p className="text-xs text-white/30">
              Having trouble?{" "}
              <span className="cursor-pointer font-medium text-amber-400 hover:text-amber-300">
                Contact support
              </span>
            </p>
          </div>
        </AuthCardWrapper>

        {/* What's Next panel */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h3 className="mb-4 text-base font-semibold text-white/80">
            What's Next?
          </h3>
          <div className="space-y-3">
            <StepBullet
              bullet={1}
              title="Complete your profile"
              description="Add your personal information and preferences"
            />
            <StepBullet
              bullet={2}
              title="Explore categories"
              description="Browse through our collection of trivia categories"
            />
            <StepBullet
              bullet={3}
              title="Create your first quiz"
              description="Start creating your own trivia questions"
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

export default LazyVerifyEmail;
