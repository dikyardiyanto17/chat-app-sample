import '../assets/css/Chat.css'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getUsers, findUser } from "../stores/action/actionCreator"
export default function ListUsers({ userInfo, socket }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { chatto } = useParams()

    const isOnline = (socketId) => socketId ? "fa fa-circle online" : "fa fa-circle offline"
    const isOnline2 = (socketId) => socketId ? "Online" : "Offline"
    const isActive = (id, compareId) => id == compareId ? "clearfix active" : "clearfix"
    return (
        <>
            {userInfo.name != localStorage.getItem("name") && (
                <li className={isActive(userInfo._id, chatto)} key={userInfo._id} onClick={() => {
                    dispatch(findUser(userInfo._id))
                    const roomName = [localStorage.getItem('name'), userInfo.name]
                    const nameRoom = roomName.sort().join('_')
                    socket.emit('join', nameRoom)
                    navigate(`/chat/${userInfo._id}`)
                    console.log(nameRoom)
                }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                    <div className="about">
                        <div className="name">{userInfo.name}</div>
                        <div className="status"> <i className={isOnline(userInfo.socketId)}></i>{isOnline2(userInfo.socketId)}</div>
                    </div>
                </li>
            )}
        </>
    )
}