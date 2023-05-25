import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CallUser({ socket, calling, setCalling, rejectCall }) {

    const handleClose = () => rejectCall()
    const handleShow = () => {
        setCalling(true)
    };

    // console.log(calling)

    return (
        <>
            <Modal show={calling} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Calling</Modal.Title>
                </Modal.Header>
                <Modal.Footer className='d-flex justify-content-center'>
                    <Button variant="danger" onClick={() => {
                        setCalling(false)
                    }}>
                        End Call
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
