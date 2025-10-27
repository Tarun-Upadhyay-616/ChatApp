import { RiCloseFill } from 'react-icons/ri';
import { IoArrowBack } from "react-icons/io5";
import { getColor } from '../utils/utils.js';
import { HOST_ } from '../Constants.js';
import { useAppStore } from './../Store';
import Avatar from '@mui/material/Avatar';

const Chat_Header = ({ onProfileClick }) => {
  const { closeChat, selectedChatData } = useAppStore();

  return (
    <div className='flex min-h-[70px] items-center justify-between p-3 bg-transparent px-4'>
      <div className="flex items-center gap-4">

        <button
          onClick={closeChat}
          className="md:hidden text-gray-300 hover:text-white"
          aria-label="Back to contacts"
        >
          <IoArrowBack className='text-2xl' />
        </button>

        <div onClick={onProfileClick} className="flex items-center gap-4 cursor-pointer">
          <div className="flex-shrink-0">
            {selectedChatData.image ? (
              <Avatar src={`${HOST_}/${selectedChatData.image}`} sx={{ width: 48, height: 48 }} />
            ) : (
              <Avatar sx={{ width: 48, height: 48, bgcolor: getColor(selectedChatData.color), fontSize: '1.25rem' }}>
                {selectedChatData.firstname ? selectedChatData.firstname.charAt(0).toUpperCase() : 'C'}
              </Avatar>
            )}
          </div>
          <div className='flex flex-col text-white'>
            <h2 className='text-lg font-semibold'>
              {selectedChatData && `${selectedChatData.firstname} ${selectedChatData.lastname}`}
            </h2>
          </div>
        </div>
      </div>


      <div className='hidden md:flex items-center justify-center'>
        <button
          onClick={closeChat}
          className='text-red-500 hover:text-red-400'
          aria-label="Close chat"
        >
          <RiCloseFill className='text-3xl' />
        </button>
      </div>
    </div>
  );
};

export default Chat_Header;