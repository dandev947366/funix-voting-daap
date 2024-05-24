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
import { MdHowToVote } from "react-icons/md";
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

export const ProposalList = ({
  proposals,
  currentTimestamp,
  vote,
  deleteProposal,
  addProposal,
  updateProposal,
  walletConnected,
  setProposal,
  editingProposalId,
  setEditingProposalId,
  getCurrentTimestamp
}) => {
  // const [editingProposalId, setEditingProposalId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState(0);
  
  
  
  return (
    <>
      {!editingProposalId && (
        <Stack gap={2} className="col-md-7 mx-auto mt-10">
          <h1>PROPOSAL LIST</h1>
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="mt-4" style={{ border: '1px solid #7CA4BA', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}>
              <Card.Header
                style={{ background: '#09223b', color: '#D4E0E6', }}
              >{`#${proposal.id}`}</Card.Header>
              <Card.Body>
                <Card.Title style={{ color: "#E50D35" }}>
                  <MdHowToVote />
                  Title: {proposal.title}
                </Card.Title>
                <Card.Text>{proposal.description}</Card.Text>

                <Card.Text>
                  End in :{" "}
                  {Math.round(
                    (parseInt(proposal.endsAt._hex) - currentTimestamp) / 60
                  ).toFixed(0)}{" "}
                  minutes
                </Card.Text>

                {/* <Card.Text>Current timestamp: {currentTimestamp}</Card.Text> */}
                <Button
                  variant="danger"
                  className="mr-3 mt-3"
                  onClick={() => vote(proposal.id, false)}
                  style={{ background: '#FF4742', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}
                >
                  No {proposal.noVotes.toNumber()}
                </Button>
                
                <Button
                  variant="success"
                  className="mr-3 mt-3"
                  style={{ background: '#27ae60', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}
                  onClick={() => vote(proposal.id, true)}
                >
                  Yes {proposal.yesVotes.toNumber()}
                </Button>

                <Button
                  variant="outline-danger"
                  className="mr-3 mt-3"
                  onClick={() => deleteProposal(proposal.id)}
                >
                  <FaTrashCan />
                </Button>
                <Button
                  variant="outline-warning"
                  className="mr-3 mt-3"
                  onClick={() =>
                    setEditingProposalId(parseInt(proposal.id.toString()))
                  }
                >
                  <FaPencil />
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Stack>
      )}

      {/* UPDATE PROPOSAL */}
      {walletConnected && editingProposalId && (
        <>
          <Stack gap={2} className="col-md-7 mx-auto mt-10">
          <Card  className="mt-20" style={{ border: '1px solid #7CA4BA', boxShadow: 'rgba(151, 65, 252, 0.2) 0 15px 30px -5px' }}>

          <Card.Header style={{ background: '#09223b', color: '#D4E0E6', }}> {`Proposal id: ${editingProposalId}`}</Card.Header>
              <Card.Body>
                <Card.Title>Update Proposal</Card.Title>

                <Form>
                  <Form.Group className="mb-3 mt-2">
                    <Form.Label>Proposal Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>Descriptions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Label>End Day</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="End in"
                      value={endsAt}
                      onChange={(e) => setEndsAt(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    className="mb-5 mt-4"
                    style={{ boxShadow: '#5E5DF0 0 10px 20px -10px',  background: '#5E5DF0',   width: '10rem', height:'3rem' }}
                    onClick={() =>
                      updateProposal(
                        editingProposalId,
                        title,
                        description,
                        endsAt
                      )
                    }
                  >
                    Update Proposal
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Stack>
        </>
      )}
    </>
  );
};




