import '../assets/css/Chat.css'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers } from "../stores/action/actionCreator"
import LogOutButton from '../components/LogOutButton'
import GroupChatButton from '../components/GroupChatButton'

export default function ChatNotSelected({ socket }) {
    const dispatch = useDispatch()
    const [updateUsers, setUpdateUsers] = useState([])
    const users = useSelector((state) => state.users.users)
    const isOnline = (socketId) => socketId ? "fa fa-circle online" : "fa fa-circle offline"
    const isOnline2 = (socketId) => socketId ? "Online" : "Offline"

    useEffect(() => {
        socket.on("updating users", (data) => {
            setUpdateUsers(data)
            getUsers()
        })
        dispatch(getUsers())
    }, [])

    return (
        <>
            <div className="container">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card chat-app">
                            <div id="plist" className="people-list">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-search"></i></span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="Search..." />
                                </div>
                                <ul className="list-unstyled chat-list mt-2 mb-0">
                                    {users?.map((user) => {
                                        if (user.name !== localStorage.getItem("name")) {
                                            return (
                                                <li className="clearfix" key={user._id} onClick={() => {
                                                    const roomName = [localStorage.getItem('name'), user.name]
                                                    const nameRoom = roomName.sort().join('_')
                                                    socket.emit('join', nameRoom)
                                                    // Lind Development video call -->
                                                    socket.emit("room:join", { email: localStorage.getItem("name"), room: nameRoom });
                                                    // <-- Lind Development video call 

                                                    window.location.href = `/chat/${user._id}`;
                                                }}>
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                                                    <div className="about">
                                                        <div className="name">{user.name}</div>
                                                        <div className="status"> <i className={isOnline(user.socketId)}></i>{isOnline2(user.socketId)}</div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                    })}
                                </ul>
                            </div>
                            <div className="chat">
                                <div className="chat-history">
                                    <ul className="m-b-0 chat-height">
                                    </ul>
                                </div>
                                <div className="chat-message clearfix">
                                </div>
                            </div>
                            <GroupChatButton />
                            <LogOutButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}