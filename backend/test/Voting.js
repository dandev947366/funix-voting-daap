const { expect } = require("chai");
const { ethers } = require("hardhat");
const chai = require("chai");
// const { BigNumber } = ethers;
// const chaiAsPromised = require("chai-as-promised");
// const { solidity } = require("ethereum-waffle");
// const { expectRevert } = require("@openzeppelin/test-helpers");

// chai.use(solidity);
// chai.use(chaiAsPromised);

describe("Voting contract", function () {
  let Voting;
  let voting;
  let deployer, voter1, voter2;
  const title = "New proposal";
  const description = "This is a new proposal.";
  const secondTitle = "This is 2nd proposal title.";
  const secondDesc = "This is 2nd proposal Description."
  const endsAt = 36000;

  beforeEach(async function () {
    [deployer, voter1, voter2] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });
  
  it("should initialize with zero proposals", async function () {
    const proposals = await voting.getProposals();
    expect(proposals.length).to.equal(0);
    expect(proposals).to.be.an("array").that.is.empty;
  });
  
  describe("Add Proposal Functions", function () {
   
    it("should add a new proposal", async function () {
      await voting.addProposal(title, description, endsAt);
  
      const proposals = await voting.getProposals();
  
     
      expect(proposals.length).to.equal(1);
     
      const proposal = proposals[0];
  
      expect(proposal.title).to.equal(title);
      expect(proposal.description).to.equal(description);
      expect(proposal.voteCount).to.equal(0);
      expect(proposal.yesVotes).to.equal(0);
      expect(proposal.noVotes).to.equal(0);
      expect(proposal.isDeleted).to.equal(false);
    it("should revert if the title is empty", async function () {
      await expect(
        voting.addProposal("", description, endsAt)
      ).to.be.revertedWith("String cannot be empty");
    });
    it("should revert if the description is empty", async function () {
      await expect(voting.addProposal(title, "", endsAt)).to.be.revertedWith(
        "String cannot be empty"
      );
    });
  });
  
  
    describe("Vote Functions", function () {
    it("should allow a user to vote yes", async function () {
      await voting.addProposal(title, description, endsAt);
      await voting.connect(voter1).vote(0, true);
      const proposals = await voting.getProposals();
      const proposal = proposals[0];
      expect(proposal.yesVotes).to.equal(1);
      expect(proposal.noVotes).to.equal(0);
      expect(proposal.voteCount).to.equal(1);
    });
  
    
    it("should revert if a user has already voted", async function () {
      await voting.addProposal(title, description, endsAt);
      await voting.connect(voter1).vote(0, true);

      await voting.vote(0, true);
      await expect(voting.vote(0, true)).to.be.rejectedWith(
        "You have already voted for this proposal"
      );
    });

    it("user should be able to vote on a different proposal", async function () {
      // Add two proposals
      await voting.addProposal(title, description, endsAt);
      await voting.addProposal(secondTitle, secondDesc, endsAt);
    
      // Vote on the first proposal
      await voting.vote(0, true);
    
      // Attempt to vote again on the first proposal, which should revert
      await expect(voting.vote(0, true)).to.be.revertedWith(
        "You have already voted for this proposal"
      );
    
      // Vote on the second proposal
      await voting.vote(1, true);
    
      // Verify the state of the second proposal
      const proposal = await voting.proposals(1);
      expect(proposal.id).to.equal(1);
      expect(proposal.title).to.equal(secondTitle);
      expect(proposal.description).to.equal(secondDesc);
      expect(proposal.voteCount).to.equal(1);
      expect(proposal.yesVotes).to.equal(1);
      expect(proposal.noVotes).to.equal(0);
    });
  });
  
  describe("Get Proposals Function", function () {
    it("should return a proposal", async function () {
      await voting.addProposal(title, description, endsAt);
      const proposals = await voting.getProposals();
      expect(proposals).to.be.an("array").with.lengthOf(1);
    });
  });
  
  describe("Update Functions", function () {
    it("should update a proposal", async function () {
      // Add a new proposal
      await voting.addProposal(title, description, endsAt);
      const proposals = await voting.getProposals();
      const proposalId = proposals[0].id;

      // Update the proposal
      const newTitle = "Updated proposal";
      const newDescription = "This is the updated proposal.";
      const newEndsAt = endsAt + 600; // Extend end time by 10 minutes
      await voting
        .connect(deployer)
        .updateProposal(proposalId, newTitle, newDescription, newEndsAt);

      // Get the updated proposal
      const updatedProposal = await voting.proposals(proposalId);

      // Assert that the proposal has been updated correctly
      expect(updatedProposal.title).to.equal(newTitle);
      expect(updatedProposal.description).to.equal(newDescription);
    
    });
 
    it("should revert if the proposal ID is invalid", async function () {
      await voting.addProposal(title, description, endsAt);

      await expect(
        voting
          .connect(deployer)
          .updateProposal(999, "New title", "New description", 600)
      ).to.be.revertedWith("Invalid proposal ID");
    });
    
  });  
   
  describe("Delete Proposal Function", function () {
    it("should delete a proposal", async function () {
      await voting.addProposal(title, description, endsAt);
      await voting.deleteProposal(0);
      const proposal = await voting.proposals(0);
      expect(proposal.isDeleted).to.be.true;
    });

    it("should revert if the proposal is deleted", async function () {
      await voting.addProposal(title, description, endsAt);
      const proposals = await voting.getProposals();
      const proposalId = proposals[0].id;
      await voting.connect(deployer).deleteProposal(proposalId);

      await expect(
        voting
          .connect(deployer)
          .updateProposal(
            proposalId,
            "New title",
            "New description",
            endsAt
          )
      ).to.be.revertedWith("Proposal is deleted");
    });
  });
});

describe("Get Proposal Votes", function () {
  it("should return correct votes for a proposal", async function () {
      await voting.addProposal(title, description, endsAt);
      const proposals = await voting.getProposals();
      const proposalId = proposals[0].id;
     
      
      await voting.vote(proposalId, true, { from: voter1 });

      const { yesVotes, noVotes } = await voting.getProposalVotes(proposalId);
      expect(yesVotes).to.equal(1); 
      expect(noVotes).to.equal(0); 
      
      console.log("Fail to get voters to vote")
  });

  it("should revert with invalid proposal ID", async function () {
      // Attempt to get votes for a non-existing proposal
      await expect(voting.getProposalVotes(999)).to.be.revertedWith("Invalid proposal ID");
  });
  describe("Get Current Time Stamp", function () {
    it("should return current time stamp", async function () {
    
    const timestamp = await voting.getCurrentTimestamp();
    // console.log("Current timestamp:", timestamp);
  
    });
  
  });
  
});
  
  
  
  
  
  
  
  
  
  
});
