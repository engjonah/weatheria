// src/pages/CryptoPage.js
import React, { useState } from 'react';
import ConnectButton from '../components/ConnectButton';
import MintNFT from '../components/MintNft';
import ViewNFTs from '../components/ViewNfts';
import '../styles.css';

function CryptoPage() {
    // State for blockchain interaction
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);

    return (
        <div className="crypto-page-container">
            <h1>Blockchain Interaction</h1>

            {/* Connect Wallet Section */}
            <div className="connect-wallet-section">
                <h2>Connect Your Wallet</h2>
                <ConnectButton
                    setProvider={setProvider}
                    setSigner={setSigner}
                    setAccount={setAccount}
                />
                {account && <p>Connected Account: {account}</p>}
            </div>

            {/* Mint NFT Section */}
            {provider && signer && account && (
                <div className="mint-nft-section">
                    <h2>Mint a New NFT</h2>
                    <MintNFT signer={signer} />
                </div>
            )}

            {/* View NFTs Section */}
            {provider && account && (
                <div className="view-nfts-section">
                    <h2>Your NFTs</h2>
                    <ViewNFTs provider={provider} account={account} />
                </div>
            )}
        </div>
    );
}

export default CryptoPage;
