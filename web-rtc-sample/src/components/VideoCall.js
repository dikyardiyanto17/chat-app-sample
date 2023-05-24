import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { createGroupChat, findGroup } from '../stores/action/actionCreator';

export default function VideoCall({ socket }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [groupName, setGroupName] = useState("")

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const changeHandler = (e) => {
        setGroupName(e.target.value)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createGroupChat({ roomName: groupName, creator: localStorage.getItem("name") })).then((data) => {
            dispatch(findGroup())
        })
    }
    return (
        <>
            <small onClick={handleShow}><i className='fa fa-phone'></i></small>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Calling</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <video style={{ backgroundColor: 'black' }}></video>
                        <video style={{ backgroundColor: 'blue' }}></video>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
