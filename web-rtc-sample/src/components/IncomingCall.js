import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { createGroupChat, findGroup } from '../stores/action/actionCreator';

export default function IncomingCall({ socket, setIncomingCall }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(true);

    const handleClose = () => setIncomingCall(false);
    const handleShow = () => setIncomingCall(true);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Calling</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex justify-content-between'>
                    <Button variant="danger" onClick={handleClose}>
                        Reject
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Accept
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}
