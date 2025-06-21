import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import persistStore from "redux-persist/es/persistStore";
import { store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/es/integration/react";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "@/components/ErrorFallBack.tsx";
import type { ErrorInfo } from "react";
import "react-phone-input-2/lib/style.css";

const persistor = persistStore(store);
function logError(error: Error, info: ErrorInfo) {
  console.error("Logged Error:", error);
  console.error("Component Stack:", info.componentStack);

  // Optionally log to external services like Sentry
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ErrorBoundary FallbackComponent={Fallback} onError={logError}>
          <App />
        </ErrorBoundary>
      </PersistGate>
      <Toaster />
    </Provider>
  </StrictMode>
);
