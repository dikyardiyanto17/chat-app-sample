import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { addParticipants, findGroup, findTheGroup, getUsers, leaveRoom } from '../stores/action/actionCreator';
import { useParams } from 'react-router-dom';

export default function ModalGroupInfo({ roomData, users, setRoomData, socket }) {
    const dispatch = useDispatch()
    const [notMembers, setNonMember] = useState([])
    const [showInfo, setShowInfo] = useState(false);
    const handleClose = () => setShowInfo(false);
    const handleShow = () => setShowInfo(true);
    const { room } = useParams()

    const getNonMembers = (allUsers, members) => {
        const nonMembers = allUsers.filter(user => !members.includes(user.name));
        return nonMembers;
    }


    useEffect(() => {
        dispatch(getUsers())
        if (users && roomData) {
            setNonMember(getNonMembers(users, roomData.participants))
        }
    }, [showInfo, roomData])


    return (
        <>
            <h6 className="m-b-0" onClick={handleShow} style={{ cursor: 'pointer' }}>{roomData?.name}</h6>
            <Modal show={showInfo} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h6 className="m-b-0">{roomData?.name}</h6>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <h3>Members</h3>
                        <ul className="list-group">
                            {roomData?.participants?.map((user, index) => {
                                return (
                                    <li className="list-group-item" key={index}>{user}</li>
                                )
                            })}
                        </ul>
                        {notMembers.length != 0 &&
                            <>
                                <h3>Add Members</h3>
                                <ul className="list-group">
                                    {notMembers?.map((user, index) => {
                                        return (
                                            <li className="list-group-item d-flex justify-content-between align-items-center" key={index}><span>{user.name}</span><span><button type='button' className='btn btn-success' onClick={() => {
                                                dispatch(addParticipants({ newParticipant: user.name, roomName: roomData.name, roomId: roomData._id })).then((_) => {
                                                    socket.emit('add participant', 'Hello world')
                                                })
                                            }}>Add</button></span></li>
                                        )
                                    })}
                                </ul>
                            </>
                        }
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
                                        socket.emit("add participant", "HELLO WORLD")
                                        window.location.href = `/groupchat`;
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
