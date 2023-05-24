import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function VideoCall({ socket, calling, setCalling, rejectCall }) {

    const handleClose = () => rejectCall();
    const handleShow = () => setCalling(true);

    console.log(calling)

    return (
        <>
            <small onClick={handleShow}><i className='fa fa-phone'></i></small>

            <Modal show={calling} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Calling</Modal.Title>
                </Modal.Header>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="danger" onClick={handleClose}>
                        End Call
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
