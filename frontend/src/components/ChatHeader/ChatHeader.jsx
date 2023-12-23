import React, { useContext, useState } from 'react';
import './ChatHeader.css';
import SelectedChatContext from '../../contexts/SelectedChatroomContext';

function ChatHeader({ socketClient }) {

  const chatRooms = ["General", "Tech Talk", "Random"];
  const [currentChatRoom, setCurrentChatRoom] = useState("General");
  const currentUser = "John Doe";
  const { setSelectedChat } = useContext(SelectedChatContext);
  console.log(socketClient);
  const handleRoomChange = (selectedRoom) => {
    setCurrentChatRoom(selectedRoom);
    // console.log("Switched to room:", currentChatRoom);
    setSelectedChat(selectedRoom);
  };

  return (
    <div className='chat-header'>
      <div className="room-select">
        <label htmlFor="room">Room:</label>
        <select id="room" value={currentChatRoom} onChange={(e) => handleRoomChange(e.target.value)}>
          {chatRooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>
      <div className="current-room">{currentChatRoom}</div>
      <div className="current-user">{currentUser}</div>
    </div>
  );
}

export default ChatHeader;