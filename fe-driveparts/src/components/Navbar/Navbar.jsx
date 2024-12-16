import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { UserContext } from '../../contexts/UserContext'
import logo from '../../images/driveparts_logo.png'
import './Navbar.css'

const NavbarComponent = () => {
  const { user, logout } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    logout()
    setTimeout(() => {
      navigate('/')
    }, 0)
  }

  return (
    <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="px-4 py-2">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logo}
          alt="Driveparts logo"
          className="logo"
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/parts">All Parts</Nav.Link>
          <Nav.Link as={Link} to="/request">Request</Nav.Link>
          {user ? (
            <Nav.Link as={Link} to="/my-parts" className="fw-bold text-warning">My Parts</Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          )}
        </Nav>

        <Nav>
          {user ? (
            <NavDropdown
              align="end"
              menuVariant="dark"
              title={
                <span className="user-dropdown-title">
                  <img
                    src={user.logo || 'https://via.placeholder.com/50'}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                  {user.businessName}
                </span>
              }
            >
              <NavDropdown.Item as={Link} to="/my-profile">My Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/add-parts">Add Part</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogoutClick}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavbarComponent
