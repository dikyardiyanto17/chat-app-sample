import '../assets/css/Chat.css'
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers } from "../stores/action/actionCreator"

export default function ChatNotSelected({ socket }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const users = useSelector((state) => state.users.users)
    const [updateUsers, setUpdateUsers] = useState(0)
    const isOnline = (socketId) => socketId ? "fa fa-circle online" : "fa fa-circle offline"
    const isOnline2 = (socketId) => socketId ? "Online" : "Offline"

    useEffect(() => {
        dispatch(getUsers())
        socket.on("updating users", (data) => {
            setUpdateUsers(updateUsers + 1)
        })
    }, [updateUsers])
    useEffect(() => {
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
                                    {users &&
                                        <>
                                            {users.map((user) => {
                                                if (user.name != localStorage.getItem("name")) {
                                                    return (
                                                        <li className="clearfix" key={user._id} onClick={() => {
                                                            const roomName = [localStorage.getItem('name'), user.name]
                                                            const nameRoom = roomName.sort().join('_')
                                                            socket.emit('join', nameRoom)
                                                            window.location.href = `/chat/${user._id}`;
                                                            console.log(nameRoom)
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
                                        </>}
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}