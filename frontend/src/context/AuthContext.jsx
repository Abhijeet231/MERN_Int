import { api } from "@/utils/api.js";
import { useEffect, useState, useMemo, useContext, createContext } from "react";

// Creating Auth context
const AuthContext = createContext();

// Auth provider component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refetch user data
  const refetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      if (res.data?.data?.currUser) {
        setCurrentUser(res.data?.data?.currUser);
        console.log("LAtestUser", res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/users/me");
        if (res.data?.data?.currUser) {
          setCurrentUser(res.data?.data?.currUser);
          console.log("RAW RESPONSE:", res);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.log("No active session", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // Login function
  const login = async (credentials) => {
    const res = await api.post("/users/login", credentials);
    if (res.data?.data?.loggedInUser) {
      setCurrentUser(res.data?.data?.loggedInUser);
    }
    return res;
  };

  //Logout function
  const logout = async () => {
    await api.post("/users/logout");
    setCurrentUser(null);
  };

  // Memoizing context value
  const contextValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      refetchUser,
      login,
      logout,
      isAuthenticated: !!currentUser,
      loading,
    }),
    [currentUser, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use Auth context
const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
