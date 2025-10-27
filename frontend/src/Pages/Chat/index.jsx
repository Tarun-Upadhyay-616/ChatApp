import { useEffect } from 'react';
import EmptyChatContainer from '../../components/EmptyChatContainer';
import MainPanel from '../../components/MainPanel';
import { useAppStore } from '../../Store';
import NavPanel from './../../components/NavPanel';
import { useSocket } from '../../context/socketContext';

const Chat = () => {
  const { selectedChatData } = useAppStore();

  return (
    <div className="flex items-center justify-center h-[100vh] bg-gradient-to-br from-[#510f4d] via-[#12010e] to-[#510f4d] w-full">
      <div 
        className="flex w-full h-full md:w-[85vw] md:h-[85vh] lg:w-[70vw] lg:h-[85vh]
                   bg-white/10 backdrop-blur-lg md:rounded-2xl overflow-hidden shadow-2xl "
      >
        <NavPanel />
        {selectedChatData ? (
          <>
            <MainPanel />
          </>
        ) : (
          <EmptyChatContainer />
        )}
      </div>
    </div>
  );
};

export default Chat;