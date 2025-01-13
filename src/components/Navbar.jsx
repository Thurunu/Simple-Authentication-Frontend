import { assets } from "../assets/assets";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setuserData, setIsloggedin } =
    useContext(AppContext);

    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.post(backendUrl + '/api/auth/logout');
            data.success && setIsloggedin(false);
            data.success && setuserData(null);
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    };
  console.log("At Navbar", userData);

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}

          {/* Dropdown Menu */}
          <div className="absolute hidden group-hover:block bg-white border rounded shadow-lg top-0 right-0 z-10 p-2 text-black">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li className="cursor-pointer py-1 px-2 hover:bg-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                  Verify Email
                </li>
              )}
              <li onClick={logout} className="cursor-pointer py-1 px-2 pr-12 hover:bg-gray-200">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}
    </div>
  );
}
