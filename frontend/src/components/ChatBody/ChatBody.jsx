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

  // useEffect(() => {
  //   console.log("Chat body UseEffect Running times");
  //   if (socketConnection && selectedChat === 'General') {
  //     socketConnection.on('general-room-messages', (data) => {
  //       // if (userId === data.userId) {
  //       //   setGeneralRoomMessages((prevMessages) => [...prevMessages, data.message]);
  //       // }
  //       console.log(data);
  //       setGeneralRoomMessages((prevMessages) => [...prevMessages, data.message]);

  //     });
  //   } else if (socketConnection && selectedChat === 'Tech Talk') {
  //     socketConnection.on('tech-room-messages', (data) => {
  //       setTechRoomMessages((prevMessages) => [...prevMessages, data.message]);
  //     });
  //   } else if (socketConnection && selectedChat === 'Random') {
  //     socketConnection.on('random-room-messages', (data) => {
  //       setRandomRoomMessages((prevMessages) => [...prevMessages, data.message]);
  //     });
  //   }
  // }, [socketConnection, selectedChat]);

  useEffect(() => {
    const handleGeneralRoomMessages = (data) => {
      setGeneralRoomMessages((prevMessages) => [...prevMessages, { name: data.userId, message: data.message }]);
    };

    const handleTechRoomMessages = (data) => {
      setTechRoomMessages((prevMessages) => [...prevMessages, { name: data.userId, message: data.message }]);
    };

    const handleRandomRoomMessages = (data) => {
      setRandomRoomMessages((prevMessages) => [...prevMessages, { name: data.userId, message: data.message }]);
    };

    if (socketConnection) {
      if (selectedChat === 'General') {
        socketConnection.on('general-room-messages', handleGeneralRoomMessages, (serverOffset) => {
          socketConnection.auth.serverOffset = serverOffset;
        });
      }
      else if (selectedChat === 'Tech Talk') {
        socketConnection.on('tech-room-messages', handleTechRoomMessages, (serverOffset) => {
          socketConnection.auth.serverOffset = serverOffset;
        });
      }
      else if (selectedChat === 'Random') {
        socketConnection.on('random-room-messages', handleRandomRoomMessages, (serverOffset) => {
          socketConnection.auth.serverOffset = serverOffset;
        });
      }
    }

    return () => {
      if (socketConnection && selectedChat === 'General') {
        socketConnection.off("general-room-messages", handleGeneralRoomMessages);
      } else if (socketConnection && selectedChat === 'Tech Talk') {
        socketConnection.off('tech-room-messages', handleTechRoomMessages);
      } else if (socketConnection && selectedChat === 'Random') {
        socketConnection.off('random-room-messages', handleRandomRoomMessages);
      }
    };
  }, [socketConnection, selectedChat]);

  const selectedRoomMessages =
    selectedChat === 'General'
      ? generalRoomMessages
      : selectedChat === 'Tech Talk'
        ? techRoomMessages
        : selectedChat === 'Random'
          ? randomRoomMessages
          : [];

  //   return (
  // This is also working. It's just repeating some code
  //     <>
  //       {selectedChat === 'General' && (
  //         <div className='chat-body'>
  //           {generalRoomMessages.map((data, key) => (
  //             <p key={key}>{userId} {`=>`} {data}</p>
  //           ))}
  //         </div>
  //       )}
  //       {selectedChat === 'Tech Talk' && (
  //         <div className='chat-body'>
  //           {techRoomMessages.map((data, key) => (
  //             <p key={key}>{userId} {`=>`} {data}</p>
  //           ))}
  //         </div>
  //       )}
  //       {selectedChat === 'Random' && (
  //         <div className='chat-body'>
  //           {randomRoomMessages.map((data, key) => (
  //             <p key={key}>{userId} {`=>`} {data}</p>
  //           ))}
  //         </div>
  //       )}
  //     </>
  //   );
  // }
  return (
    <div className="chat-body">
      {selectedRoomMessages.map((data, key) => (
        <p key={key}>
          {data.name} {`=>`} {data.message}
        </p>
      ))}
    </div>
  );
}
export default ChatBody;