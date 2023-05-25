import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const Room = ({ socket }) => {
    const { room } = useParams()

    const router = useRouter();
    const userVideoRef = useRef();
    const peerVideoRef = useRef();
    const rtcConnectionRef = useRef(null);
    const socketRef = useRef();
    const userStreamRef = useRef();
    const hostRef = useRef(false);

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                socketRef.current.emit('ready', roomName);
            })
            .catch((err) => {
                /* handle the error */
                console.log('error', err);
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socketRef.current.emit('offer', offer, roomName);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const ICE_SERVERS = {
        iceServers: [
            {
                urls: 'stun:openrelay.metered.ca:80',
            }
        ],
    };

    const createPeerConnection = () => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        return connection;

    };

    const { id: roomName } = router.query;
    useEffect(() => {
        socketRef.current = io();
        socketRef.current.emit('join', roomName);

        socketRef.current.on('created', handleRoomCreated);

        socketRef.current.on('joined', handleRoomJoined);
        // If the room didn't exist, the server would emit the room was 'created'

        // Whenever the next person joins, the server emits 'ready'
        socketRef.current.on('ready', initiateCall);

        // Emitted when a peer leaves the room
        socketRef.current.on('leave', onPeerLeave);

        // If the room is full, we show an alert
        socketRef.current.on('full', () => {
            window.location.href = '/';
        });

        // Events that are webRTC speccific
        socketRef.current.on('offer', handleReceivedOffer);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

        // clear up after
        return () => socketRef.current.disconnect();
    }, [roomName]);

    return (
        <div>
            <video autoPlay ref={userVideoRef} />
            <video autoPlay ref={peerVideoRef} />
        </div>
    );
};

export default Room;
