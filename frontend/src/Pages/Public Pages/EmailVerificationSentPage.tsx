import AuthCardWrapper from "@/components/AuthCardWrapper";
import StepBullet from "@/components/StepBullet";
import { Button } from "@/components/ui/button";
import { MailCheck, Repeat2, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailVerificationSentPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#fff6f0] p-4 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <AuthCardWrapper
          icon={<MailCheck className="w-10 h-10 text-[#e34b4b]" />}
        >
          {" "}
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-[#e34b4b] mb-2">
              Verification Email Sent!
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to verify your account.
            </p>

            <div className="bg-[#fff0e5] rounded-lg p-4 mb-6 border border-orange-100">
              <p className="text-gray-700 font-medium">john.doe@example.com</p>
            </div>

            <div className="space-y-4 mb-6 text-left">
              <StepBullet
                bullet={1}
                title="Check your email inbox (and spam/junk folder if you don't see it)"
              />
              <StepBullet
                bullet={2}
                title="Click the verification link in the email"
              />
              <StepBullet
                bullet={3}
                title="Once verified, you'll be able to access all features"
              />
            </div>

            <div className="border-t border-orange-100 pt-6">
              <p className="text-gray-600 mb-4">Didn't receive the email?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate("/resent-email")}
                  variant="default"
                  className="bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white"
                >
                  <Repeat2 className="w-4 h-4 mr-2" />
                  Resend Email
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <a
                href="#"
                className="text-[#e34b4b] font-medium hover:underline inline-flex items-center gap-1"
              >
                <LifeBuoy className="w-4 h-4" />
                Contact Support
              </a>
            </p>
          </div>
        </AuthCardWrapper>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Return to{" "}
            <a
              href="/login"
              className="text-[#e34b4b] font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSentPage;
