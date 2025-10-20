import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { toast } from "react-toastify";
import { useEffect } from "react";

export function ProtectedRoutes ({children}) {
    const {currentUser, loading} = useAuth();

    useEffect(() => {
        if(!loading && !currentUser){
            toast.error("Please Login to Continue");
        }
    },[currentUser, loading]);

    if(loading){
        return <div>Loading...</div>
    };

    if(!currentUser) {
        return <Navigate to ="/auth" replace />
    }
    
    return children ? children: <Outlet/>;


}