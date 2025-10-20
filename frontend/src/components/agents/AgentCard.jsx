import { useEffect, useState } from "react";
import { api } from "@/utils/api";


const AgentCard = ({ data }) => {
  // data comes from AdminPage { _id, name, email, mobile }
  const [agent, setAgent] = useState(data);


  useEffect(() => {
    // if no data passed (edge case), fetch from API
    if (!data?._id) return;
    const fetchAgent = async () => {
      try {
        const res = await api.get(`/agents/${data._id}`);
        setAgent(res.data?.data?.agent);
        
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    };
    fetchAgent();
    
  }, [data?._id]);

  if (!agent) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all w-56 p-4 text-center">
      <div className="flex flex-col items-center gap-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-lg">
          {data.name?.charAt(0).toUpperCase() || "A"}
        </div>
        {/* Agent Name */}
        <h3 className="text-base font-semibold text-gray-800">
          {data.name || "Unnamed"}
        </h3>
        {/* Tasks Info */}
        <p className="text-sm text-gray-600">
          {data.assignedTask && data.assignedTask.length > 0
            ? `${data.assignedTask.length} Task${
                data.assignedTask.length > 1 ? "s" : ""
              } Assigned`
            : "No tasks assigned yet"}
        </p>

        {/* View Details Button */}
        <button className="mt-3 text-blue-600 border border-blue-500 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
