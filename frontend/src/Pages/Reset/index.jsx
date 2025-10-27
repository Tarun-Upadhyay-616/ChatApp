import React, { useRef, useState, useEffect } from 'react';
import { apiClient } from '../../api-client.js'; //
import { ToastContainer, toast } from 'react-toastify'; //
import { useNavigate } from 'react-router-dom'; //

const ResetPass = () => {
  const [stage, setStage] = useState('email');
  const [email, setEmail] = useState(''); //
  const [password, setPassword] = useState(''); //
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (stage === 'otp') {
      inputRefs.current[0]?.focus();
    }
  }, [stage]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) { 
      inputRefs.current[index + 1].focus(); 
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const otpsender = async () => {
    if (!email) return toast.error("Please enter your email.");

    setIsLoading(true);
    try {
      const response = await apiClient.post('/resetotp', { email }, { withCredentials: true }); //
      if (response.data.success) {
        toast.success("An OTP has been sent to your email!");
        setStage('otp');
      } else {
        toast.error(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const otpVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return toast.error("Please enter the 6-digit OTP.");
    if (!password) return toast.error("Please enter a new password.");

    setIsLoading(true);
    try {
      const response = await apiClient.post('/passwordreset', { userotp: enteredOtp, email, newpass: password }, { withCredentials: true }); //
      if (response.data.success) { 
        toast.success("Password Changed Successfully");
        setTimeout(() => {
          navigate("/login"); 
        }, 2000); 
      } else {
        toast.error(response.data.message || "Invalid OTP or an error occurred.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <div className="min-h-[100vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">

          {stage === 'email' ? (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your email to receive a verification code.</p>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  id="email"
                  className='w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white'
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your.email@example.com'
                  required
                />
              </div>
              <button
                className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-blue-400'
                onClick={otpsender}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enter Verification Code</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">A 6-digit code was sent to <span className="font-medium text-gray-800 dark:text-gray-200">{email}</span></p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-12 h-12 text-center text-2xl font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                    maxLength="1"
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    ref={el => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input
                  type="password"
                  className='w-full p-3 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white'
                  placeholder='Enter new password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                className='w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:bg-green-400'
                onClick={otpVerify}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify & Reset'}
              </button>
              <button
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                onClick={() => setStage('email')}
              >
                Back to email
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResetPass;