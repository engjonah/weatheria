// src/components/MintNFT.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import WeatheriaNFT from '../abi/WeatheriaNFT.json';

const MintNFT = ({ signer }) => {
  const [image, setImage] = useState(null);
  const [minting, setMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  // Replace with your deployed contract address
  const contractAddress = "0x45ef9c2367FEb5BCA8c6c0b13e0a7b50E1872E72";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    // For simplicity, we'll use a base64 string. For production, consider using IPFS.
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const mint = async () => {
    if (!image) {
      alert("Please upload an image to mint.");
      return;
    }
  
    try {
      setMinting(true);
  
      // Initialize contract
      const contract = new ethers.Contract(contractAddress, WeatheriaNFT.abi, signer);
  
      // Upload image and metadata to IPFS here (pseudo-code)
      // const imageIpfsUrl = await uploadToIPFS(image);
      // const metadata = {
      //   name: "Your NFT Name",
      //   description: "Description of your NFT",
      //   image: imageIpfsUrl,
      //   attributes: [...],
      // };
      // const metadataIpfsUrl = await uploadToIPFS(JSON.stringify(metadata));
  
      // For simplicity, using the base64 string as the tokenURI
      const tokenURI = image;
  
      // Mint the NFT
      const tx = await contract.mintNFT(await signer.getAddress(), tokenURI);
      console.log("Transaction sent:", tx.hash);
  
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt.transactionHash);
      setTransactionHash(receipt.transactionHash);
  
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT.");
    } finally {
      setMinting(false);
    }
  };  

  return (
    <div style={containerStyle}>
      <h2>Mint Your NFT</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Preview" style={{ width: '200px', marginTop: '10px' }} />}
      <br />
      <button onClick={mint} style={buttonStyle} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      {transactionHash && (
        <p>
          Transaction Hash:{" "}
          <a
            href={`https://goerli.etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
          </a>
        </p>
      )}
    </div>
  );
};

const containerStyle = {
  border: "1px solid #ccc",
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center",
  margin: "20px auto",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginTop: "10px",
};

export default MintNFT;
