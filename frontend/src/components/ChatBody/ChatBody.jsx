import React, { useContext, useEffect, useState } from 'react';
import "./ChatBody.css";
import SocketContext from '../../contexts/SocketConnectionContext';
import SelectedChatContext from '../../contexts/SelectedChatroomContext';

function ChatBody() {
  const { socketConnection, userId } = useContext(SocketContext);
  const { selectedChat } = useContext(SelectedChatContext);
  const [generalRoomMessages, setGeneralRoomMessages] = useState([]);
  const [techRoomMessages, setTechRoomMessages] = useState([]);
  const [randomRoomMessages, setRandomRoomMessages] = useState([]);

  useEffect(() => {
    if (socketConnection && selectedChat === 'General') {
      socketConnection.on('general-room-messages', (data) => {
        // if (userId === data.userId) {
        //   setGeneralRoomMessages((prevMessages) => [...prevMessages, data.message]);
        // }
        console.log('Hi');
        setGeneralRoomMessages((prevMessages) => [...prevMessages, data.message]);

      });
    } else if (socketConnection && selectedChat === 'Tech Talk') {
      socketConnection.on('tech-room-messages', (data) => {
        setTechRoomMessages((prevMessages) => [...prevMessages, data.message]);
      });
    } else if (socketConnection && selectedChat === 'Random') {
      socketConnection.on('random-room-messages', (data) => {
        setRandomRoomMessages((prevMessages) => [...prevMessages, data.message]);
      });
    }
  }, [socketConnection, selectedChat]);


  return (
    <>
      {selectedChat === 'General' && (
        <div className='chat-body'>
          {generalRoomMessages.map((data, key) => (
            <p key={key}>{userId} {`=>`} {data}</p>
          ))}
        </div>
      )}
      {selectedChat === 'Tech Talk' && (
        <div className='chat-body'>
          {techRoomMessages.map((data, key) => (
            <p key={key}>{userId} {`=>`} {data}</p>
          ))}
        </div>
      )}
      {selectedChat === 'Random' && (
        <div className='chat-body'>
          {randomRoomMessages.map((data, key) => (
            <p key={key}>{userId} {`=>`} {data}</p>
          ))}
        </div>
      )}
    </>
  );
}

export default ChatBody;