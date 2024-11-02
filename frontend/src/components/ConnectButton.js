// src/components/ConnectButton.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserProvider } from 'ethers';

const ConnectButton = ({ setProvider, setSigner, setAccount }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [displayAccount, setDisplayAccount] = useState('');

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
        setDisplayAccount(`${account.slice(0, 6)}...${account.slice(-4)}`);
        setIsConnected(true);

        const tempProvider = new BrowserProvider(window.ethereum);
        setProvider(tempProvider);
        const tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }, [setAccount, setProvider, setSigner]);

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, [connectWallet]);  

  return (
    <button onClick={connectWallet} style={buttonStyle}>
      {isConnected ? `Connected: ${displayAccount}` : "Connect Wallet"}
    </button>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f6851b",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "20px",
};

export default ConnectButton;
