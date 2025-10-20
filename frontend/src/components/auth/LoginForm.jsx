import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/authSchemas.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

//Login Form component
export default function LoginForm() {
  const navigate = useNavigate();
  const { login, refetchUser } = useAuth(); // get login function and refetchUser from context

  // Setting up react hook form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      console.log("Logged In User:", res);

      toast.success("Logged in successfully!");

      await refetchUser(); // Refetch User data after login

      reset(); // Reset form fields
      navigate("/dashboard"); // Navigate to dashboard
    } catch (error) {
      toast.error(error.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center mb-2">Admin Login</h2>

      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter email"
        />
        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          {...register("password")}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition mt-2 cursor-pointer"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
