export default function Loader() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-6 bg-gray-900">
      {/* Spinning Loader */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>

      {/* Loading Text */}
      <p className="animate-pulse text-lg font-semibold text-gray-300">
        Loading...
      </p>
    </div>
  );
}
