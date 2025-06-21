import AuthCardWrapper from "@/components/AuthCardWrapper";
import StepBullet from "@/components/StepBullet";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const LazyVerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // null = loading, true = success, false = failed

  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token, verifyEmail]);

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
    <>
      <div className="bg-[#fff6f0] p-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md relative">
          <AuthCardWrapper
            icon={
              isLoading ? (
                <svg
                  className="loading-spinner text-[#e34b4b] animate-spin"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : isVerified === true ? (
                <svg
                  className="checkmark text-green-500"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
              ) : (
                <svg
                  className="text-[#e34b4b]"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )
            }
          >
            {" "}
            <div className="p-6 text-center">
              {isLoading ? (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Verifying Your Email
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Please wait while we verify your email address...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] h-2.5 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </>
              ) : isVerified === true ? (
                <>
                  <h2 className="text-2xl font-semibold text-green-600 mb-4">
                    Email Verified Successfully! 🎉
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your email has been verified. You now have full access to
                    all features.
                  </p>
                  <Button
                    id="login-button"
                    onClick={() => navigate("/login")}
                    variant="gradient"
                    className="px-6 py-2.5 "
                  >
                    Go to Login
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-[#e34b4b] mb-4">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We couldn't verify your email. The verification link may
                    have expired or is invalid.
                  </p>
                  <Button
                    id="retry-button"
                    onClick={verifyUserEmail}
                    className="px-6 py-2.5 bg-[#e34b4b] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                  >
                    Retry Verification
                  </Button>
                </>
              )}
            </div>
          </AuthCardWrapper>

          <div className="mt-6 bg-white rounded-xl shadow-sm border border-orange-200 p-5">
            <h3 className="text-lg font-semibold text-[#e34b4b] mb-4">
              What's Next?
            </h3>

            <div className="space-y-4">
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
      </div>
    </>
  );
};

export default LazyVerifyEmail;
