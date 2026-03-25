// App.tsx
import { RouterProvider } from "react-router-dom";
import { useSilentAuthMutation } from "./services";
import { Suspense, useEffect, useState, useRef } from "react";
import router from "./routes";
import "./styles/fonts.css";
import "./styles/animation.css";
import "@/App.css";
import Loader from "./components/Loader";

// ✅ Module-level flag — survives StrictMode double-invoke, never resets
let silentAuthInitiated = false;

function App() {
  const [silentAuth] = useSilentAuthMutation();
  const [ready, setReady] = useState(false);
  const calledRef = useRef(false); // ✅ Component-level guard for extra safety

  useEffect(() => {
    // ✅ Both guards must pass
    if (silentAuthInitiated || calledRef.current) {
      setReady(true); // already ran or running — don't block UI
      return;
    }

    silentAuthInitiated = true;
    calledRef.current = true;

    silentAuth().finally(() => setReady(true));
  }, []); // ✅ Empty deps — intentionally run once on mount

  if (!ready) return <Loader />;

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
