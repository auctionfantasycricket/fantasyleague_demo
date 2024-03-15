import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Offcanvas, Button } from "react-bootstrap";
import logo from '../assets/logos/logo-no-background.svg';
import navIcon1 from '../assets/images/nav-icon1.svg';
import navIcon2 from '../assets/images/nav-icon2.svg';
import navIcon3 from '../assets/images/nav-icon3.svg';
import './NavBar.css'
import { Link, BrowserRouter as Router } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import {useGoogleLogin, googleLogout} from '@react-oauth/google';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { setLoginSuccess, setLogoutSuccess } from './redux/reducer/authReducer'

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const userProfile = useSelector((state) => state.login.userProfile);


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScrollToSection = (sectionId) => {
    //setIsMenuOpen(false);

    if (isMenuOpen) { // Close menu on any link press if mobile
      setIsMenuOpen(false);
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClose = () => setIsMenuOpen(false);


  ///Login Functionality
  const handlelogin = useGoogleLogin({
    onSuccess: async respose => {
        try {
            const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    "Authorization": `Bearer ${respose.access_token}`
                }
            })

            console.log(res.data)
            dispatch(setLoginSuccess(res.data));
        } catch (err) {
            console.log(err)

        }

    }
  });

  const handlelogOut = () => {
    googleLogout();
    dispatch(setLogoutSuccess());
  };

/*className={`${scrolled ? "scrolled" : ""} ${isLoggedIn ? "logged" : ""}`}>*/

  return (
    <>
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <Navbar.Brand>
        <Link to ='/efl2024_first' className='navbar-brand' onClick={() => handleScrollToSection('home')}>
          <img src={logo} alt="Logo" />
          </Link>
        </Navbar.Brand>
        {isSmallScreen && (
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="navbar-toggler-icon"></span>
          </Navbar.Toggle>
        )}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          <Nav.Link as={Link} to="/efl2024_first" className='navbar-link' onClick={() => handleScrollToSection('home')}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/players" className='navbar-link'>
              Players List
            </Nav.Link>
            <Nav.Link as={Link}
              to={isLoggedIn ? "/auction" : "/efl2024_first"}
              className='navbar-link'
              onClick={() => isLoggedIn ? null: handleScrollToSection('about')}>
              {isLoggedIn ? "Auction" : "Fantasy Auction"}
            </Nav.Link>
            <Nav.Link as={Link} 
            to={isLoggedIn ? "/manageteam" : "/efl2024_first"}
            className='navbar-link'
             onClick={() => isLoggedIn ? null: handleScrollToSection('rules')}>
              {isLoggedIn ? "Manage Team" : "Rules"}
            </Nav.Link>
            <Nav.Link as={Link} to="/efl2024_first" className='navbar-link' onClick={() => handleScrollToSection('contact')}>
              Contact Us
            </Nav.Link>
          </Nav>
          <span className="navbar-text">
            <div className="social-icon">
              <a href="#"><img src={navIcon2} alt="" /></a>
              <a href="#"><img src={navIcon3} alt="" /></a>
            </div>
            {isLoggedIn ? (
                <NavDropdown title={<img src={userProfile.picture} alt={userProfile.name} className="user-avatar" />} id="user-dropdown">
                  <NavDropdown.Item>{userProfile?.name || 'Name'}</NavDropdown.Item>
                  <NavDropdown.Item>{userProfile?.email || 'Email'}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handlelogOut}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/efl2024_first'>
                  <button className="vvd" onClick={handlelogin}><span>SignIn</span></button>
                </Nav.Link>
              )}
          </span>
        </Navbar.Collapse>

        {isSmallScreen && (
          <Offcanvas show={isMenuOpen} onHide={() => setIsMenuOpen(false)} placement="end">
            <Offcanvas.Header>
            <Button onClick={handleClose}>
              <FaTimes/>
            </Button>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="ms-auto">
              <Nav.Link as={Link} to="/efl2024_first" className='navbar-link' onClick={() => handleScrollToSection('home')}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/players" className='navbar-link' onClick={() => setIsMenuOpen(!isMenuOpen)}>
              Players List
            </Nav.Link>
            <Nav.Link as={Link}
              to={isLoggedIn ? "/auction" : "/efl2024_first"}
              className='navbar-link'
              onClick={() => isLoggedIn ? null: handleScrollToSection('about')}>
              {isLoggedIn ? "Auction" : "Fantasy Auction"}
            </Nav.Link>
            <Nav.Link as={Link} 
            to={isLoggedIn ? "/manageteam" : "/efl2024_first"}
            className='navbar-link'
             onClick={() => isLoggedIn ? null: handleScrollToSection('rules')}>
              {isLoggedIn ? "Manage Team" : "Rules"}
            </Nav.Link>
            <Nav.Link as={Link} to="/efl2024_first" className='navbar-link' onClick={() => handleScrollToSection('contact')}>
              Contact Us
            </Nav.Link>
              </Nav>
              <div className="social-icon">
                <a href="#"><img src={navIcon2} alt="" /></a>
                <a href="#"><img src={navIcon3} alt="" /></a>
              </div>
              {isLoggedIn ? (
                <NavDropdown title={<img src={userProfile.picture} alt={userProfile.name} className="user-avatar" />} id="user-dropdown">
                  <NavDropdown.Item>{userProfile?.name || 'Name'}</NavDropdown.Item>
                  <NavDropdown.Item>{userProfile?.email || 'Email'}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handlelogOut}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/efl2024_first'>
                  <button className="vvd" onClick={handlelogin}><span>SignIn</span></button>
                </Nav.Link>
              )}
            </Offcanvas.Body>
          </Offcanvas>
        )}
      </Container>
    </Navbar>

    </>
  );
};

/*<Link to ='/ ' className='navbar-brand' onClick={() => handleScrollToSection('home')}>


<Nav.Link as={Link} className='navbar-link' to="/" onClick={() => handleScrollToSection('league')}>
              League Setup
            </Nav.Link>

                        <Nav.Link as={Link} className='navbar-link' to="/" onClick={() => handleScrollToSection('rules')}>
              Rules
            </Nav.Link>

*/