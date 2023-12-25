import React, { useContext, useState } from 'react';
import "./ChatInput.css";
import SelectedChatContext from '../../contexts/SelectedChatroomContext';
import SocketContext from '../../contexts/SocketConnectionContext';

function ChatInput() {
  const [message, setMessage] = useState('');
  const { selectedChat } = useContext(SelectedChatContext);
  const { socketConnection } = useContext(SocketContext);
  const sendMessage = (event) => {
    event.preventDefault();
    if (selectedChat === 'General') {
      socketConnection.emit('general-room', { room: selectedChat, content: message });
      setMessage('');
    } else if (selectedChat === 'Tech Talk') {
      socketConnection.emit('tech-room', { room: selectedChat, content: message });
      setMessage('')
    } else if (selectedChat === 'Random') {
      socketConnection.emit('random-room', { room: selectedChat, content: message });
      setMessage('')
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage(event);
    }
  };

  return (
    <div className='chat-input'>
      <input type="text" placeholder='Type your message...' value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} />
      <button onClick={sendMessage} type='submit'>Send</button>
    </div>
  );
};

export default ChatInput;