import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './abi/EvidenceABI.json';
import CaseForm from './components/CaseForm';
import CaseViewer from './components/CaseViewer';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Your deployed contract address

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [uploadedCid, setUploadedCid] = useState('');

  
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          console.log("🔗 Contract address:", contractAddress);
          console.log("🧠 Contract instance:", contractInstance);
          console.log("👤 Signer address:", address);


          setAccount(address);
          setContract(contractInstance);

          // Refresh on account change
          window.ethereum.on('accountsChanged', () => window.location.reload());
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    init();
  }, []);

  return (
    <div className='app-wrapper'>
      <h1>Blockchain based Investigation Evidence management DApp</h1>

      {account ? (
        <p>✅ Connected as: {account}</p>
      ) : (
        <p>🟡 Not connected to MetaMask</p>
      )}


      {contract && (
        <>
          

          <CaseForm contract={contract} initialCid={uploadedCid} />
          <CaseViewer contract={contract} />

        </>
      )}
    </div>
  );
}

export default App;