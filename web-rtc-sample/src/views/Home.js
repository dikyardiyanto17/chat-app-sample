import { useNavigate } from "react-router-dom"
import '../assets/css/Home.css'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUsers } from "../stores/action/actionCreator"

export default function Home({ socket }) {
    const users = useSelector((state) => state.users.users)
    const [updateUsers, setUpdateUsers] = useState(0)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isOnline = (data) => data ? "btn btn-primary" : "btn btn-secondary"
    useEffect(() => {
        dispatch(getUsers())
        socket.on("updating users", (data) => {
            setUpdateUsers(updateUsers + 1)
        })
    }, [updateUsers, socket])
    return (
        <>
            <div className="container-fluid container-home d-flex justify-content-center">
                <div>
                    <h1>Online Users</h1>
                    {users && <>
                        {users?.map((user, index) => {
                            return (
                                <>
                                    {user.name !== localStorage.getItem("name") && (
                                        <button type="button" className={isOnline(user.socketId)} key={user._id} onClick={() => {
                                            const roomName = [localStorage.getItem('name'), user.name]
                                            const nameRoom = roomName.sort().join('_')
                                            socket.emit('join', nameRoom)
                                            navigate(`/chat/${user._id}`)
                                        }}>{user.name}</button>
                                    )}
                                </>
                            )
                        })}
                    </>}
                </div>
            </div>
        </>
    )
}