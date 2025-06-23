import React, { useState } from 'react';
import axios from 'axios';

function UploadToIPFS({ onUpload }) {
  const [file, setFile] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const PINATA_JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYWNkZDA5Ni05YzA2LTRjODQtODBkZS0wZDM0ZjBjZjUyYmQiLCJlbWFpbCI6Indpc3NlYm8yMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWMyZDkyY2RiNGQxM2RiZDFmZmIiLCJzY29wZWRLZXlTZWNyZXQiOiJiMmQ2YmZhZDEwMjlkYjgzNDcxMzBhYjY0NjBjOWQxNjVkMWZlZDkzOTViMDAyYjQ3YmMxNzA3ZTZhYTgzNzZmIiwiZXhwIjoxNzc5MTk3NTI2fQ.ixifCMbC0ieLMDYOIR26CtCrPNglTw0dH1tbUjkcm_A'; 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToIPFS = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxContentLength: 'Infinity',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: PINATA_JWT,
        },
      });

      const ipfsHash = res.data.IpfsHash;
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      setIpfsUrl(url);
      onUpload(url);
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3>📂 Upload File to IPFS (via Pinata)</h3>

      <input type="file" onChange={handleFileChange} />

      <button onClick={uploadToIPFS} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {ipfsUrl && (
        <p className="status-verified" style={{ marginTop: '1rem' }}>
          ✅ Uploaded: <a href={ipfsUrl} target="_blank" rel="noreferrer">{ipfsUrl}</a>
        </p>
      )}
    </div>
  );
}

export default UploadToIPFS;
