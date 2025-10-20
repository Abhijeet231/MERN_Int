import { registerSchema } from "@/validation/authSchemas.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

// Register form component
export default function RegisterForm() {
  const navigate = useNavigate();
  const { login, refetchUser } = useAuth();

  // React hook form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/users/register", data); // calling register api endpoint

      if (!res?.data?.data?.createdUser) throw new Error("Registration failed");

      toast.success(" Registered successfully!");

      //Auto login using email and pass
      const loginData = {
        email: data.email,
        password: data.password,
      };

      await login(loginData); // triggers AuthContext login
      await refetchUser(); // fetch updated user info

      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
      console.error("Registration error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center mb-2">Register</h2>

      {/* Name Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name")}
          placeholder="Enter your name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
          placeholder="Enter password"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.password && (
          <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition mt-2 cursor-pointer"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
