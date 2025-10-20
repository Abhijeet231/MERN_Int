import { createAgentSchema } from "@/validation/agentSchemas.js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const CreateAgentForm = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createAgentSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/agents", data);
      if (!res?.data?.data?.agentData) throw new Error("Error while creating agent");

      toast.success("Agent created successfully!");
      await refetchUser();
      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error while creating new agent");
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Create New Agent
        </h2>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Agent Name"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Agent Email"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="text"
            {...register("mobile")}
            placeholder="+91 1234567890"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.mobile && (
            <p className="text-red-600 text-xs mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter password"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
};

export default CreateAgentForm;
