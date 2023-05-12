import React, { useEffect, useState } from 'react';
import '../assets/css/SignIn.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../stores/action/actionCreator';

export default function SignIn({ socket }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formLogin, setFormLogin] = useState({})
    const submitHandler = (e) => {
        e.preventDefault()
        localStorage.setItem('name', formLogin.name)
        setFormLogin({ ...formLogin, socketId: socket.id })
        dispatch(login(formLogin)).then((_) => {
            socket.emit('save socketid', "Hello")
            navigate('/')
        })
    }

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormLogin({ ...formLogin, [name]: value })
    }
    return (
        <>
            <div className='d-flex justify-content-center align-items-center signin-container'>
                <div>
                    <button className='btn btn-light' onClick={() => { navigate('/signup') }}>Sign Up</button>
                    <form onSubmit={submitHandler}>
                        <h1 className='m-3'>SignIn</h1>
                        <div className="form-group m-3">
                            <label for="exampleInputEmail1">Username</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" onChange={changeHandler} name='name' />
                        </div>
                        <div className="form-group m-3">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={changeHandler} name='password' />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}