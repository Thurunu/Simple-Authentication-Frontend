import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function EmailVerify() {
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;

    // Restrict input to only digits
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }

    // Move focus to the next input if value is entered
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move focus to the previous input if value is deleted
    if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const otpArray = paste.split("");
    otpArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); // from this we avoid the web page reloading
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      console.log(otp);
      console.log(backendUrl);
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      ); // error is in here cause I got 400 bad request
      console.log(data);
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate("/");
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {isLoggedin && userData && userData.isAccountVerified && navigate("/")}, [isLoggedin, userData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to bg-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your Email ID.
        </p>
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                ref={(e) => (inputRefs.current[index] = e)}
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5c] text-white text-center text-x1 rounded-md"
                onInput={(e) => handleInput(e, index)}
                pattern="\d*"
                inputMode="numeric"
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>
    </div>
  );
}
