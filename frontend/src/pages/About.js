import React from 'react';

function About() {
  return (
    <div className="about-container">
      <h2 className="about-heading">About Weatheria DApp</h2>
      <p className="about-text">
        Weatheria DApp is a modern decentralized application that allows users to discover locations based on their preferred weather conditions. Leveraging blockchain technology and AI-generated imagery, we provide an immersive experience that blends the charm of classic themes with cutting-edge technological advancements.
      </p>
      <img src="/steampunk-about.png" alt="About Weatheria" className="about-image" loading="lazy" />
    </div>
  );
}

export default About;
