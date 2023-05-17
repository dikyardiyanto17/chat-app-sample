import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { createGroupChat, findGroup } from '../stores/action/actionCreator';

export default function ModalNewGroups() {
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
        dispatch(createGroupChat({roomName: groupName, creator: localStorage.getItem("name")})).then((data) => {
            dispatch(findGroup())
        })
    }
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                New Group
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Group</Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitHandler}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Group Name"
                                autoFocus
                                onChange={changeHandler}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose} type='submit'>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
