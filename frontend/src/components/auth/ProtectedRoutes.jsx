import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useEffect } from "react";

// Protected Routes component to guard routes that require authentication
export function ProtectedRoutes({ children }) {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please Login to Continue");
    }
  }, [currentUser, loading]);

  // SHow loading indicator while auth status is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  // if no user redirect to login
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children ? children : <Outlet />;
}
