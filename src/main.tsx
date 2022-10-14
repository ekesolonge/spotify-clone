import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import AppProvider from "./context/AppProvider";
import AuthProvider from "./context/AuthProvider";
import "./index.css";
import Login from "./routes/Login";
import Protected from "./routes/Protected";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Protected />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  </Router>
);
