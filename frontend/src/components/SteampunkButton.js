// src/components/SteampunkButton.js
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: #8b4513; /* SaddleBrown */
  border: 2px solid #654321; /* Darker Brown */
  border-radius: 10px;
  color: #f5f5dc; /* Beige */
  padding: 15px 30px;
  font-size: 1.2em;
  cursor: pointer;
  font-family: 'Goudy Bookletter 1911', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;

  &:hover {
    background: #a0522d; /* Sienna */
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  &:active {
    background: #cd853f; /* Peru */
    transform: scale(0.95);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  }

  i {
    margin-right: 8px;
  }
`;

const SteampunkButton = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};

export default SteampunkButton;
