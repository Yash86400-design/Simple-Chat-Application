import React, { useEffect, useState } from 'react';
import "./ChatBody.css";

function ChatBody({ socketClient }) {

  const [data, setData] = useState('');
  console.log(socketClient);

  useEffect(() => {
    socketClient.on('message-received', (newMessage) => {
      console.log(newMessage);
      setData(newMessage);
    });
  }, [socketClient]);

  return (
    <div className='chat-body'>
      <p>{data}</p>
    </div>
  );
}

export default ChatBody;