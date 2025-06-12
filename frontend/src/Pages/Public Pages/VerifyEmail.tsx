import { useVerifyEmailMutation } from "@/services";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const LazyVerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // null = loading, true = success, false = failed
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  const verifyUserEmail = async (): Promise<void> => {
    try {
      if (token) {
        const response = await verifyEmail({ token }).unwrap();
        if (response?.statuscode === 200) {
          setIsVerified(true);
          setMessage("Your email has been verified successfully! 🎉");
        }
      }
    } catch (err: any) {
      setIsVerified(false);
      setMessage(
        err?.data?.message ||
          "Verification failed. The token may be expired or invalid."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        {isLoading ? (
          <p className="text-gray-600 text-lg">🔄 Verifying your email...</p>
        ) : isVerified === true ? (
          <>
            <p className="text-green-600 text-lg font-semibold">✅ {message}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </>
        ) : (
          <>
            <p className="text-red-600 text-lg font-semibold">❌ {message}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={verifyUserEmail}
            >
              Retry Verification
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LazyVerifyEmail;
