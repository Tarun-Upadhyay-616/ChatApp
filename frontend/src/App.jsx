import { useState } from 'react'
import './App.css'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom' 
import LoginAuth from './Pages/LoginAuth/index.jsx'
import Chat from './Pages/Chat/index.jsx'
import Profile from './Pages/Profile/index.jsx'
import ResetPass from './Pages/Reset/index.jsx';
import VerifyEmail from './Pages/Verify/index';
import RegisterAuth from './Pages/RegisterAuth/index.jsx';
import { useAppStore } from './Store/index.js'
import { useEffect } from 'react'
import { apiClient } from './api-client.js'
import SplashScreen from "./components/Splash_Screen"

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  if (!userInfo) {
    return <Navigate to="/auth/register" />
  }
  return children;
}
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  if (userInfo) {
    return <Navigate to="/chat" />
  }
  return children;
}

const App = () => {
  const { setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)

  const location = useLocation();
  const currentPath = location.pathname;
  const isAuthRoute = currentPath === "/auth/login" || currentPath === "/auth/register";

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get('/user-info', { withCredentials: true })
        if (response.status === 200 && response.data.id) {
          await setUserInfo(response.data)
        } else {
          setUserInfo(undefined)
        }
      } catch (error) {
        console.log("No active session: ", error.message)
        setUserInfo(undefined)
      } finally {
        setLoading(false)
      }
    }
    getUserData()
  }, [])
  
  if (showSplash && isAuthRoute) {
    return <SplashScreen />;
  }
  if (loading) {
    return (
      <div className='flex justify-center items-center h-[100vh]'>Loading......</div>
    )
  }
  return (
    <>

      <Routes>
        <Route
          path="/auth/login"
          element={
            <AuthRoute>
              <LoginAuth />
            </AuthRoute>
          }
        />
        <Route path="/auth/register" element={<AuthRoute><RegisterAuth /></AuthRoute>} />
        <Route path="/auth/reset-password" element={<ResetPass />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth/register" />} />
      </Routes>
    </>
  )
}

export default App