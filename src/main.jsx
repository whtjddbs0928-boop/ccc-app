import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    // 업데이트 있으면 바로 새로고침
    window.location.reload();
  },
  onOfflineReady() {
    // 오프라인 준비됨 (필요하면 토스트 띄워도 됨)
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);