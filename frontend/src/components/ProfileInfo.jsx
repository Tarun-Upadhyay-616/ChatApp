import { useNavigate } from "react-router-dom"
import { colors, getColor } from "../utils/utils.js"
import { MdModeEdit } from "react-icons/md";
import { GrPowerShutdown } from "react-icons/gr";
import { apiClient } from "../api-client.js";
import { useAppStore } from "../Store";
import Avatar from '@mui/material/Avatar';
import { HOST_ } from "../Constants.js";

const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore()
  const navigate = useNavigate()
  const handlelogout = async () => {
    try {
      const response = await apiClient.post('/logout', {},{ withCredentials: true })
      if (response.status===200) {
        navigate('/auth/register')
        setUserInfo(null)
      }
    } catch (error) {
      console.log({error})
    }
  }
  return (
    <div className="h-16 flex items-center justify-between w-full px-3 rounded-lg bg-black/20 shadow-sm">
      <div class="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <div className='h-12 w-12 rounded-full overflow-hidden' >
            {userInfo.image ? (
              <Avatar src={`${HOST_}/${userInfo.image}`} className='w-100 h-100'/>
            ) : (
              <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `} >
                {userInfo.firstname
                  ? userInfo.firstname.split("").shift()
                  : userInfo.email.split("").shift()
                }
              </div>
            )}
          </div>
        </div>
        <div className="text-gray-100 font-semibold">
          {
            userInfo.firstname && userInfo.lastname ? `${userInfo.firstname} ${userInfo.lastname}` : ""
          }
        </div>
      </div>
      <div class="flex gap-4">
        <MdModeEdit className="text-lg mt-1 text-gray-400 cursor-pointer hover:text-white" onClick={() => navigate("/profile")} />
        <GrPowerShutdown className="text-lg mt-1 text-gray-400 cursor-pointer hover:text-red-500" onClick={handlelogout} />
      </div>
    </div>
  )
}

export default ProfileInfo