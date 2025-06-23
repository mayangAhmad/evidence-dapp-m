// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract CaseManager {
    struct Case {
        address police;
        address forensic;
        address lawyer;
        address judge;
        string title;
        string description
        string[] evidenceCIDs;
        string forensicReport;
        bool reportVerified;
    }

    uint public caseCounter;
    mapping(uint => Case) public cases;

    event CaseCreated(
        uint caseId,
        address indexed police,
        address indexed forensic,
        address indexed lawyer,
        address judge,
        string initialEvidence
    );

    event EvidenceAdded(uint indexed caseId, string cid);
    event ForensicReportUploaded(uint indexed caseId, string reportCid);
    event ReportVerified(uint indexed caseId);

    modifier onlyAssigned(uint _caseId, address _expected) {
        require(msg.sender == _expected, "Not authorized for this action");
        _;
    }

    function createCaseWithRolesAndEvidence(
        address _forensic,
        address _lawyer,
        address _judge,
        string memory _title,
        string memory _description,
        string[] memory _evidenceCIDs
    ) external {
        Case storage newCase = cases[caseCounter];
        newCase.police = msg.sender;
        newCase.forensic = _forensic;
        newCase.lawyer = _lawyer;
        newCase.judge = _judge;
        newCase.title = _title;
        newCase.description = _description;

        for (uint i = 0; i < _evidenceCIDs.length; i++) {
            newCase.evidenceCIDs.push(_evidenceCIDs[i]);
            emit EvidenceAdded(caseCounter, _evidenceCIDs[i]);
        }

        emit CaseCreated(caseCounter, msg.sender, _forensic, _lawyer, _judge, _evidenceCIDs.length > 0 ? _evidenceCIDs[0] : "");
        caseCounter++;
    }

    function addEvidenceToCase(uint _caseId, string memory _cid)
        external
        onlyAssigned(_caseId, cases[_caseId].police)
    {
        cases[_caseId].evidenceCIDs.push(_cid);
        emit EvidenceAdded(_caseId, _cid);
    }

    function uploadForensicReport(uint _caseId, string memory _reportCid)
        external
        onlyAssigned(_caseId, cases[_caseId].forensic)
    {
        cases[_caseId].forensicReport = _reportCid;
        emit ForensicReportUploaded(_caseId, _reportCid);
    }

    function verifyReport(uint _caseId)
        external
        onlyAssigned(_caseId, cases[_caseId].judge)
    {
        require(bytes(cases[_caseId].forensicReport).length > 0, "No report to verify");
        cases[_caseId].reportVerified = true;
        emit ReportVerified(_caseId);
    }

    // View functions
    function getEvidenceCIDs(uint _caseId) external view returns (string[] memory) {
        return cases[_caseId].evidenceCIDs;
    }

    function getCase(uint _caseId)
        external
        view
        returns (
            address police,
            address forensic,
            address lawyer,
            address judge,
            string memory forensicReport,
            bool reportVerified
        )
    {
        Case memory c = cases[_caseId];
        return (c.police, c.forensic, c.lawyer, c.judge, c.forensicReport, c.reportVerified);
    }
}
