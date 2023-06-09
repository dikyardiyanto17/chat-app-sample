import { useNavigate, useParams } from 'react-router-dom'
import '../assets/css/Chat.css'
import { findGroup, findTheGroup } from '../stores/action/actionCreator'
import { useDispatch } from 'react-redux'
export default function ListRooms({ roomInfo, socket, setRoomData }) {
    const { room } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isActive = (id, compareId) => id == compareId ? "clearfix active" : "clearfix"
    return (
        <>
            {roomInfo.name != localStorage.getItem("name") && (
                <li className={isActive(roomInfo._id, room)} key={roomInfo._id} onClick={() => {
                    dispatch(findGroup())
                    dispatch(findTheGroup(roomInfo._id)).then((data) => setRoomData(data))
                    socket.emit('join', roomInfo._id)
                    navigate(`/groupchat/${roomInfo._id}`)
                }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                    <div className="about">
                        <div className="name">{roomInfo.name}</div>
                    </div>
                </li>
            )}
        </>
    )
}