import React, { useState } from 'react';

function VerifyEvidence({ contract }) {
  const [evidenceId, setEvidenceId] = useState('');
  const [status, setStatus] = useState('');

  const handleVerify = async () => {
    if (!evidenceId) {
      setStatus('⚠️ Please enter an Evidence ID');
      return;
    }

    try {
      const tx = await contract.verifyEvidence(Number(evidenceId));
      await tx.wait();
      setStatus(`✅ Evidence ID ${evidenceId} verified successfully!`);
      setEvidenceId('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Verification failed. Check the ID or try again.');
    }
  };

  return (
    <div className="card">
      <h3>🔍 Verify Evidence</h3>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <input
          type="number"
          placeholder="Enter Evidence ID"
          value={evidenceId}
          onChange={(e) => setEvidenceId(e.target.value)}
          className="input"
          style={{ maxWidth: '200px' }}
        />
        <button onClick={handleVerify} className="button">
          Verify
        </button>
      </div>
      {status && <p className={status.startsWith('✅') ? 'status-verified' : 'status-error'}>{status}</p>}
    </div>
  );
}

export default VerifyEvidence;
