import React, { useState, useEffect } from 'react';
import UploadToIPFS from './UploadToIPFS';

function CaseForm({ contract }) {
  const [caseId, setCaseId] = useState(null);
  const [title, setTitle] = useState(null);
  const [forensic, setForensic] = useState('');
  const [lawyer, setLawyer] = useState('');
  const [judge, setJudge] = useState('');
  const [cid, setCid] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  // Get current caseCounter from contract
  useEffect(() => {
    const fetchCaseId = async () => {
      if (contract) {
        const current = await contract.caseCounter();
        setCaseId(current.toString()); // Convert BigNumber to string
      }
    };
    fetchCaseId();
  }, [contract, creating]);

  const createCase = async () => {
    if (!forensic || !lawyer || !judge || !cid) {
      alert("All fields and IPFS upload are required");
      return;
    }

    try {
      setCreating(true);
      const tx = await contract.createCaseWithRolesAndEvidence(forensic, lawyer, judge, cid,title,description);

      await tx.wait();

      alert("✅ Case created successfully!");
      setForensic('');
      setLawyer('');
      setJudge('');
      setCid('');

    } catch (err) {
      console.error("Failed to create case:", err);
      alert("❌ Failed to create case");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card">
      <h3>👮 Create Case</h3>

      <input
        type="text"
        placeholder="Case ID"
        value={caseId !== null ? caseId : ''}
        readOnly
        className="input"
      />

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="Forensic Analyst Address"
        value={forensic}
        onChange={(e) => setForensic(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="Lawyer Address"
        value={lawyer}
        onChange={(e) => setLawyer(e.target.value)}
        className="input"
      />

      <input
        type="text"
        placeholder="Judge Address"
        value={judge}
        onChange={(e) => setJudge(e.target.value)}
        className="input"
      />

      <UploadToIPFS
        onUpload={(url) => {
          const extractedCid = url.split('/').pop();
          setCid(extractedCid);
        }}
      />

      <input
        type="text"
        placeholder="CID from IPFS"
        value={cid}
        readOnly
        className="input"
      />

      <textarea
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className='input'
      />


      <button onClick={createCase} disabled={creating} className="button">
        {creating ? 'Creating...' : 'Create Case to blockchain'}
      </button>
    </div>
  );
}

export default CaseForm;
