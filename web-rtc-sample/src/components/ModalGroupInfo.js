import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { createGroupChat, findGroup, leaveRoom } from '../stores/action/actionCreator';

export default function ModalGroupInfo({ roomData }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <h6 className="m-b-0" onClick={handleShow} style={{ cursor: 'pointer' }}>{roomData?.name}</h6>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h6 className="m-b-0">{roomData?.name}</h6>

                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <ul className="list-group">
                            {roomData?.participants?.map((user, index) => {
                                return (
                                    <li className="list-group-item" key={index}>{user}</li>
                                )
                            })}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='container'>
                            <div className="d-flex justify-content-between">
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={() => {
                                    dispatch(leaveRoom({ roomName: roomData.name, removeParticipant: localStorage.getItem("name") })).then((_) => {
                                        dispatch(findGroup())
                                    })
                                }}>
                                    Leave
                                </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
