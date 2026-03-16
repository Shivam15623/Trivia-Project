const SuccessErrorMessage = ({
  type,
  message,
}: {
  type: "success" | "error";
  message: string | null;
}) => {
  if (!message) return null;

  const styleMap = {
    success: "bg-green-500/10 border border-green-500/20 text-green-400",
    error: "bg-red-500/10 border border-red-500/20 text-red-400",
  };

  return (
    <div
      className={`${styleMap[type]} mb-4 rounded-2xl p-3 text-center text-sm`}
    >
      {message}
    </div>
  );
};

export default SuccessErrorMessage;
