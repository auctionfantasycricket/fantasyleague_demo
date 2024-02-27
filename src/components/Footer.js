import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/logos/logo-no-background.svg";
import navIcon2 from '../assets/images/nav-icon2.svg';
import navIcon3 from '../assets/images/nav-icon3.svg';
import './Footer.css'

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center h-footer">
          <Col size={12} sm={6} className="logo-xs" href='#home' >
            <img href='#home' src={logo} alt="Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href="/" target="_blank" rel="noreferrer"><img src={navIcon2} alt="Facebook" /></a>
              <a href="/" target="_blank" rel="noreferrer"><img src={navIcon3} alt="Instagram" /></a>
            </div>
            <p>Copyright 2024. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}