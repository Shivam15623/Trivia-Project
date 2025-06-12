import { RouterProvider } from "react-router-dom";

import { useSilentAuthMutation } from "./services";

import { useEffect } from "react";
import router from "./routes";
import "@/App.css";

function App() {
  // Removed unused user selector
  const [silentAuth, { isLoading }] = useSilentAuthMutation();

  useEffect(() => {
    silentAuth();
  }, [silentAuth]);

  if (isLoading) return <p>Loading...</p>;

  return <RouterProvider router={router} />;
}

export default App;
