import { useNavigate } from "react-router-dom"

export default function LogOutButton (){
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
    }
    return(
        <button className="btn btn-danger" onClick={() => {
            logout()
            navigate('/signin')
        }}>Log Out</button>
    )
}