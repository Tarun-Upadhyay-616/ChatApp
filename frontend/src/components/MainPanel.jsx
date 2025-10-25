
import { useState } from 'react';
import Chat_Header from './Chat_Header';
import Chat_Container from './Chat_Container';
import Message_Container from './Message_Container';
import FriendProfile from './FriendProfile';

const MainPanel = () => {

  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      <Chat_Header onProfileClick={() => setIsFriendProfileOpen(true)} />
      <Chat_Container />
      <Message_Container />

      <FriendProfile 
        isOpen={isFriendProfileOpen} 
        onClose={() => setIsFriendProfileOpen(false)} 
      />
    </div>
  );
};

export default MainPanel;