import '../assets/css/Chat.css'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useLayoutEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers, findUser, findChat } from "../stores/action/actionCreator"
import ListUsers from '../components/ListUsers'
import ChatBar from '../components/ChatBar'
import LogOutButton from '../components/LogOutButton'
import GroupChatButton from '../components/GroupChatButton'

export default function Chat({ socket }) {
    const dispatch = useDispatch()
    const users = useSelector((state) => state.users.users)
    const [currentRoom, setCurrentRoom] = useState('')
    const [updateUsers, setUpdateUsers] = useState([])
    const { chatto } = useParams()


    useEffect(() => {
        socket.on("updating users", (data) => {
            setUpdateUsers(data)
            getUsers()
        })
    }, [])

    useEffect(() => {
        dispatch(findUser(chatto)).then((data) => {
            const roomName = [localStorage.getItem('name'), data.name]
            const nameRoom = roomName.sort().join('_')
            setCurrentRoom(nameRoom)
            socket.emit('join', nameRoom)
        })
        dispatch(findChat(chatto))
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
                                    {updateUsers &&
                                        <>
                                            {updateUsers.map((user) => {
                                                return (<ListUsers key={user._id} userInfo={user} socket={socket} currentRoom={currentRoom} setCurrentRoom={setCurrentRoom}/>)
                                            })}
                                        </>}
                                </ul>
                            </div>
                            <ChatBar socket={socket} />
                            <GroupChatButton />
                            <LogOutButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}