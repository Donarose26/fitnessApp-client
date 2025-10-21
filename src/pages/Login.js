import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

import UserContext from '../UserContext';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';


export default function Login() {
  const navigate = useNavigate();
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  function authenticate (e) {
    e.preventDefault();

    fetch('https://fitnessapi-agpalza-1.onrender.com/users/login', {
      method: 'POST',
      headers: { 
            "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        email: email,
        password: password
       })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access !== undefined) {
          console.log(data.access);
          localStorage.setItem('token', data.access);
          retrieveUserDetails(data.access);
          navigate('/homepage');
          notyf.success({ message: 'Successful Login', duration: 3000, dismissible: true });
        } else if (data.message === "Incorrect email or password") {
          notyf.error("Incorrect Credentials. Try Again.");
        } else {
          notyf.error('User Not Found. Try Again.');
        }
      });

    setEmail('');
    setPassword('');
  };

// RETRIEVE USER DETAILS
  const retrieveUserDetails = (token) => {
    fetch('https://fitnessapi-agpalza-1.onrender.com/users/details', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser({ id: data.user._id });
      });
  };

  // Enable submit button when fields are populated
  useEffect(() => {
    if (email !== '' && password !== '') setIsActive(true);
    else setIsActive(false);
  }, [email, password]);



  return (


    <div className="d-flex flex-column">
      <NavbarComponent isLoggedIn={false} toggleLogin={() => {}} />

      <hr className="my-4" />

    <div className="container d-flex flex-column py-5" id="login">
      {/* Login Card */}
      <div className="row d-flex justify-content-center align-items-center flex-grow-1 ">
        <div className="card card-custom">
          <div className="text-center mb-4">
            <h1 className="mb-2">Welcome Back</h1>
            <p className="text-muted mb-0">Sign in to your FitnessTracker account</p>
          </div>

          <Form onSubmit={authenticate} className="position-relative">
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
              />
              <i className="bi bi-envelope form-icon-left"></i>
            </div>
          

            {/* Password */}
            <div className="mb-3 position-relative">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control-custom"
            
              />
              <i className="bi bi-lock form-icon-left"></i>
              <i
                className={showPassword ? "bi bi-eye form-icon-right" : "bi bi-eye-slash form-icon-right"}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            {/* Remember Me */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="d-flex align-items-center mb-0 gap-2">
                <div
                  className={`checkbox-custom ${rememberMe ? 'checked' : ''}`}
                  onClick={() => setRememberMe(!rememberMe)}
                  
                >
                  <i className="bi bi-check d-flex justify-content-center align-items-center"></i>
                </div>
                <input type="checkbox" className="d-none" checked={rememberMe} readOnly /> Remember me
              </label>
              <a href="#" className="text-primary text-decoration-none">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <Button variant={isActive ? "primary" : "danger"} type="submit" className="w-100 mb-3" disabled={!isActive}>
              <i className="bi bi-box-arrow-in-right text-light">
             Sign In
            </i>
             
            </Button>

    
             {/* Register Link */}
            <p className="text-center text-muted mt-3 mb-0">
              Don't have an account? 
              <Link to="/register" className="text-primary fw-semibold text-decoration-none ms-1">
              Register here
            </Link>
          </p>
            <hr className="my-4" />

            {/* Social Login */}
           <p className="text-center text-muted small mb-3">Or continue with</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="https://accounts.google.com/" target="_blank" rel="noopener noreferrer">
                <button type="button" className="social-btn">
                  <i className="bi bi-google text-danger"></i>
                </button>
              </a>

              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <button type="button" className="social-btn">
                  <i className="bi bi-facebook text-primary"></i>
                </button>
              </a>

              <a href="https://www.apple.com/" target="_blank" rel="noopener noreferrer">
                <button type="button" className="social-btn">
                  <i className="bi bi-apple text-dark"></i>
                </button>
              </a>
            </div>

          </Form>
        </div>
      </div>
    </div>
    </div>
    
  );
}
