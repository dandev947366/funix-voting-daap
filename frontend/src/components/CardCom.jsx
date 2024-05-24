import React from "react";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants/index";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Stack from "react-bootstrap/Stack";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import ListGroup from "react-bootstrap/ListGroup";
import {
  FaTrashCan,
  FaPencil,
  FaRegSquarePlus,
  FaArrowRightFromBracket
} from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import { FaArrowRightToBracket } from "react-icons/fa6";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { MdHowToVote } from "react-icons/md";
import {listdata} from '../data/listdata'
export const CardCom = () => {
  const [show, setShow] = useState(false);
  const target = useRef(null);
 const popover = (
 
    <Popover id="popover-basic">
      <Popover.Header as="h3">Please Connect Wallet</Popover.Header>
      <Popover.Body>
        Connect wallet to participate
      
      </Popover.Body>
    </Popover>

);

  const Example = () => (
    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
      <Button variant="success">Click me to see</Button>
    </OverlayTrigger>
  );

  return (
    <>
      <Stack gap={2} className="col-md-7 mx-auto mt-10">
        <h1>PROPOSAL LIST</h1>
        {listdata.map((item) => (
          <Card key={item.id} className="mt-4" style={{ border: '1px solid #7CA4BA', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}>

            <Card.Header style={{ background: '#09223b', color: '#D4E0E6', }}>{`#${item.id}`}</Card.Header>
            <Card.Body>
              <Card.Title style={{ color: '#E50D35', }}><MdHowToVote /> {item.title}</Card.Title>
              <Card.Text >{item.description}</Card.Text>
              <OverlayTrigger
  trigger="click"
  placement="right"
  overlay={popover}
>
  <Button variant="danger" className="mr-3 mt-3" style={{ background: '#FF4742', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}>
    No 0
  </Button>
</OverlayTrigger>
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button variant="success" className="mr-3 mt-3" style={{ background: '#27ae60', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}>
                  Yes 0
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button variant="outline-danger" className="mr-3 mt-3">
                  <FaTrashCan />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button variant="outline-warning" className="mr-3 mt-3">
                  <FaPencil />
                </Button>
              </OverlayTrigger>
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </>
  );
};
