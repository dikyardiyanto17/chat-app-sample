import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function VideoCall({ socket, isCalling, setIsCalling, remoteStream, myStream, endCalling }) {

    const handleClose = () => setIsCalling(false)
    const handleShow = () => {
        setIsCalling(true)
    };

    return (
        <>
            <Modal show={isCalling} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Calling</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <video style={{ backgroundColor: 'red' }} url={myStream}></video>
                    <video style={{ backgroundColor: 'blue' }} url={remoteStream}></video>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="danger" onClick={endCalling}>
                        End Call
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
