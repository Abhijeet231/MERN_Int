import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/utils/api";

// AgentDetails component
const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [showPass, setShowPass] = useState(false); // toggle state for password

  // Fetch agent details when component mounts or when `id` changes
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await api.get(`/agents/${id}`); // APi call to fetch agent by Id
        setAgent(res.data.data.agent);
      } catch (err) {
        console.error("Error fetching agent:", err);
      }
    };
    fetchAgent();
  }, [id]);

  //Loading state
  if (!agent)
    return <p className="text-center mt-10 text-gray-500">Loading agent...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      {/* 🧾 Agent Card */}
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {agent.name}
        </h2>

        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <span className="font-semibold">Email:</span> {agent.email}
          </p>
          <p>
            <span className="font-semibold">Mobile:</span> {agent.mobile}
          </p>
          <p>
            <span className="font-semibold">Total Tasks:</span>{" "}
            {agent.assignedTask?.length || 0}
          </p>
        </div>

        {/* //Password section */}
        <div className="mt-3">
          <span className="font-semibold">Password:</span>{" "}
          <span className="ml-2">{showPass ? agent.password : "••••••••"}</span>
          <button
            onClick={() => setShowPass((prev) => !prev)}
            className="ml-3 text-blue-600 text-sm hover:underline focus:outline-none"
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {/* Assigned Tasks Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Assigned Tasks
          </h3>

          {agent.assignedTask && agent.assignedTask.length > 0 ? (
            <ul className="space-y-3">
              {agent.assignedTask.map((task, index) => (
                <li
                  key={task._id}
                  className="bg-gray-100 rounded-2xl p-4 text-gray-700 text-sm shadow-sm hover:bg-gray-200 transition-all border border-gray-200"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Task {index + 1}
                  </h4>

                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">First Name:</span>{" "}
                      {task.firstName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {task.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Notes:</span>{" "}
                      {task.notes || "No notes provided"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm italic">
              No assigned tasks yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
