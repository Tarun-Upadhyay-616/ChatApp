import React from 'react';
import { useAppStore } from '../Store/index';
import { getColor } from '../utils/utils';
import Avatar from '@mui/material/Avatar';
import { HOST_ } from '../Constants.js';
import moment from 'moment';
import { useEffect } from 'react';

const ContactList = ({ chat }) => {
  const { setSelectedChatData, selectedChatData  } = useAppStore();
  const isSelected = selectedChatData?._id === chat._id;
  return (
    <div
      className={`flex items-center cursor-pointer p-3 transition-colors duration-200 rounded-lg
                  ${isSelected ? 'bg-white/20' : 'hover:bg-white/10'}`}
      onClick={() => setSelectedChatData(chat)}
    >
      <div className="flex-shrink-0">
        {chat.image ? (
          <Avatar src={`${HOST_}/${chat.image}`} sx={{ width: 40, height: 40 }}/>
        ) : (
          <Avatar sx={{ width: 40, height: 40, bgcolor: getColor(chat.color), fontSize: '1.25rem' }}>
            {chat.firstname ? chat.firstname.charAt(0).toUpperCase() : 'C'}
          </Avatar>
        )}
      </div>

      <div className="flex-1 min-w-0 ml-3">
        <div className="flex justify-between items-center mb-1">
          <p className="text-lg font-semibold truncate text-white">
            {`${chat.firstname} ${chat.lastname}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactList;