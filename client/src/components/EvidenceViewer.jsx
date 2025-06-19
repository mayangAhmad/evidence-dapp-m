import React, { useEffect, useState } from 'react';

function EvidenceViewer({ contract }) {
  const [evidences, setEvidences] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvidences = async () => {
    try {
      if (!contract?.getEvidence || !contract?.evidenceCount) {
        console.warn("⚠️ Contract not ready or missing methods.");
        return;
      }

      const count = await contract.evidenceCount();
      const total = parseInt(count.toString());
      console.log("📊 Total evidences found:", total);

      const all = [];

      for (let i = 0; i < total; i++) {
        try {
          const evidence = await contract.getEvidence(i);
          const [cid, submitter, verified] = evidence;
          console.log(`📁 Evidence #${i}:`, cid, submitter, verified);
          all.push({ id: i, cid, submitter, verified });
        } catch (innerErr) {
          console.error(`❌ Failed to fetch evidence at ID ${i}:`, innerErr);
        }
      }

      setEvidences(all.reverse());
    } catch (err) {
      console.error("❌ Failed to load evidence list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) loadEvidences();
  }, [contract]);

  return (
    <div className="card">
      <h3>📜 All Submitted Evidence</h3>

      {loading ? (
        <p className="status-loading">⏳ Loading...</p>
      ) : evidences.length === 0 ? (
        <p className="status-empty">📭 No evidence submitted yet.</p>
      ) : (
        <ul className="evidence-list">
          {evidences.map((ev) => (
            <li key={ev.id} className={`evidence-item ${ev.verified ? 'verified' : ''}`}>
              <p><strong>ID:</strong> {ev.id}</p>
              <p><strong>CID:</strong>{' '}
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${ev.cid}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ev.cid}
                </a>
              </p>
              <p><strong>Submitted by:</strong> {ev.submitter}</p>
              <p><strong>Verified:</strong> {ev.verified ? '✅ Yes' : '❌ No'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EvidenceViewer;
