import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api-client.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppStore } from './../../Store/index.js';
import { MdEmail } from 'react-icons/md';

const LoginAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const isValid = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address.');
        return false;
    }
    if (!password) {
      toast.error('Password is Required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/login', { email, password }, { withCredentials: true });
      const user = response.data.user;

      if (user) {
        setUserInfo(user); 
        toast.success('Login successful! Redirecting...');

        setTimeout(() => {
          if (user.profilesetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }, 500); 
      } else {

        toast.error(response.data?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
         toast.error(err.response.data?.message || 'Invalid credentials or server error.');
      } else if (err.request) {
         toast.error('No response from server. Please check your connection.');
      } else {
         toast.error('Login failed due to an unexpected error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme='dark' position='bottom-right' autoClose={3000}/>
      <div className="min-h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden p-8 md:p-12">

    
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">We're happy to see you again.</p>
          </div>

          <div className="space-y-5">

            <div className="relative">
              <input
                type="email"
                className="w-full pl-10 pr-3 p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                className="w-full pl-10 pr-3 p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:text-white dark:placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>
          </div>
          <div className="flex items-center justify-end mt-5 text-sm mb-2">
            <Link to="/auth/reset-password" className="font-medium text-purple-600 hover:underline dark:text-purple-400">
              Forgot Password?
            </Link>
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-6 mb-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-medium text-purple-600 hover:underline dark:text-purple-400">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </>
  );
};

export default LoginAuth;