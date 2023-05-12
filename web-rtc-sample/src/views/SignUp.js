import React, { useEffect, useState } from 'react';
import '../assets/css/SignIn.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../stores/action/actionCreator';

export default function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formRegister, setFormRegister] = useState({})
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(register(formRegister))
        localStorage.setItem('name', formRegister.name)
        navigate('/signin')
    }

    const changeHandler = (e) => {
        const { name, value } = e.target
        setFormRegister({ ...formRegister, [name]: value })
    }
    return (
        <>
            <div className='d-flex justify-content-center align-items-center signin-container'>
                <div>
                    <button className='btn btn-light' onClick={() => { navigate('/signin') }}>Sign Up</button>
                    <form onSubmit={submitHandler}>
                        <h1 className='m-3'>SignUp</h1>
                        <div className="form-group m-3">
                            <label htmlFor="exampleInputEmail1">Username</label>
                            <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter username" onChange={changeHandler} name='name' />
                        </div>
                        <div className="form-group m-3">
                            <label htmlFor="exampleInputPassword1">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" onChange={changeHandler} name='password' />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}