// src/components/ViewNFTs.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WeatheriaNFT from '../abi/WeatheriaNFT.json';

const ViewNFTs = ({ provider, account }) => {
  const [nfts, setNfts] = useState([]);

  // Replace with your deployed contract address
  const contractAddress = "0x45ef9c2367FEb5BCA8c6c0b13e0a7b50E1872E72";

  useEffect(() => {
    if (provider && account) {
      fetchNFTs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, account]);

  const fetchNFTs = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, WeatheriaNFT, provider);
      const balance = await contract.balanceOf(account);
      const nftPromises = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contract.tokenURI(tokenId);
        nftPromises.push(fetchTokenData(tokenId, tokenURI));
      }

      const nftData = await Promise.all(nftPromises);
      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const fetchTokenData = async (tokenId, tokenURI) => {
    // Assuming tokenURI is a base64 image. Adjust accordingly if using IPFS or hosted metadata.
    return {
      tokenId: tokenId.toString(),
      image: tokenURI,
    };
  };

  return (
    <div style={containerStyle}>
      <h2>Your NFTs</h2>
      {nfts.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div style={nftGridStyle}>
          {nfts.map((nft) => (
            <div key={nft.tokenId} style={nftCardStyle}>
              <img src={nft.image} alt={`NFT ${nft.tokenId}`} style={{ width: '100%' }} />
              <p>Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "10px",
  width: "80%",
  textAlign: "center",
  margin: "20px auto",
};

const nftGridStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const nftCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "10px",
  margin: "10px",
  width: "200px",
  boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
};

export default ViewNFTs;
