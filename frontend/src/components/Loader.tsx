export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-gray-100 dark:bg-gray-900">
      {/* Spinning Loader */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
