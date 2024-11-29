import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "./constants";
import { Modal } from "./components/Modal";
import { createPortal } from "react-dom";
import { ProposalList } from "./components/ProposalList";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./assets/logo.png";
import { CardCom } from "./components/CardCom";
import Placeholder from "react-bootstrap/Placeholder";
import ListGroup from "react-bootstrap/ListGroup";
import {
  Button,
  Form,
  Card,
  Nav,
  Stack,
  Navbar,
  Container
} from "react-bootstrap";
import {
  FaTrashCan,
  FaPencil,
  FaRegSquarePlus,
  FaArrowRightFromBracket
} from "react-icons/fa6";
import map from './map.jpg';
const App = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [owner, setOwner] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [proposal, setProposal] = useState({
    title: "",
    description: "",
    endsAt: 0
  });
  const [proposals, setProposals] = useState([]);
  const [reversedProposals, setReversedProposals] = useState([]);
  const [renderHandler, setRenderHandler] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProposalId, setEditingProposalId] = useState(null); //UPDATE PROPOSAL-PROPOSALLIST
  //CONNECT WALLET
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    console.log("provider", provider);
    console.log("web3Provider", web3Provider);

    // If user is not connected to the OP network, let them know and throw an error
    // const OP_CHAINID = 11155420;
    const OP_CHAINID = 10;
    const LOCAL_HOST_CHAINID = 31337;
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== OP_CHAINID) {
      window.alert("Change the network to OP_CHAINID");
      throw new Error("Change the network to OP_CHAINID");
    }
    console.log("chainId", chainId);

    if (needSigner) {
      const signer = web3Provider.getSigner();
      console.log("signer", signer);

      return signer;
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    const truncatedAddress =
      address.slice(0, 6) + "..." + address.slice(38, 42);
    setAddress(truncatedAddress);
    console.log("address", address);
    return web3Provider;
  };

  useEffect(() => {
    getProposals();
    getProviderOrSigner();
    getCurrentTimestamp();
  }, [walletConnected, renderHandler]);

  const addProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const tx = await contract.addProposal(
        proposal.title,
        proposal.description,
        proposal.endsAt
      );
      await tx.wait();
      setOwner(signer);
      console.log(signer);
      console.log("Proposal added successfully");
      setModalOpen(false);
      setRenderHandler(renderHandler + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const getProposals = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);
      const proposals = await contract.getProposals();
      console.log(proposals);
      setProposals(proposals);
      setReversedProposals([...proposals].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentTimestamp = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, provider);
      const timestamp = await contract.getCurrentTimestamp();

      setCurrentTimestamp(parseInt(timestamp.toString()));
      console.log("Current timestamp:", timestamp.toString());
    } catch (err) {
      console.error(err);
    }
  };
  const handleButtonClick = (value) => {
    setModalOpen(false);
    setMessage(value);
  };
  const vote = async (proposalId, yesVote) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      //vote is boolean
      const tx = await contract.vote(proposalId, yesVote);
      await tx.wait();
      window.alert("Vote added successfully");
      setRenderHandler(renderHandler + 1);
    } catch (err) {
      console.error(err);
    }
  };
  const updateProposal = async (_proposalId, _title, _description, _endsAt) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const gasLimit = 300000; // Adjust this value based on your contract's requirements
      const tx = await contract.updateProposal(
        _proposalId,
        _title,
        _description,
        _endsAt,
        {
          gasLimit: gasLimit
        }
      );
      await tx.wait();
      window.alert("Update proposal successfully");
      setEditingProposalId(null)
      setRenderHandler(renderHandler + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProposal = async (proposalId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

      const tx = await contract.deleteProposal(proposalId);
      await tx.wait();
      window.alert("Delete proposal successfully");
      setRenderHandler(renderHandler + 1);
    } catch (err) {
      window.alert("Only owner can delete proposal");
      console.error(err);
    }
  };
  const handleConnectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };
  const connectWallet = async () => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "opsepolia",
        providerOptions: {},
        disableInjectedProvider: false
      });

      handleConnectWallet();
    }
  };
  const handleHomeClick = () => {
    window.location.reload(); // Reload the page when Home link is clicked
  };

  const navLinkStyle = {
    color: "#F9055F"
  };

  const navLinkHoverStyle = {
    color: "#FF8C00" // Change to the desired hover color
  };

  return (
    <div style={{ backgroundImage: `url(${map})`, height: '100vh', backgroundSize: 'cover', }}>
      <Navbar style={{  background: '#09223b', color: '#E50D35'}}>
        <Container className="d-flex justify-content-between align-items-center">
          <Navbar.Brand href="/">
            <img
              src={logo}
              width={300}
              height={300}
              className="d-inline-block align-top"
              alt="Your Logo"
            />
          </Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link href="#home" style={{ color: "#E50D35" }}>
              Home
            </Nav.Link>

            <Nav.Link href="#features" style={{ color: "#D4E0E6" }}>Proposals</Nav.Link>
            <Nav.Link href="#pricing" style={{ color: "#D4E0E6" }}>Vote</Nav.Link>
          </Nav>

          <Button
            variant="outline-light"
            onClick={() => {
              if (!walletConnected) {
                alert("Please connect your wallet to create a proposal.");
              } else {
                setModalOpen(true);
              }
            }}
          >
            Create Proposal
          </Button>

          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {!walletConnected && (
                <Button
                  variant="primary"
                  className="mr-2"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {!walletConnected && <CardCom />}


       {/* PROPOSALSLIST COMPONENT */}
      {walletConnected && (
        <ProposalList
          proposals={proposals}
          currentTimestamp={currentTimestamp}
          vote={vote}
          deleteProposal={deleteProposal}
          addProposal={addProposal}
          updateProposal={updateProposal}
          walletConnected={walletConnected}
          setProposal={setProposal}
          editingProposalId={editingProposalId}
          setEditingProposalId={setEditingProposalId}
        />
      )}

      {/* CREATE PROPOSAL POPUP MODAL */}
      <div>
        {modalOpen &&
          walletConnected &&
          createPortal(
            <Modal
              closeModal={handleButtonClick}
              onSubmit={handleButtonClick}
              onCancel={handleButtonClick}
              proposal={proposal}
              setProposal={setProposal}
              addProposal={addProposal}

            >
              Create Proposal
            </Modal>,
            document.body
          )}
      </div>
      {/* END CREATE PROPOSAL POPUP MODAL */}




    </div>
  );
};

export default App;
