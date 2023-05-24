import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';

const Try2 = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [peer, setPeer] = useState(null);
    const myStream = useRef()

    useEffect(() => {
        const initializePeer = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log(stream)
            const newPeer = new Peer({ initiator: true, trickle: false, stream }); //add stream

            newPeer.on('signal', (data) => {
                console.log('Signal data:', data);
            });

            newPeer.on('connect', () => {
                console.log('Connected to peer');
            });

            newPeer.on('data', (data) => {
                const message = { content: data.toString() };
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            setPeer(newPeer);
        };

        initializePeer();
    }, []);

    const handleMessageChange = (e) => {
        setInputMessage(e.target.value);
    };

    const sendMessage = (e) => {
        e.preventDefault();

        if (peer) {
            peer.send(inputMessage);
            const message = { content: inputMessage };
            setMessages((prevMessages) => [...prevMessages, message]);
            setInputMessage('');
        }
    };

    return (
        <div>
            <div>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.content}</li>
                    ))}
                </ul>
            </div>
            <form onSubmit={sendMessage}>
                <input type="text" value={inputMessage} onChange={handleMessageChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Try2;
