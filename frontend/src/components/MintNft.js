import React, { useState } from 'react';
import { ethers } from 'ethers';
import WeatheriaNFT from '../abi/WeatheriaNFT.json';
import { pinata } from './config'; // Import configured Pinata instance
import '../styles.css';

const MintNFT = ({ signer }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [minting, setMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');

  const contractAddress = '0x8c28fa18cf99b5a35409f2502088beb1cc2c87b4';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const mint = async () => {
    if (!imageFile) {
      alert('Please upload an image to mint.');
      return;
    }

    try {
      setMinting(true);

      const contract = new ethers.Contract(contractAddress, WeatheriaNFT.abi, signer);

      console.log("Adding image to IPFS via Pinata...");
      const addedImage = await pinata.upload.file(imageFile);
      console.log(addedImage);
      const imageIpfsUrl = `${addedImage.IpfsHash}`;
      console.log('Image uploaded to IPFS:', imageIpfsUrl);

      const metadata = {
        name: 'Your NFT Name',
        description: 'Description of your NFT',
        image: imageIpfsUrl,
      };

      const metadataString = JSON.stringify(metadata);
      const metadataBlob = new Blob([metadataString], { type: 'application/json' });
      const addedMetadata = await pinata.upload.file(metadataBlob);
      const metadataIpfsUrl = `${addedMetadata.IpfsHash}`;
      console.log('Metadata uploaded to IPFS:', metadataIpfsUrl);

      const tx = await contract.mintNFT(await signer.getAddress(), metadataIpfsUrl);
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction mined:', receipt);
      setTransactionHash(receipt.transactionHash);

      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Mint Your NFT</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ width: '200px', marginTop: '10px' }}
        />
      )}
      <br />
      <button onClick={mint} style={buttonStyle} disabled={minting}>
        {minting ? 'Minting...' : 'Mint NFT'}
      </button>
      {transactionHash && (
        <p>
          Transaction Hash:{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
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
  border: '1px solid #ccc',
  padding: '20px',
  borderRadius: '10px',
  width: '300px',
  textAlign: 'center',
  margin: '20px auto',
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

export default MintNFT;
