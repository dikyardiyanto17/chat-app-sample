import { useEffect, useState } from 'react'
import '../assets/css/Chat.css'
import LogOutButton from "../components/LogOutButton"
import { useDispatch, useSelector } from 'react-redux'
import { findGroup, findTheGroup } from '../stores/action/actionCreator'
import ChatBarGroup from '../components/ChatBarGroup'
import { useNavigate, useParams } from 'react-router-dom'
import ListRooms from '../components/ListRoom'

export default function GroupChat({ socket }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const rooms = useSelector((state) => state.rooms.rooms)
    const [roomData, setRoomData] = useState({})
    const { room } = useParams()
    const listRoom = useState([])
    useEffect(() => {
        dispatch(findGroup())
        dispatch(findTheGroup(room)).then((data) => {
            setRoomData(data)
        })
        socket.emit('join', room)
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
                                    {rooms &&
                                        <>
                                            {rooms?.map((room) => {
                                                return (
                                                    <ListRooms key={room._id} socket={socket} roomInfo={room} />
                                                )
                                            })}
                                        </>}
                                </ul>
                            </div>
                            <ChatBarGroup socket={socket} roomData={roomData} />
                            <LogOutButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}