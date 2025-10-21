import { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { Notyf } from 'notyf';
import '../index.css';

export default function NavbarComponent() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const notyf = new Notyf();

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  // ✅ Don't render Navbar if user is not loaded yet
  if (user === null) return null;

  const isLoggedIn = !!user?.id;

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://fitnessapi-agpalza-1.onrender.com/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        localStorage.removeItem('token');
        setUser({ id: null });
        notyf.success({ message: 'Logged out successfully', duration: 3000 });
        navigate('/login');
      } else {
        notyf.error('Logout failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      notyf.error('Something went wrong.');
    }
  };

  return (
    <Navbar expand="md" bg="white" variant="light" fixed="top" className="shadow-sm px-3 px-lg-5 py-3" expanded={isOpen}>
      <Container fluid>
        <Navbar.Brand href="/homepage" className="fw-bold text-primary fs-4">
          Fitness<span className="text-dark">Tracker</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarNav" onClick={toggleNavbar} className="border-0" />
        <Navbar.Collapse id="navbarNav" className="justify-content-md-end">
          <Nav className="flex-column flex-md-row align-items-start align-items-md-center text-start text-md-center gap-md-4 mt-3 mt-md-0">
            <Nav.Link href="/homepage" onClick={closeNavbar}>Home</Nav.Link>
            <Nav.Link href="/workouts" onClick={closeNavbar}>Workouts</Nav.Link>

            {!isLoggedIn ? (
              <>
                <Nav.Link as="span" onClick={() => { closeNavbar(); navigate('/login'); }} className="d-md-none">Login</Nav.Link>
                <Nav.Link as="span" onClick={() => { closeNavbar(); navigate('/register'); }} className="d-md-none">Register</Nav.Link>
                <div className="d-none d-md-flex gap-2">
                  <Button variant="outline-primary" onClick={() => { closeNavbar(); navigate('/login'); }}>Login</Button>
                  <Button variant="primary" onClick={() => { closeNavbar(); navigate('/register'); }}>Register</Button>
                </div>
              </>
            ) : (
              <>
                <Nav.Link as="span" onClick={() => { closeNavbar(); handleLogout(); }} className="d-md-none">Logout</Nav.Link>
                <Button variant="outline-danger" className="d-none d-md-inline-block" onClick={() => { closeNavbar(); handleLogout(); }}>Logout</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
