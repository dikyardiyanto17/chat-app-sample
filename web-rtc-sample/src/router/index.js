import { createBrowserRouter } from "react-router-dom";
import { redirect } from "react-router-dom";
import Home from "../views/Home";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import socketIO from 'socket.io-client';
import { getUsers, updateSocketId } from "../stores/action/actionCreator"
import Chat from "../views/Chat";
import ChatNotSelected from "../views/ChatNotSelected";
import GroupChatNotSelected from "../views/GroupChatNotSelected";
import GroupChat from "../views/GroupChat";
const socket = socketIO.connect("http://localhost:2222/", {
    transports: ['polling', 'websocket'],
    transportOptions: {
        polling: {
            extraHeaders: {
                'X-Custom-Header-For-My-Project': 'will be used',
                token: localStorage.getItem("access_token")
            }
        }
    }
});
// const socket = socketIO("http://localhost:2222/", {autoConnect: false});

const router = createBrowserRouter([
    {
        path: "/",
        loader: () => {
            socket.emit('request socketid', "request")
            socket.on("send socketid", (data) => {
                updateSocketId(data)
                getUsers()
            })
            if (!localStorage.access_token) throw redirect('/signin')
            return null
        },
        children: [
            {
                path: 'chat/:chatto',
                element: <Chat socket={socket} />
            },
            {
                path: '',
                element: <ChatNotSelected socket={socket} />
            },
            {
                path: 'groupchat',
                element: <GroupChatNotSelected socket={socket} />
            },
            {
                path: 'groupchat/:room',
                element: <GroupChat socket={socket}/>
            }
        ]
    },
    {
        path: "/",
        loader: () => {
            if (localStorage.access_token) throw redirect('/')
            return null
        },
        children: [
            {
                path: "signin",
                element: (
                    <SignIn socket={socket} />
                ),
            },
            {
                path: 'signup',
                element: (
                    <SignUp socket={socket} />
                )
            }
        ]
    },
]);

export default router;