import React, { useState, useEffect } from 'react';

function SubmitEvidence({ contract, initialCid }) {
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (initialCid) {
      setIpfsUrl(initialCid);
    }
  }, [initialCid]);

  const handleSubmit = async () => {
    if (!ipfsUrl) {
      alert('Please enter or paste a valid IPFS hash');
      return;
    }

    try {
      setSubmitting(true);

      const cid = ipfsUrl.trim().startsWith('http')
        ? ipfsUrl.trim().split('/').pop()
        : ipfsUrl.trim();

      const tx = await contract.submitEvidence(cid);
      await tx.wait();

      setTxHash(tx.hash);
      alert('📦 Evidence submitted successfully!');
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3>🧾 Submit Evidence</h3>

      <label htmlFor="ipfs-input">IPFS Hash:</label>
      <input
        id="ipfs-input"
        type="text"
        value={ipfsUrl}
        onChange={(e) => setIpfsUrl(e.target.value)}
        placeholder="Paste IPFS CID here"
        className="input"
      />

      <button onClick={handleSubmit} disabled={submitting} className="button">
        {submitting ? 'Submitting...' : 'Submit to Blockchain'}
      </button>

      {txHash && (
        <p className="status-verified" style={{ marginTop: '1rem' }}>
          ✅ Submitted! Tx Hash:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}
    </div>
  );
}

export default SubmitEvidence;
