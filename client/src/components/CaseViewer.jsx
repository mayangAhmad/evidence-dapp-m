import React, { useEffect, useState } from 'react';
import UploadToIPFS from './UploadToIPFS';

function CaseViewer({ contract, currentAccount }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const count = await contract.caseCounter();
      const all = [];

      for (let i = 0; i < count; i++) {
        const data = await contract.getCase(i);
        const evidences = await contract.getEvidenceCIDs(i);
        const [police, forensic, lawyer, judge, report, verified] = data;

        const lowerAccount = currentAccount.toLowerCase();
        const isAssigned =
          police.toLowerCase() === lowerAccount ||
          forensic.toLowerCase() === lowerAccount ||
          lawyer.toLowerCase() === lowerAccount ||
          judge.toLowerCase() === lowerAccount;

        if (isAssigned) {
          all.push({
            id: i,
            police,
            forensic,
            lawyer,
            judge,
            report,
            verified,
            evidences,
          });
        }
      }

      setCases(all);
    };

    if (contract && currentAccount) {
      fetchCases();
    }
  }, [contract, currentAccount]);

  const handleReportUpload = async (caseId, cid) => {
    try {
      const tx = await contract.uploadForensicReport(caseId, cid);
      await tx.wait();
      alert('✅ Report uploaded!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('❌ Upload failed');
    }
  };

  const handleVerify = async (caseId) => {
    try {
      const tx = await contract.verifyReport(caseId);
      await tx.wait();
      alert('✅ Report verified!');
    } catch (err) {
      console.error('Verify failed:', err);
      alert('❌ Verification failed');
    }
  };

  return (
    <div className="card">
      <h3>📁 Your Assigned Cases</h3>
      {cases.length === 0 ? (
        <p>No cases assigned to this account.</p>
      ) : (
        <ul>
          {cases.map((c) => (
            <li key={c.id} style={{ marginBottom: '1.5rem' }}>
              <strong>Case #{c.id}</strong><br />
              Forensic: {c.forensic}<br />
              Lawyer: {c.lawyer}<br />
              Judge: {c.judge}<br />

              <div>
                <strong>Report CID:</strong>{' '}
                {c.report ? (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${c.report}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.report}
                  </a>
                ) : currentAccount.toLowerCase() === c.forensic.toLowerCase() ? (
                  <UploadToIPFS
                    onUpload={(url) => {
                      const cid = url.split('/').pop();
                      handleReportUpload(c.id, cid);
                    }}
                  />
                ) : (
                  'N/A'
                )}
              </div>

              <div>
                <strong>Verified:</strong>{' '}
                {c.verified ? (
                  '✅'
                ) : currentAccount.toLowerCase() === c.judge.toLowerCase() &&
                  c.report ? (
                  <button onClick={() => handleVerify(c.id)}>Verify</button>
                ) : (
                  '❌'
                )}
              </div>

              <em>Evidences:</em>
              <ul>
                {c.evidences.map((cid, i) => (
                  <li key={i}>
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {cid}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CaseViewer;
