import { useContext, useState } from 'react';
import SelectedChatContext from './contexts/SelectedChatroomContext';
import './App.css';
import ChatBody from './components/ChatBody/ChatBody';
import ChatHeader from './components/ChatHeader/ChatHeader';
import ChatInput from './components/ChatInput/ChatInput';
import SocketContext from './contexts/SocketConnectionContext';

function App() {
  const [selectedChat, setSelectedChat] = useState('General');
  const { userId } = useContext(SocketContext);

  return (
    <div className="app">
      <h1 style={{ textAlign: 'center' }}>UserName: {userId}</h1>
      <h1 style={{ textAlign: 'center' }}>UserName: </h1>
      <div className="chatbox">
        <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
          <ChatHeader />
          <ChatBody />
          <ChatInput />
        </SelectedChatContext.Provider>
      </div>
    </div>
  );
}

export default App;
