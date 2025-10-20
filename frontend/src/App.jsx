import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "@/pages/AuthPage.jsx";
import AdminPage from "@/pages/AdminPage.jsx";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoutes } from "@/components/auth/ProtectedRoutes.jsx";
import { Error } from "@/pages/Error.jsx";
import AgentDetail from "./components/agents/AgentDetail";
import CreateAgentForm from "./components/agents/CreateAgentForm";

const App = () => {
  return (
    <div>
      {/* // Defining application routes */}

      <Routes>
        {/* // Redirecting root to auth page */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Public Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Route */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<AdminPage />} />
          <Route path="/dashboard/create-agent" element={<CreateAgentForm />} />
          <Route path="dashboard/agents/:id" element={<AgentDetail />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<Error />} />
      </Routes>

      {/* // Toast container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        transition={Zoom}
      />
    </div>
  );
};

export default App;
