// src/components/Knob.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import knobSvg from '../assets/knob.svg';

const KnobWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const KnobImage = styled.div`
  width: 100px;
  height: 100px;
  background: url(${knobSvg}) no-repeat center center;
  background-size: contain;
  transform: rotate(${props => props.angle}deg);
  cursor: grab;
  margin-bottom: 5px;
`;

const KnobLabel = styled.label`
  font-size: 1em;
  margin-bottom: 5px;
  color: #f5f5dc;
  text-shadow: 1px 1px #000;
`;

const KnobValue = styled.span`
  margin-top: 5px;
  font-size: 0.9em;
  color: #f5f5dc;
  text-shadow: 1px 1px #000;
`;

const Knob = ({ label, value, onChange, min, max, step }) => {
  const [angle, setAngle] = useState((value - min) / (max - min) * 360);
  const [lastAngle, setLastAngle] = useState(0); // Track the previous angle for smooth rotation
  const knobRef = useRef(null);
  const isDragging = useRef(false);

  const startDrag = (e) => {
    e.preventDefault();
    isDragging.current = true;
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDragTouch);
    window.addEventListener('touchend', endDrag);
  };

  const onDrag = (e) => {
    if (!isDragging.current) return;
    calculateAngle(e.clientX, e.clientY);
  };

  const onDragTouch = (e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    calculateAngle(touch.clientX, touch.clientY);
  };

  const endDrag = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', onDragTouch);
    window.removeEventListener('touchend', endDrag);
  };

  const calculateAngle = (x, y) => {
    if (knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const radians = Math.atan2(deltaY, deltaX);
      let newAngle = radians * (180 / Math.PI) + 90; // Convert to degrees and normalize
      if (newAngle < 0) newAngle += 360;

      // Calculate angle difference to determine direction
      const angleDifference = newAngle - lastAngle;
      const continuousAngle = angle + angleDifference;

      setLastAngle(newAngle); // Update last angle for the next movement
      setAngle(continuousAngle);

      // Map continuous angle to value and clamp within min and max
      const newValue = Math.round(((continuousAngle % 360) / 360) * (max - min) + min);
      onChange(newValue);
    }
  };

  useEffect(() => {
    const calculatedAngle = (value - min) / (max - min) * 360;
    setAngle(calculatedAngle);
    setLastAngle(calculatedAngle % 360); // Sync last angle with calculated angle
  }, [value, min, max]);

  return (
    <KnobWrapper>
      <KnobLabel>{label}</KnobLabel>
      <KnobImage
        ref={knobRef}
        angle={angle}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            const newValue = Math.min(value + step, max);
            onChange(newValue);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            const newValue = Math.max(value - step, min);
            onChange(newValue);
          }
        }}
      />
      <KnobValue>{value}</KnobValue>
    </KnobWrapper>
  );
};

export default Knob;
