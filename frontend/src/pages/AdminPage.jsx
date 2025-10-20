import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import AgentCard from "@/components/agents/AgentCard";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

// Admin page component
const AdminPage = () => {
  const { currentUser, logout, refetchUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false); // Tracks upload state for the Ui
  const navigate = useNavigate();

  //Handling user deletion
  const handleDelete = async () => {
    if (
      !window.confirm("You are about to loose all Information realted to USer")
    )
      return;

    try {
      await api.delete("/users/me");
      toast.success("Account Deleted");
      navigate("/auth");
      //update the current user info here if needed
    } catch (error) {
      console.log(error);
      toast.error("Failed to Delete Account");
    }
  };

  //Handle file change
  const handleFileChange = async (e) => {
    const uploadFile = e.target.files[0];
    if (!uploadFile) return;

    //Checking if user has created any agents or not
    if (!currentUser.agents || currentUser.agents.length < 1) {
      toast.error("No agents detected. Plese create agents first");
      return;
    }

    //Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(uploadFile.type)) {
      toast.error(" Only CSV, XLSX, or XLS files are allowed.");
      return;
    }

    //Prepare file for uplaod using FormData
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setIsUploading(true);
      const res = await api.post("/distlist/upload", formData, {
        headers: { "content-Type": "multipart/form-data" }, // Setting up headers for file upload
      });

      toast.success("File Uploaded successfully");

      //Refetching the user details for updated info
      await refetchUser();

      console.log("uploaded Responesee", res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header*/}

      <div className="w-full max-w-md flex flex-col items-center mb-10 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          ADMIN DASHBOARD
        </h1>

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-md p-5 w-full flex flex-col items-center space-y-2">
          <p className="text-gray-600 text-sm">
            User: <span className="font-medium">{currentUser.name}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Agents Created:{" "}
            <span className="font-semibold">{currentUser.agents.length}</span>
          </p>
          <p className="text-gray-600 text-sm">
            Email: <span className="font-semibold">{currentUser.email}</span>
          </p>

          {/* Logout Button */}
          <button
            onClick={async () => {
              await logout();
              navigate("/auth");
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm cursor-pointer"
          >
            Logout
          </button>

          {/* Delete Account Button */}
          <button
            onClick={async () => {
              if (
                confirm(
                  "⚠️ Are you sure you want to permanently delete your account?"
                )
              ) {
                try {
                  await api.delete("/users/me");
                  toast.success("Account deleted successfully");

                  navigate("/auth");
                } catch (err) {
                  toast.error("Error deleting account");
                  console.error(err);
                }
              }
            }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 text-sm cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
        {/* Create Agent Link */}
        <Link
          to="/dashboard/create-agent"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
        >
          + Create New Agent
        </Link>

        {/* File Upload Section */}
        <label
          htmlFor="file-upload"
          className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center bg-white hover:border-blue-400 cursor-pointer w-72 shadow-sm flex flex-col items-center justify-center"
        >
          <p className="text-gray-600 text-sm mb-2">
            Drag & Drop CSV/XLSX/AXLS File Here
          </p>
          <span className="text-blue-600 text-sm font-medium">
            {isUploading ? "Uploading..." : "Browse File"}
          </span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Agents Section */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl">
        {currentUser.agents.map((agent) => (
          <Link key={agent._id} to={`/dashboard/agents/${agent._id}`}>
            <AgentCard data={agent} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
