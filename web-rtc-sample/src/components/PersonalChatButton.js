import { useNavigate } from "react-router-dom"

export default function PersonalChatButton (){
    const navigate = useNavigate()

    return(
        <button className="btn btn-success" onClick={() => {
            navigate('/')
        }}>Personal Chat</button>
    )
}