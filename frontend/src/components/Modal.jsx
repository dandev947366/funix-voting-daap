import React from "react";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants/index";


import "bootstrap/dist/css/bootstrap.min.css";

import { Button, Form, Card, Nav, Stack, Navbar, Container } from 'react-bootstrap';

import "./Modal.css";

export const Modal = ({ onSubmit, onCancel, closeModal, children, proposal, setProposal, addProposal }) => {
  return (
    <>
      <div
        className="modal-container"
        onClick={(e) => {
          if (e.target.className === "modal-container")
            closeModal("Modal was closed");
        }}
      >
       <Card style={{ width: '45rem' }}>
      
      <Card.Body>
        <Card.Title>CREATE A NEW PROPOSAL</Card.Title>
        <Form>
              <Form.Group>
                <Form.Label>Proposal Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  value={proposal.title}
                  onChange={(e) =>
                    setProposal({ ...proposal, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group
               
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Descriptions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Description"
                  value={proposal.description}
                  onChange={(e) =>
                    setProposal({ ...proposal, description: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group
               
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>End Day</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="End in"
                  value={proposal.endsAt}
                  onChange={(e) =>
                    setProposal({ ...proposal, endsAt: e.target.value })
                  }
                />
                {/* <Form.Label>Owner: {proposal.director}</Form.Label> */}
               
              </Form.Group>
              <Button variant="primary" className="mt-3" onClick={addProposal}>
                Create Proposal
              </Button>
            </Form>
      </Card.Body>
  
          </Card>
      
      </div>
      

    </>
  
  );
};
