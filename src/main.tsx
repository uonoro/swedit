import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

// src/main.tsx
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Quill Styles hinzufügen
import "quill/dist/quill.snow.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
