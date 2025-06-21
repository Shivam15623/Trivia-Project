const SuccessErrorMessage = ({
  type,
  message,
  
}: {
  type: "success" | "error";
  message: string | null;
}) => {
  if (!message) return null;

  const styleMap = {
    success: "bg-green-50 border border-green-200 text-green-700",
    error: "bg-red-50 border border-red-200 text-red-600",
  };

  return (
    <div className={`${styleMap[type]} p-3 rounded-md text-sm text-center mb-4`}>
      {message}
    </div>
  );
};

export default SuccessErrorMessage;