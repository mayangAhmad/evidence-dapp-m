// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EvidenceManager {
    struct Evidence {
        string ipfsHash;
        address submittedBy;
        bool verified;
    }

    mapping(uint => Evidence) public evidences;
    uint public evidenceCounter;

    event EvidenceSubmitted(uint id, address indexed user, string ipfsHash);
    event EvidenceVerified(uint id, address indexed user);

    function submitEvidence(string memory _ipfsHash) public {
        evidences[evidenceCounter] = Evidence(_ipfsHash, msg.sender, false);
        emit EvidenceSubmitted(evidenceCounter, msg.sender, _ipfsHash);
        evidenceCounter++;
    }

    function verifyEvidence(uint _id) public {
        require(_id < evidenceCounter, "Invalid ID");
        evidences[_id].verified = true;
        emit EvidenceVerified(_id, msg.sender);
    }

    function getEvidence(uint _id) public view returns (string memory, address, bool) {
        require(_id < evidenceCounter, "Invalid ID");
        Evidence memory e = evidences[_id];
        return (e.ipfsHash, e.submittedBy, e.verified);
    }

    function evidenceCount() public view returns (uint) {
        return evidenceCounter;
    }
}
