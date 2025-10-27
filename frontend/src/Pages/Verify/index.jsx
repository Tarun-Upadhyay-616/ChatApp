import React, { useState, useRef, useEffect } from "react";
import mailboxImg from "../../assets/mailbox.png"; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { apiClient } from './../../api-client'; 
import { useNavigate } from "react-router-dom"; 

const VerifyEmail = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate(); 
    
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const showToast = (message, type = 'error') => {
        toast(message, { type, position: 'top-center' }); 
          };

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

    const verifyOtp = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            return showToast("Please enter the complete 6-digit OTP.");
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post('/verifymail', {userotp: enteredOtp }, { withCredentials: true }); 
                        if (response.data.success) { 
                              toast.success("Email verified successfully!");
                setTimeout(() => {
                    navigate('/login'); 
                                  }, 2000);
            }
        } catch (err) {
            showToast(err?.response?.data?.message || 'Something went wrong'); 
                  } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer theme="dark" position="bottom-right" />
            <div className="min-h-[100vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center space-y-6">
                    
                    <img src={mailboxImg} alt="Mailbox" className="mx-auto h-32 w-32" />

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Enter the 6-digit code we sent to your email address.
                        </p>
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

                    <button
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                        onClick={verifyOtp}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </div>
                        ) : 'Verify Account'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;