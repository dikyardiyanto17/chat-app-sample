import { useEffect, useState } from 'react'
import '../assets/css/Chat.css'
import LogOutButton from "../components/LogOutButton"
import { useDispatch, useSelector } from 'react-redux'
import { findGroup, getUsers } from '../stores/action/actionCreator'
import ModalNewGroups from '../components/ModalNewGroups'
import PersonalChatButton from '../components/PersonalChatButton'

export default function GroupChatNotSelected({ socket }) {
    const dispatch = useDispatch()
    const rooms = useSelector((state) => state.rooms.rooms)
    const listRoom = useState([])
    useEffect(() => {
        dispatch(findGroup())
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
                                    {rooms &&
                                        <>
                                            {rooms?.map((room) => {
                                                return (
                                                    <li className="clearfix" key={room._id} onClick={() => {
                                                        dispatch(getUsers())
                                                        socket.emit('join', room._id)
                                                        window.location.href = `/groupchat/${room._id}`;
                                                    }}>
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="avatar" />
                                                        <div className="about">
                                                            <div className="name">{room.name}</div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </>}
                                </ul>
                            </div>
                            <div className="chat">
                                <div className="chat-history">
                                    <ul className="m-b-0 chat-height">

                                    </ul>
                                </div>
                            </div>
                            <div className="chat-message clearfix">
                            </div>
                            <ModalNewGroups />
                            <PersonalChatButton />
                            <LogOutButton />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}