import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import WeatheriaNFT from '../abi/WeatheriaNFT.json';

const ViewNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const contractAddress = '0x8c28fa18cf99b5a35409f2502088beb1cc2c87b4';

  // Function to prompt wallet connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer);
        setWalletAddress(address);
        console.log('Wallet connected:', address);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    } else {
      alert('Please install a MetaMask wallet to use this feature.');
    }
  };

  // Fetch NFTs, using useCallback to avoid dependency issues in useEffect
  const fetchNFTs = useCallback(async () => {
    if (!signer || !walletAddress) return;

    try {
      const contract = new ethers.Contract(contractAddress, WeatheriaNFT.abi, signer);
      console.log(contract);
      // Get all token IDs owned by the wallet address using tokensOfOwner
      const tokenIds = await contract.tokensOfOwner(walletAddress);
      console.log('Token IDs:', tokenIds);

      const nftData = [];

      for (const tokenId of tokenIds) {
        // Convert tokenId from BigInt to string
        const tokenIdStr = tokenId.toString();
        console.log('Processing Token ID:', tokenIdStr);

        const tokenURI = await contract.tokenURI(tokenId);
        console.log('Token URI:', tokenURI);

        // Replace 'ipfs://' with the Pinata gateway URL
        let metadataUrl = tokenURI;
        if (tokenURI.startsWith('ipfs://')) {
          const ipfsHash = tokenURI.replace('ipfs://', '');
          metadataUrl = `https://tan-hollow-sturgeon-997.mypinata.cloud/ipfs/${ipfsHash}`;
        } else {
          metadataUrl = `https://tan-hollow-sturgeon-997.mypinata.cloud/ipfs/${tokenURI}`;
        }

        // Fetch metadata from IPFS via Pinata
        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
          console.error(`Failed to fetch metadata for Token ID ${tokenIdStr}`);
          continue;
        }
        const metadata = await metadataResponse.json();

        // Optionally, process the image URL if it's also an IPFS link
        let imageUrl = metadata.image;
        if (metadata.image && metadata.image.startsWith('ipfs://')) {
          const imageIpfsHash = metadata.image.replace('ipfs://', '');
          imageUrl = `https://tan-hollow-sturgeon-997.mypinata.cloud/ipfs/${imageIpfsHash}`;
        }else{
          imageUrl = `https://tan-hollow-sturgeon-997.mypinata.cloud/ipfs/${metadata.image}`;
        }
        console.log(nftData);
        nftData.push({
          tokenId: tokenIdStr,
          image: imageUrl,
        });
      }

      setNfts(nftData);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  }, [signer, walletAddress, contractAddress]);

  useEffect(() => {
    if (signer) {
      fetchNFTs();
    }
  }, [signer, fetchNFTs]);

  return (
    <div>
      {!signer ? (
        <button onClick={connectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {nfts.length === 0 ? (
            <p>No NFTs found for this address.</p>
          ) : (
            nfts.map((nft) => (
              <div key={nft.tokenId} style={nftCardStyle}>
                <h3>{nft.name}</h3>
                {nft.image ? (
                  <img src={nft.image} alt={nft.name} style={{ width: '200px' }} />
                ) : (
                  <p>No image available</p>
                )}
                <p>{nft.description}</p>
                <p>Token ID: {nft.tokenId}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const nftCardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  width: '220px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginTop: '10px',
};

export default ViewNFTs;
