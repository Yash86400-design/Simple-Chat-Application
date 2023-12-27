import React, { useEffect } from "react";
import SocketContext from "./SocketConnectionContext";
import { io } from "socket.io-client";

const SocketContextProvider = ({ children }) => {
  const [socketConnection, setSocketConnection] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  useEffect(() => {
    const rooms = ['General', 'Tech Talk', 'Random'];
    const socket = io('http://localhost:5000', {
      auth: {
        serverOffset: 0
      }
    });
    socket.on('userId', (receivedUserId) => {
      setUserId(receivedUserId);
    });
    for (let roomNo = 0; roomNo < rooms.length; roomNo++) {
      socket.emit('joinRoom', { roomName: rooms[roomNo] });
    }
    setSocketConnection(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketConnection, userId }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;