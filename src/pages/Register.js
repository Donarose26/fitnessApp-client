import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import '../index.css';

export default function Register() {
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    fetch('https://fitnessapi-agpalza-1.onrender.com/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Registered Successfully') {
          notyf.success({ message: 'Registration Successful!', duration: 1000, dismissible: true });
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (data.error) {
          notyf.error(data.error);
        } else {
          notyf.error('Registration failed. Try again.');
        }
      })
      .catch(err => {
        console.error(err);
        notyf.error('Network error. Please try again later.');
      })
      .finally(() => {
        setIsSubmitting(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAgreed(false);
      });
  }

  // Enable submit button dynamically
  useEffect(() => {
    if (email !== '' && password !== '' && confirmPassword !== '' && termsAgreed) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password, confirmPassword, termsAgreed]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent isLoggedIn={false} toggleLogin={() => {}} />

      <hr className="my-4" />

      <div className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5">
        <div className="row card card-custom">
          <div className="text-center mb-4">
            <h1 className="fw-bold mb-2">Create Account</h1>
            <p className="text-muted mb-0">Join FitnessTracker to start your fitness journey</p>
          </div>

          <Form onSubmit={handleSubmit} className="position-relative">
            {/* Full Name */}
            <div className="mb-3 position-relative">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="form-control-custom"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', height: '3rem' }}
              />
              <i className="bi bi-person form-icon-left" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(20%)', color: '#9ca3af' }}></i>
            </div>

            {/* Email */}
            <div className="mb-3 position-relative">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control-custom"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', height: '3rem' }}
              />
              <i className="bi bi-envelope form-icon-left" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(20%)', color: '#9ca3af' }}></i>
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control-custom"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', height: '3rem' }}
              />
              <i className="bi bi-lock form-icon-left"></i>
              <i
                className={showPassword ? 'bi bi-eye form-icon-right' : 'bi bi-eye-slash form-icon-right'}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* Confirm Password */}
            <div className="mb-3 position-relative">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="form-control-custom"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', height: '3rem' }}
              />
              <i className="bi bi-lock form-icon-left"></i>
              <i
                className={showConfirm ? 'bi bi-eye form-icon-right' : 'bi bi-eye-slash form-icon-right'}
                onClick={() => setShowConfirm(!showConfirm)}
              ></i>
            </div>

            {/* Terms */}
            <div className="mb-3 d-flex align-items-center gap-2">
              <div
                className={`checkbox-custom ${termsAgreed ? 'checked' : ''}`}
                onClick={() => setTermsAgreed(!termsAgreed)}
              >
                <i className="bi bi-check"></i>
              </div>
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </div>

            <Button type="submit" className="btn-primary-custom w-100" disabled={isSubmitting}>
              <i className="bi bi-person-plus"></i> {isSubmitting ? 'Submitting...' : 'Create Account'}
            </Button>
            <p className="text-center text-muted mt-3 mb-0">
              Have an account? 
              <Link to="/login" className="text-primary fw-semibold text-decoration-none ms-1">
                Login here
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
