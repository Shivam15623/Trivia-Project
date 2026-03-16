import AuthCardWrapper from "@/components/AuthCardWrapper";
import StepBullet from "@/components/StepBullet";
import { GradientButton } from "@/components/GradientButton";
import { LifeBuoy, MailCheck, Repeat2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EmailVerificationSentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {/* Main card */}
        <AuthCardWrapper>
          <div className="w-full p-6 text-center sm:w-[450px]">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <MailCheck className="h-8 w-8 text-amber-400" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-white">
              Verification Email Sent!
            </h1>
            <p className="mb-6 text-sm text-white/50">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>

            {/* Email display pill */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm font-medium text-white/80">
                john.doe@example.com
              </p>
            </div>

            {/* Steps */}
            <div className="mb-6 space-y-3 text-left">
              <StepBullet
                bullet={1}
                title="Check your email inbox"
                description="Also check your spam or junk folder if you don't see it"
              />
              <StepBullet
                bullet={2}
                title="Click the verification link"
                description="Open the email and click the button or link inside"
              />
              <StepBullet
                bullet={3}
                title="Access your account"
                description="Once verified, you'll have full access to all features"
              />
            </div>

            {/* Resend section */}
            <div className="border-t border-white/10 pt-6">
              <p className="mb-4 text-sm text-white/40">
                Didn't receive the email?
              </p>
              <GradientButton
                icon={false}
                className="mx-auto max-w-[220px] font-outfit"
                onClick={() => navigate("/resent-email")}
              >
                <Repeat2 className="mr-2 h-4 w-4" />
                Resend Email
              </GradientButton>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 p-4 text-center">
            <p className="text-sm text-white/40">
              Need help?{" "}
              <Link
                to="#"
                className="inline-flex items-center gap-1 font-medium text-amber-400 hover:text-amber-300"
              >
                <LifeBuoy className="h-3.5 w-3.5" />
                Contact Support
              </Link>
            </p>
          </div>
        </AuthCardWrapper>

        {/* Return to login */}
        <p className="text-center text-sm text-white/40">
          Return to{" "}
          <Link
            to="/login"
            className="font-medium text-amber-400 hover:text-amber-300"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Background Glow — same as Signup */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[21%] lg:w-[48.39%]" />
        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[18%] lg:w-[40.81%]" />
      </div>
    </div>
  );
};

export default EmailVerificationSentPage;
