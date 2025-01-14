import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setNewPassword] = useState(""); // Fixed typo here

  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const otpArray = paste.split("");
    otpArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      
      const { data } = await axios.post(`${backendUrl}/api/auth/reset`, {
        email,
        otp,
        password, // Updated state variable name
      });
      console.log("HI",data)
      if (data.success) {
        toast.success(data.message);
        navigate("/login"); // Navigate to the login page on success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to bg-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your Email ID</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} className="w-3 h-3" alt="" />
            <input
              type="email"
              placeholder="Email id"
              className="bg-transparent outline-none text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your Email ID.</p>
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
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Verify OTP
          </button>
        </form>
      )}

      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-indigo-300">Enter your New Password</p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} className="w-3 h-3" alt="" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white"
              value={password} // Fixed state variable
              onChange={(e) => setNewPassword(e.target.value)} // Updated state function
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-400 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
