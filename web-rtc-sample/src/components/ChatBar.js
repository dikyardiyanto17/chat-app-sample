import '../assets/css/Chat.css'
import { useParams } from "react-router-dom"
import { useEffect, useState, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, findUser, findChat, sendChat } from "../stores/action/actionCreator"

// Line Development video call using peer -->

import peer from '../service/peer.js'
import IncomingCall from './IncomingCall'
import CallUser from './CallUser'
import VideoCall from './VideoCall'

// <-- Line Development

export default function ChatBar({ socket }) {

    // Line Development video call using peer -->

    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [incomingCall, setIncomingCall] = useState(false)
    const [offers, setOffers] = useState()
    const [calling, setCalling] = useState(false)
    const [isCalling, setIsCalling] = useState(false)

    const handleCallUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        console.log("CALL AGAIN")
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: userData.socketId, offer });
        setCalling(true)
        setMyStream(stream);
    }
    const handleIncommingCall = async ({ from, offer }) => {
        setOffers(offer)
        setRemoteSocketId(from);
        setIncomingCall(true)
    }

    const acceptCall = async () => {
        const ans = await peer.getAnswer(offers);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        setMyStream(stream);
        sendStreams2(stream)
        socket.emit("call:accepted", { to: remoteSocketId, ans });
    }

    const rejectCall = async () => {
        console.log("REJECTED")
        socket.emit("call:rejected", ({ to: remoteSocketId }))
    }

    const sendStreams2 = (stream) => {
        for (const track of stream.getTracks()) {
            console.log(track)
            peer.peer.addTrack(track, stream);
        }
    }

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            console.log(track)
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

    const cancelCall = () => {
        socket.emit("cancelCall", { to: userData.socketId })
    }

    const endCalling = () => {
        socket.emit("endCalling", { to: userData.socketId })
    }

    const handleCallAccepted = useCallback(
        ({ from, ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            setCalling(false)
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        console.log("ENTER TRACK")
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("Success Sharing");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    // <-- Line Development

    const chatEndRef = useRef(null);
    const dispatch = useDispatch()
    const [userData, setUserData] = useState()
    const messagePosition = (name, compareName) => name == compareName ? "message my-message" : "message other-message float-right"
    const checkDisplay = (name, compareName, isReads) => {
        if (name == compareName) {
            if (isReads.length == 2) { return "fa fa-check-double" }
            else { return "fa fa-check" }
        } else {
            return 'd-none'
        }
    }
    const datePosition = (name, compareName) => name == compareName ? "message-data" : "message-data text-right"
    const [typing, setTyping] = useState('')
    const user = useSelector((state) => state.users.user)
    const chats = useSelector((state) => state.chats.chats)
    const { chatto } = useParams()
    const [currentChats, setCurrentChats] = useState([])
    const isOnline = (socketId) => socketId ? "fa fa-circle online" : "fa fa-circle offline"
    const isOnlineStatus = (socketId) => socketId ? "Online" : "Offline"

    const changeHandler = (e) => {
        setTyping(e.target.value)
    }

    const formatTime = (dateData) => {
        const date = new Date(dateData)
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isToday = date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();
        const isYesterday = date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();
        let dateStr;
        if (isToday) {
            dateStr = 'Today';
        } else if (isYesterday) {
            dateStr = 'Yesterday';
        } else {
            dateStr = date.toLocaleDateString();
        }
        return `${formattedHours}.${formattedMinutes} ${ampm}, ${dateStr}`;
    }

    const chat = (e) => {
        e.preventDefault()
        dispatch(findUser(chatto)).then((data) => {
            const roomName = [localStorage.getItem("name"), data.name].sort().join('_')
            let isReads = [localStorage.getItem("name")]
            const data2 = {
                room: roomName,
                message: typing,
                sender: localStorage.getItem("name"),
                receiver: data.name,
                sentAt: new Date(),
                _id: Math.random(),
                isReads
            }
            dispatch(sendChat({ message: typing, sender: localStorage.getItem("name"), receiver: data.name }))
            socket.emit("chat message", data2)
            setTyping('')
        })
    }
    useEffect(() => {
        dispatch(findChat(chatto))
        socket.on("response", (data) => {
            dispatch(findChat(chatto)).then((theData) => setCurrentChats(theData))
            // setCurrentChats([...currentChats, data])
        })
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [socket, currentChats])

    useEffect(() => {
        dispatch(findChat(chatto)).then((data) => setCurrentChats(data))
        dispatch(findUser(chatto)).then((data) => setUserData(data))
        dispatch(getUsers())
    }, [chatto])

    useEffect(() => {
        socket.on('updating users', (data) => {
            dispatch(findUser(chatto)).then((data) => setUserData(data))
        })

        socket.on('updating message', (data) => {
            dispatch(findChat(chatto)).then((data) => setCurrentChats(data))
        })

        socket.on("call:rejected", ({ isAccepted }) => {
            setIncomingCall(false)
            setCalling(false)
        })

        socket.on("cancelCall", (data) => {
            console.log("canceling call")
            setIncomingCall(false)
            setCalling(false)
        })

        socket.on("calling", (data) => {
            setIsCalling(true)
        })

        socket.on("endCalling", (data) => {
            setIsCalling(false)
        })
    }, [])
    return (
        <div className="chat">
            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        <a data-toggle="modal" data-target="#view_info">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                        </a>
                        <div className="chat-about">
                            <h6 className="m-b-0">{userData?.name}</h6>
                            <small><i className={isOnline(userData?.socketId)}></i> {isOnlineStatus(userData?.socketId)}</small>
                        </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right d-flex align-items-center flex-row-reverse">

                        {/* Line Development*/}

                        {userData?.socketId &&
                            <small onClick={handleCallUser}><i className='fa fa-phone'></i></small>
                        }
                        {calling && <CallUser calling={calling} setCalling={setCalling} rejectCall={rejectCall} cancelCall={cancelCall} />}
                        {incomingCall && <IncomingCall setIncomingCall={setIncomingCall} acceptCall={acceptCall} rejectCall={rejectCall} />}
                        {isCalling && <VideoCall setIsCalling={setIsCalling} isCalling={isCalling} remoteStream={remoteStream} myStream={myStream} endCalling={endCalling} />}

                        {/* Line Development*/}


                    </div>
                </div>
            </div>
            <div className="chat-history">
                <ul className="m-b-0 chat-height">
                    {currentChats?.map((chat, index) => {
                        return (
                            <li className="clearfix" key={chat?._id}>
                                <div className={datePosition(localStorage.getItem("name"), chat?.sender)}>
                                    <span className="message-data-time">{formatTime(chat?.sentAt)}</span>
                                </div>
                                <div className={messagePosition(localStorage.getItem("name"), chat.sender)} style={{ position: 'relative' }}><i className={checkDisplay(localStorage.getItem("name"), chat.sender, chat.isReads)} style={{ width: '10px', position: 'absolute', bottom: '0px', left: '0px' }}></i>{chat?.message}</div>
                            </li>
                        )
                    })}
                    <li ref={chatEndRef}></li>
                </ul>
            </div>
            <div className="chat-message clearfix">
                <form onSubmit={chat}>
                    <div className="input-group mb-0">
                        <div className="input-group-prepend">
                            <button type='submit'><span className="input-group-text"><i className="fa fa-send"></i></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter text here..." onChange={changeHandler} value={typing} />
                    </div>
                </form>
            </div>
        </div>
    )
}