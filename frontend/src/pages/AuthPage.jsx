import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm.jsx";
import RegisterForm from "@/components/auth/RegisterForm.jsx";

// Authentication page component
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Form Card   Display login or register form based on state*/}
        <div className="p-8">{isLogin ? <LoginForm /> : <RegisterForm />}</div> 

        {/* Toggle Link */}
        <div className="border-t border-gray-200 px-8 py-4 bg-gray-50 text-center">
          {isLogin ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 font-semibold hover:text-blue-600 transition cursor-pointer"
              >
                Register
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 font-semibold hover:text-blue-600 transition cursor-pointer"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
