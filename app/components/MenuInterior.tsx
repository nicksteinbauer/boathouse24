import { useState } from 'react';

import { Link } from '@remix-run/react';

import Modal from 'react-bootstrap/Modal';
// import { Button } from 'react-bootstrap';

import MainForm from './MainForm';

function MenuInterior() {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
    return (
        <>
        <ul className="flex-md navUl">
            <li className="flex-vertical home">
                <Link to="/pages/about">About</Link>
            </li>
            <li className="flex-vertical home">
                <Link to="/pages/products">Products</Link>
            </li>
            <li className="flex-vertical home">
                <Link reloadDocument to="/pages/location">Location</Link>
            </li>
            <li className="flex-vertical home">
                <Link to="/pages/contact">Contact Us</Link>
            </li>
            <li className="flex-vertical">
                <button className="reserveButton" onClick={handleShow}>
                    <span>Reserve Now</span>
                </button>
            </li>
        </ul>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Make Reservation</Modal.Title>
            </Modal.Header>
            <Modal.Body><MainForm /></Modal.Body>
        </Modal>
    </>
    );
}


export default MenuInterior;
