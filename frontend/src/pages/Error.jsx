import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Error page component
export const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-3">
        Something went wrong!
      </h1>
      <p className="text-gray-600">Redirecting you to login...</p>
    </div>
  );
};
