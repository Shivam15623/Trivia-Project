import { RouterProvider } from "react-router-dom";
import { useSilentAuthMutation } from "./services";
import { Suspense, useEffect, useState } from "react";
import router from "./routes";
import "./styles/fonts.css";
import "./styles/animation.css";
import "@/App.css";
import Loader from "./components/Loader";

function App() {
  const [silentAuth, { isLoading }] = useSilentAuthMutation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    silentAuth().finally(() => setReady(true));
  }, [silentAuth]);

  if (!ready || isLoading) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;