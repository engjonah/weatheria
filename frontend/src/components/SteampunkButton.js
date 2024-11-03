import React from 'react';

function SteampunkButton({ onClick, children, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="steampunk-button"
    >
      {children}
    </button>
  );
}

export default SteampunkButton;
