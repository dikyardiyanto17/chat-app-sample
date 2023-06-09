import '../assets/css/Chat.css'
import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, findUser, findChat, sendChat } from "../stores/action/actionCreator"
import ModalGroupInfo from './ModalGroupInfo'

export default function ChatBarGroup({ socket, roomData, users, setRoomData }) {
    const chatEndRef = useRef(null);
    const dispatch = useDispatch()
    const [userData, setUserData] = useState()
    const messagePosition = (name, compareName) => name == compareName ? "message my-message" : "message other-message float-right"
    const datePosition = (name, compareName) => name == compareName ? "message-data" : "message-data text-right"
    const [typing, setTyping] = useState('')
    const user = useSelector((state) => state.users.user)
    const chats = useSelector((state) => state.chats.chats)
    const { room } = useParams()
    const [currentChats, setCurrentChats] = useState([])
    const isOnline = (socketId) => socketId ? "fa fa-circle online" : "fa fa-circle offline"
    const isOnlineStatus = (socketId) => socketId ? "Online" : "Offline"
    const isSender = (sender, currentUser) => sender == currentUser ? "You" : sender

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
        dispatch(findUser(room)).then((data) => {
            const data2 = {
                room: roomData._id,
                message: typing,
                sender: localStorage.getItem("name"),
                sentAt: new Date(),
                _id: Math.random()
            }
            dispatch(sendChat({ message: typing, sender: localStorage.getItem("name"), roomName: roomData.name }))
            socket.emit("chat message", data2)
            setCurrentChats([...currentChats, data2])
            setTyping('')
        })
    }
    useEffect(() => {
        dispatch(findChat(room))
        socket.on("response", (data) => {
            setCurrentChats([...currentChats, data])
        })
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [socket, currentChats])

    useEffect(() => {
        dispatch(findChat(room)).then((data) => setCurrentChats(data))
        dispatch(getUsers())
    }, [room])

    return (
        <div className="chat">
            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        <a data-toggle="modal" data-target="#view_info">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                        </a>
                        <div className="chat-about">
                            <ModalGroupInfo roomData={roomData} users={users} setRoomData={setRoomData} socket={socket}/>
                            {/* <small><i className={isOnline(userData?.socketId)}></i> {isOnlineStatus(userData?.socketId)}</small> */}
                        </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right">
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
                                    <p className="message-data-time">{isSender(chat?.sender, localStorage.getItem("name"))}</p>
                                </div>

                                <div className={messagePosition(localStorage.getItem("name"), chat.sender)}><p>{chat?.message}</p></div>
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