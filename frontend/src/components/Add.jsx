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

import {
  getProviderOrSigner,
  addProposal,
  getProposals,
  vote,
  deleteProposal,
  handleConnectWallet,
  connectWallet,
  handleHomeClick

} from '../blockchain'



export const Add = ({proposals}) => {
  return (
    
 <>
 Add
          <Stack gap={2} className="col-md-9 mx-auto mt-10">
            <h1>Funix Voting Daap</h1>

            <Form>
              <Form.Group className="mb-3">
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
                className="mb-3"
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
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>End Day</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="End in"
                  value={proposal.title}
                  onChange={(e) =>
                    setProposal({ ...proposal, title: e.target.value })
                  }
                />
              </Form.Group>
              <Button variant="outline-success" onClick={addProposal}>
                Create Proposal
              </Button>
            </Form>
          </Stack>
        </>

  )}