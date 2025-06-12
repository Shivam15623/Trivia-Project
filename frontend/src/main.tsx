import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import persistStore from "redux-persist/es/persistStore";
import { store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/es/integration/react";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner.tsx";
import "react-phone-input-2/lib/style.css";
import { initializeSocket } from "./utills/Socket.ts";
const persistor = persistStore(store);
initializeSocket();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
      <Toaster />
    </Provider>
  </StrictMode>
);
