import React, { useState, useEffect } from 'react';
import '../component_CSS/Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [joke, setJoke] = useState({ setup: '', punchline: '' });

  const fetchJoke = async () => {
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await response.json();
      setJoke({ setup: data.setup, punchline: data.punchline });
    } catch (error) {
      console.error('Error fetching joke:', error);
    }
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-logo">
        <Link to="/">
          <span className="logo-part FP">News</span>
          <span className="logo-part way">io</span>
        </Link>
      </div>

      <div className="footer-text">
        <p>
          Connect with people worldwide on our social media platform, designed to foster meaningful
          interactions, share moments, and discover new content. Stay connected, express yourself, and
          explore a vibrant community. Join us to build relationships, share stories, and enjoy a
          seamless social experience like never before!
        </p>
      </div>

      <div className="joke-box">
        <p className="joke-emoji">😂</p>
        <p className="joke-setup">{joke.setup}</p>
        <p className="joke-punchline">{joke.punchline}</p>
        <button className="next-joke-btn" onClick={fetchJoke}>Next Joke</button>
      </div>

      <div className="footer-copyright">
        <p>&copy; 2024 Newsio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
