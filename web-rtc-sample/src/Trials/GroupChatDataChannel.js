import React, { useState, useEffect, useRef } from 'react';

const GroupChatDataChannel = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);

  const localConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);

  useEffect(() => {
    const initWebRTC = async () => {
      const localConnection = new RTCPeerConnection();

      localConnectionRef.current = localConnection;

      localConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannelRef.current = dataChannel;

        dataChannel.onmessage = (messageEvent) => {
          const { data, sender } = JSON.parse(messageEvent.data);
          const newMessage = { text: data, sender };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        dataChannel.onopen = () => {
          console.log('DataChannel opened');
        };

        dataChannel.onclose = () => {
          console.log('DataChannel closed');
        };
      };

      const offer = await localConnection.createOffer();
      await localConnection.setLocalDescription(offer);

      const signalingServerUrl = 'ws://localhost:2222';

      const socket = new WebSocket(signalingServerUrl);

      socket.onopen = () => {
        console.log('Connected to signaling server');
        socket.send(JSON.stringify({ type: 'offer', offer }));
      };

      socket.onmessage = async (event) => {
        const { type, answer } = JSON.parse(event.data);
        if (type === 'answer') {
          await localConnection.setRemoteDescription(answer);
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from signaling server');
      };

      localConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
      };
    };

    initWebRTC();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();

    const newMessage = { text: inputText, sender: 'You' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (dataChannelRef.current) {
      dataChannelRef.current.send(JSON.stringify({ data: inputText, sender: 'You' }));
    }

    setInputText('');
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>{message.sender}: </strong>
              {message.text}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Connected Users</h2>
        <ul>
          {connectedUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default GroupChatDataChannel;
