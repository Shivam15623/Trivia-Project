import { RouterProvider } from "react-router-dom";
import { useSilentAuthMutation } from "./services";
import { useEffect } from "react";
import router from "./routes";
import "./styles/fonts.css";
import "./styles/animation.css";
import "@/App.css";
import Loader from "./components/Loader";

function App() {
  // Removed unused user selector
  const [silentAuth, { isLoading }] = useSilentAuthMutation();

  useEffect(() => {
    silentAuth();
  }, [silentAuth]);

  if (isLoading) return <Loader />;

  return <RouterProvider router={router} />;
}

export default App;
