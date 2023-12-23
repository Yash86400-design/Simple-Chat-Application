import React, { useContext, useState } from 'react';
import "./ChatInput.css";
import SelectedChatContext from '../../contexts/SelectedChatroomContext';

function ChatInput({ socketClient }) {
  const [message, setMessage] = useState('');
  const { selectedChat } = useContext(SelectedChatContext);
  const sendMessage = () => {
    socketClient.emit('message-sent', { room: selectedChat, content: message });
    console.log("Message sent:", message, "Selected Chatroom:", selectedChat);
    setMessage('');
  };

  return (
    <div className='chat-input'>
      <input type="text" placeholder='Type your message...' value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatInput;