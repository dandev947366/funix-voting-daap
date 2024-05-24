//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 voteCount;
        uint256 yesVotes;
        uint256 noVotes;
        bool isDeleted;
        uint256 endsAt;
        uint256 startsAt;
      
    }

    address public owner;
    mapping(uint256 => mapping(address => bool)) private hasVotedForProposal; //Mapping of proposal IDs to whether an address has voted for that proposal
    event ProposalAdded(
        uint256 id,
        string title,
        string description,
        uint256 voteCount,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 endsAt,
        uint256 startsAt 
    );
    event ProposalUpdated(
        uint256 id,
        string title,
        uint256 endsAt
    );

    // The Proposal[] public proposals line creates an array called proposals that will store all of the Proposal objects.
    Proposal[] public proposals;

    constructor() {
        owner = msg.sender;
    }

    // constructor() {}
    modifier nonEmptyString(string memory str) {
        require(bytes(str).length > 0, "String cannot be empty");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Must be owner");
        _;
    }
   
    function addProposal(
        string memory _title,
        string memory _description,
        uint256 _endsAt
    )
        public
        nonEmptyString(_title)
        nonEmptyString(_description)
        
    {
        Proposal memory newProposal = Proposal({
            id: uint256(proposals.length),
            title: _title,
            description: _description,
            voteCount: 0,
            yesVotes: 0,
            noVotes: 0,
            isDeleted: false,
            endsAt: ( _endsAt * 3600 ) + block.timestamp, // endsAt : hour unit
            startsAt: block.timestamp
       
        });
        proposals.push(newProposal);
        emit ProposalAdded(
            newProposal.id,
            newProposal.title,
            newProposal.description,
            newProposal.voteCount,
            newProposal.yesVotes,
            newProposal.noVotes,
            newProposal.endsAt,
            newProposal.startsAt
        );
    }

    function vote(uint256 _proposalId, bool _yesVote) public
    {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        require(
            !hasVotedForProposal[_proposalId][msg.sender],
            "You have already voted for this proposal"
        );
  
        if (_yesVote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }
        proposals[_proposalId].voteCount++;
        hasVotedForProposal[_proposalId][msg.sender] = true;
    }

    function getProposalVotes(uint256 _proposalId)
        public
        view
        returns (uint256 yesVotes, uint256 noVotes)
    {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        return (
            proposals[_proposalId].yesVotes,
            proposals[_proposalId].noVotes
        );
    }

    function updateProposal(
    uint256 _proposalId,
    string memory _title,
    string memory _description,
    uint256 _endsAt
) public onlyOwner {
    require(_proposalId < proposals.length, "Invalid proposal ID");
    require(!proposals[_proposalId].isDeleted, "Proposal is deleted");
    require(proposals[_proposalId].voteCount == 0, "Proposal has votes already");
    require(
        _endsAt > 0,
        "Hour must be greater than 0"
    );

    Proposal storage proposal = proposals[_proposalId];
    proposal.title = _title;
    proposal.description = _description;
    proposal.endsAt = ( _endsAt * 3600 ) + block.timestamp;
}

    function deleteProposal(uint256 _proposalId) public onlyOwner {
        require(_proposalId < proposals.length, "Invalid proposal ID");

        // Remove the proposal from the array
        delete proposals[_proposalId];
        proposals[_proposalId].isDeleted = true;
    }

    function getProposals() public view returns (Proposal[] memory) {
        uint256 nonDeletedCount = 0;

        // Count the number of non-deleted proposals
        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].isDeleted) {
                nonDeletedCount++;
            }
        }

        // Initialize the memory array with the correct size
        Proposal[] memory nonDeletedProposals = new Proposal[](nonDeletedCount);

        // Populate the new array with non-deleted proposals
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].isDeleted) {
                nonDeletedProposals[currentIndex++] = proposals[i];
            }
        }

        return nonDeletedProposals;
    }
    
    function getCurrentTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}
