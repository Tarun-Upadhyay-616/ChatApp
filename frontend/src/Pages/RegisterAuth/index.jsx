import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
// Logo import removed
import { apiClient } from '../../api-client';
import { useNavigate, Link } from 'react-router-dom';

const RegisterAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValid = () => {
    if (!email) {
      toast.error('Email is Required');
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
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }
    if (!confirmPassword) {
        toast.error('Please confirm your password.');
        return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not Match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!isValid()) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post('/signup', { email, password, confirmPassword }, { withCredentials: true });
      if (response.data.user) {
  
        await apiClient.post('/sendotp', { userId: response.data.user.id }, { withCredentials: true });
        toast.success('Signup successful! Please verify your email.');
        setTimeout(() => {
          navigate('/auth/verify-email');
        }, 2000);
      }
    } catch (err) {
      console.error('Error during signup:', err);
      if (err.response) {
        toast.error(err.response.data?.message || 'Signup failed. Please try again.');
      } else if (err.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Something went wrong during signup.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme='dark' position='bottom-right' autoClose={3000} />
      <div className="min-h-[100vh] flex items-center justify-center bg-gray-900 p-4 ">

        <div className="w-full max-w-md bg-white shadow-2xl rounded-lg overflow-hidden p-8 md:p-12">

    
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
            <p className="mt-2 text-sm text-gray-400">Create your account now.</p>
          </div>


          <div className="space-y-5">

            <div className="relative">
              
              <input
                type="email"
                className="w-full pl-10 pr-3 p-3 text-sm bg-gray-700 border -gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                className="w-full pl-10 pr-3 p-3 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none -white placeholder-gray-400"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
              />
            </div>

            <div className="relative">
              
              <input
                type="password"
                className="w-full pl-10 pr-3 p-3 text-sm bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-400"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
              />
            </div>
          </div>


          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full mt-5 mb-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>


          <p className="text-center text-sm text-gray-400 mt-6">
            Already a member?{' '}
            <Link to="/auth/login" className="font-medium  hover:underline text-purple-400">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterAuth;