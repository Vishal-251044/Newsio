import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../component_CSS/Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#000000' : '#ffffff',
  });

  const handleLoginClick = () => {
    if (isLoggedIn) {
      navigate('/profile'); 
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" onClick={toggleMobileMenu}>
          <span className="logo-part FP">News</span>
          <span className="logo-part way">io</span>
        </NavLink>
      </div>
      <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
        <NavLink to="/" style={navLinkStyles} onClick={toggleMobileMenu}>
          Home
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink to="/profile" style={navLinkStyles} onClick={toggleMobileMenu}>
              Profile
            </NavLink>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="login-button" style={navLinkStyles} onClick={handleLoginClick}>
            Login
          </NavLink>
        )}
      </div>
      <div className="hamburger" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? (
          <span className="close-icon">&times;</span>
        ) : (
          <span className="hamburger-icon">&#9776;</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
