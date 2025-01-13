import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsloggedin] = useState(false);
  const [userData, setuserData] = useState(null);

  const getAuthState = async () => {

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/is-auth`, {}, {withCredentials: true});
      console.log("Auth State Response:", data);
      if (data.success) {
        setIsloggedin(true);
        getUserData();
      } else {
        // Clear data if not authenticated
        setuserData(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    console.log("Fetching User Data");
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true, // Same credentials flag as above
      });
      console.log("User Data Response:", data);
      if (data.success) {
        setuserData(data.userData);
      } else {
        console.warn("Failed to fetch user data:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      toast.error(error.message);
    }
  };

  // Fetch authentication state on app load
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsloggedin,
    userData,
    setuserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
