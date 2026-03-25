// App.tsx
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./routes";
import "./styles/fonts.css";
import "./styles/animation.css";
import "@/App.css";
import Loader from "./components/Loader";

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
export default App;
