// src/components/Vial.js
import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';


const VialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const VialContainer = styled.div`
  width: 200px; /* Increased width for better interaction */
  height: 40px;
  background: url('/images/vial.png') no-repeat center center;
  background-size: contain;
  position: relative;
  cursor: default; /* Changed cursor to default */
  overflow: hidden; /* Ensure liquid doesn't overflow the vial */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
`;

const Liquid = styled.div`
  position: absolute;
  left: 0;
  top: 5px;
  height: 30px; /* Slight padding to fit inside the vial */
  width: ${({ value }) => value}%;
  background: ${({ color }) => color};
  transition: width 0.3s;
  border-radius: 5px 0 0 5px; /* Rounded left corners */
`;

const Handle = styled.div`
  position: absolute;
  top: 0;
  left: ${({ value }) => value}%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 40px;
  background: #654321; /* Dark Brown for steampunk feel */
  border: 2px solid #8b4513; /* SaddleBrown border */
  border-radius: 5px;
  cursor: ew-resize; /* East-West resize cursor */
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #a0522d; /* Sienna on hover */
  }
`;

const VialLabel = styled.label`
  font-size: 1em;
  margin-bottom: 5px;
  color: #f5f5dc;
  text-shadow: 1px 1px #000;
`;

const VialValue = styled.span`
  margin-top: 5px;
  font-size: 0.9em;
  color: #f5f5dc;
  text-shadow: 1px 1px #000;
`;

const Vial = ({ label, value, color, onChange }) => {
  const handleDrag = (e, data) => {
    // Calculate new value based on handle's x position
    const containerWidth = 200; // Should match VialContainer's width
    const handleWidth = 20; // Should match Handle's width
    const maxDrag = containerWidth - handleWidth / 2;
    const newX = Math.min(Math.max(data.x, 0), maxDrag);
    const newValue = Math.round((newX / (containerWidth - handleWidth)) * 100);
    onChange(newValue);
  };

  return (
    <VialWrapper>
      <VialLabel>{label}</VialLabel>
      <VialContainer>
        <Liquid value={value} color={color} />
        <Draggable
          axis="x"
          bounds="parent"
          position={{ x: (value / 100) * (200 - 20), y: 0 }} // 200 container width - 20 handle width
          onDrag={handleDrag}
        >
          <Handle />
        </Draggable>
      </VialContainer>
      <VialValue>{value}%</VialValue>
    </VialWrapper>
  );
};

export default Vial;
