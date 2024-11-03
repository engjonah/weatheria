// src/components/ParchmentBackground.js
import React from 'react';
import styled from 'styled-components';

const ParchmentWrapper = styled.div`
  position: relative;
  padding: 20px;
  background: #f4e9d8;
  border-radius: 10px;
  border: 1px solid #b08d57;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const ParchmentSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #9e7c4b;
`;

const ParchmentBackground = ({ children }) => (
  <ParchmentWrapper>
    <ParchmentSVG viewBox="0 0 500 500" preserveAspectRatio="none">
      <path d="M10,10 h480 v480 h-480 z" strokeWidth="15" />
    </ParchmentSVG>
    {children}
  </ParchmentWrapper>
);

export default ParchmentBackground;
