
import { useState } from 'react';
import Chat_Header from './Chat_Header';
import Chat_Container from './Chat_Container';
import Message_Container from './Message_Container';
import FriendProfile from './FriendProfile';

const MainPanel = () => {

  const [isFriendProfileOpen, setIsFriendProfileOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent">
      <div className="flex-shrink-0">
        <Chat_Header onProfileClick={() => setIsFriendProfileOpen(true)} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Chat_Container />
      </div>

      <div className="flex-shrink-0">
        <Message_Container />
      </div>

      <FriendProfile
        isOpen={isFriendProfileOpen}
        onClose={() => setIsFriendProfileOpen(false)}
      />
    </div>
  );
};

export default MainPanel;