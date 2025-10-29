import { useRef, useEffect, useState } from "react";
import { useAppStore } from './../Store/index.js';
import moment from 'moment';
import { apiClient3 } from "../api-client.js";
import { HOST, HOST_ } from "../Constants.js";
import { MdFolderZip } from "react-icons/md";
import { IoMdClose, IoMdCloudDownload } from "react-icons/io";

const Chat_Container = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    triggerNavPanelRefresh 
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient3.post('/api/message/getMessages', { id: selectedChatData._id }, { withCredentials: true });
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
          triggerNavPanelRefresh()
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    if (selectedChatData?._id) {
      getMessages();
    }
  }, [selectedChatData, setSelectedChatMessages,triggerNavPanelRefresh]);

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const checkIfImage = (filepath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filepath);
  };

  const downloadFile = async (url) => {
    try {
      const response = await apiClient3.get(`${HOST_}/${url}`, {
        responseType: "blob",
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", url.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }, 0)
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-sm text-gray-500 my-4">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    const isSender = message.sender !== selectedChatData._id;
    return (
      <div className={`flex my-1 ${isSender ? "justify-end" : "justify-start"}`}>
        <div className="flex flex-col items-start max-w-xs md:max-w-lg">
          {message.messageType === "text" && (
            <div
              className={`
              px-4 py-2 rounded-2xl break-words text-white
              ${isSender
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-none"
                  : "bg-black/20 rounded-bl-none"
                }
            `}
            >
              {message.content}
            </div>
          )}
          {message.messageType === "file" && (
            <div
              className={`
              px-4 py-2 rounded-2xl break-words text-white
              ${isSender
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 rounded-br-none"
                  : "bg-black/20 rounded-bl-none"
                }
            `}
            >
              {checkIfImage(message.fileUrl) ? (
                <div className="cursor-pointer"
                  onClick={() => {
                    setShowImage(true);
                    setImageUrl(message.fileUrl);
                  }}
                >
                  <img src={`${HOST_}/${message.fileUrl}`} className="max-w-[250px] max-h-[250px] h-auto w-auto rounded-lg" alt="thumbnail" />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/8 text-4xl bg black rounded-full p-3">
                    <MdFolderZip className="text-black" />
                  </span>
                  <span>
                    {message.fileUrl.split('/').pop()}
                  </span>
                  <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer" onClick={() => downloadFile(message.fileUrl)}>
                    <IoMdCloudDownload />
                  </span>
                </div>
              )}
            </div>
          )}
          <div className={`text-xs text-gray-500 mt-1 px-1 ${isSender ? "self-end" : "self-start"}`}>
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex-1 overflow-y-auto bg-transparent max-h-auto'>
      <div className="max-w-4xl p-2">
        {renderMessages()}
        <div ref={scrollRef} />
      </div>

      {showImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-3xl bg-gray-500/80 p-4"
          onClick={() => {
            setShowImage(false);
            setImageUrl(null);
          }}
        >
          <img
            src={`${HOST_}/${imageUrl}`}
            className="max-w-[90vw] max-h-[70vh] object-contain rounded-lg shadow-2xl"
            alt="Full size view"
          />
          <div className="flex gap-5 mt-3">
            <button
              title="Download Image"
              className="bg-black/80 p-3 text-3xl text-white rounded-5 hover:bg-black/50 cursor-pointer transition-all duration-200"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdCloudDownload />
            </button>
            <button
              title="Close"
              className="bg-black/80 p-3 text-3xl text-white rounded-5 hover:bg-black/50 cursor-pointer transition-all duration-200"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoMdClose />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Chat_Container;