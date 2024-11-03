// src/components/About.js
import React from 'react';
import styled from 'styled-components';
import ParchmentBackground from '../components/ParchmentBackground';
import AboutImage from "../assets/steampunk-about.svg"
const AboutContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid #8b4513;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.7);
`;

const Heading = styled.h2`
  font-family: 'Cinzel', serif;
  color: #ffd700;
  font-size: 2.8em;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 2px;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-family: 'Goudy Bookletter 1911', serif;
  color: #bfa17b;
  font-size: 1.2em;
  line-height: 1.7;
  text-align: justify;
  margin-bottom: 2rem;
  max-width: 700px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 350px;
  display: block;
  margin: 20px auto 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

function About() {
  return (
    <AboutContainer>
      <ParchmentBackground>
        <Heading>About Weatheria</Heading>
        <Text>
          Weatheria is a modern decentralized application that allows users to discover locations based on their preferred weather conditions. Leveraging blockchain technology and AI-generated imagery, we provide an immersive experience that blends the charm of classic themes with cutting-edge technological advancements.
        </Text>
        <Image src={AboutImage} alt="About Weatheria" loading="lazy" />
      </ParchmentBackground>
    </AboutContainer>
  );
}

export default About;
