import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import SelectedChatContext from './contexts/SelectedChatroomContext';
import './App.css';
import ChatBody from './components/ChatBody/ChatBody';
import ChatHeader from './components/ChatHeader/ChatHeader';
import ChatInput from './components/ChatInput/ChatInput';

function App() {
  const [userId, setUserId] = useState('');
  const [selectedChat, setSelectedChat] = useState('General');
  const [socketConnection, setSocketConnection] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Attach event listeners only when socket is connected
    if (socket) {
      socket.on('userId', (receivedUserId) => {
        setUserId(receivedUserId);
        console.log("Hi");
      });

      // ... other event listeners
    }

    setSocketConnection(socket);

    // Disconnect only when component unmounts
    return () => {
      if (!socket) {
        socket.disconnect();
      }
    };
  }, []);

  // ... other useEffects

  return (
    <div className="app">
      <h1 style={{ textAlign: 'center' }}>UserName: {userId}</h1>
      <div className="chatbox">
        <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat }}>
          <ChatHeader socketClient={socketConnection} />
          <ChatBody socketClient={socketConnection} />
          <ChatInput socketClient={socketConnection} />
        </SelectedChatContext.Provider>
      </div>
    </div>
  );
}

export default App;
