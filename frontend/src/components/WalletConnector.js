// WalletConnector.jsx

import React, { useState } from 'react';
import {
  connectWallet,
  checkAuthorization,
  getWalletState,
  sendTransaction,
} from '../services/walletService';

const WalletConnector = () => {
  const [availableWallets, setAvailableWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletApi, setWalletApi] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [walletState, setWalletState] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [walletsFetched, setWalletsFetched] = useState(false);

  const fetchWallets = () => {
    const wallets = Object.keys(window.midnight || {});
    setAvailableWallets(wallets);
    setWalletsFetched(true);

    // Automatically select the only wallet if there's one option
    if (wallets.length === 1) {
      setSelectedWallet(wallets[0]);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const api = await connectWallet(selectedWallet);
      console.log('Wallet API:', api);
      setWalletApi(api);
      const authorized = await checkAuthorization(selectedWallet);
      setIsAuthorized(authorized);
      console.log('Wallet connected and authorized:', authorized);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCheckAuthorization = async () => {
    try {
      const enabled = await checkAuthorization(selectedWallet);
      setIsAuthorized(enabled);
      console.log('DApp authorized:', enabled);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGetWalletState = async () => {
    try {
      const state = await getWalletState(walletApi);
      setWalletState(state);
      console.log('Wallet state:', state);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSendTransaction = async () => {
    if (!recipientAddress) {
      console.error('Recipient address is empty');
      setTransactionStatus('Recipient address is empty.');
      return;
    }

    try {
      const submittedTx = await sendTransaction(walletApi, recipientAddress, 1, 'dust');
      setTransactionStatus('Transaction submitted successfully!');
      console.log('Transaction submitted:', submittedTx);
    } catch (error) {
      console.error(error.message);
      setTransactionStatus('Transaction failed.');
    }
  };

  return (
    <div>
      <h1>Midnight Wallet Connector</h1>
      {!walletsFetched ? (
        <button onClick={fetchWallets}>Connect Wallet</button>
      ) : availableWallets.length > 0 ? (
        <>
          <h3>Select a Wallet</h3>
          <select
            onChange={(e) => setSelectedWallet(e.target.value)}
            value={selectedWallet}
          >
            {availableWallets.length > 1 && <option value="" disabled>Select Wallet</option>}
            {availableWallets.map((wallet) => (
              <option key={wallet} value={wallet}>
                {wallet}
              </option>
            ))}
          </select>
          <button onClick={handleConnectWallet} disabled={!selectedWallet}>
            Connect Wallet
          </button>
        </>
      ) : (
        <p>No wallets available in window.midnight</p>
      )}
      {isAuthorized && (
        <>
          <button onClick={handleCheckAuthorization}>Check Authorization</button>
          <button onClick={handleGetWalletState}>Get Wallet State</button>
          <div>
            <h3>Send 1 Dust</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
            <button onClick={handleSendTransaction}>Send Transaction</button>
          </div>
        </>
      )}
      {walletState && (
        <div>
          <h2>Wallet State</h2>
          <pre>{JSON.stringify(walletState, null, 2)}</pre>
        </div>
      )}
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
};

export default WalletConnector;
