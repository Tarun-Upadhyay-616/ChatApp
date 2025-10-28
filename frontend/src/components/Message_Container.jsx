import { useRef, useState, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from '../Store';
import { useSocket } from '../context/socketContext';
import { apiClient3 } from './../api-client.js';

const Message_Container = () => {
  const fileInputRef = useRef()
  const { selectedChatData, userInfo, addMessage,selectedChatType } = useAppStore();
  const emojiRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        const response = await apiClient3.post('/api/message/upload-file', formData, { withCredentials: true })
        if (response.status === 200 && response.data) {
            const messageData = {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
              timestamp: new Date(),
            };
            
            socket.emit("sendMessage", messageData);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    const messageData = {
      sender: userInfo.id,
      content: message,
      recipient: selectedChatData._id,
      messageType: "text",
      fileUrl: undefined,
      timestamp: new Date(),
    };
    socket.emit("sendMessage", messageData);
    setMessage("");
    setEmojiPickerOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='h-auto min-h-[80px] w-full bg-transparent flex items-center justify-center px-2 gap-2 text-white border-t border-gray-700'>
      <div className="flex-1 flex bg-transparent border-2 border-gray-500 rounded-xl items-center px-2">
        <div className="relative">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className='p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200'
          >
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-14 left-0" ref={emojiRef}>
              <EmojiPicker
                theme='dark'
                open={emojiPickerOpen}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          className='flex-1 p-3 bg-transparent focus:outline-none resize-none max-h-24 text-white placeholder-gray-400'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className='p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200' onClick={handleAttachmentClick}>
          <GrAttachment className='text-xl' />
        </button>
        <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
      </div>
      <button
        onClick={handleSendMessage}
        className='bg-purple-600 rounded-xl flex justify-center items-center p-3 flex-shrink-0 text-white
+                   hover:bg-purple-700 transition-all duration-300'
      >
        <IoSend className='text-2xl' />
      </button>
    </div>
  );
};

export default Message_Container;