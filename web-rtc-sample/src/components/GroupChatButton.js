import { useNavigate } from "react-router-dom"

export default function GroupChatButton (){
    const navigate = useNavigate()

    return(
        <button className="btn btn-success" onClick={() => {
            navigate('/groupchat')
        }}>Group Chat</button>
    )
}