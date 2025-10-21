import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent'
import UserContext from '../UserContext';


export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // ✅ Access global user state

  return (
  <>
  {/* Pass the REAL login state */}
  <NavbarComponent isLoggedIn={!!user} toggleLogin={() => {}} />

    {/* Hero Section */}
    <section id="homepage" style={{
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.20)), url(/images/background.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      overflow: "hidden",
      height: "auto"
    }}>
    <div className="container-fluid p-5 mt-5 text-dark">
      <div className="row d-flex justify-content-start align-items-center py-md-0 my-md-5 mx-5">
        <div className="col-6 my-0 bg-white p-4 rounded-shadow ">
          <h1>
            Welcome to <span className="text-primary">Fitness Tracker</span>
          </h1>
          <p>
            Transform your fitness journey with our comprehensive workout
            tracking platform. Monitor your progress, set goals, and achieve
            results.
          </p>
          <Button variant="primary" className="me-2" onClick={() => navigate('/workouts')}> Get Started
          </Button>
          <Button variant="outline-primary">Learn More</Button>     
        </div>
      </div>
    </div>
  </section>


  {/*Why Choose Us*/}
  <section id="About">
    <div className="container py-5">
      {/* Title Section */}
      <div className="row justify-content-center align-items-center mb-4">
        <div className="col-12 text-center">
          <h2
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "30px",
            fontWeight: "600",
          }}
          >
          Why Choose Fitness Tracker?
        </h2>
        <p>
          Discover the features that make our platform the perfect companion for your fitness journey.
        </p>
      </div>
    </div>

    <div className="row about-section text-center">
      <div className="col-md-4 mb-4">
        <i className="ri-line-chart-line" 
        style={{
          backgroundColor: "lightblue",
          color: "blue"}}></i>
          <h3 className="text-primary mt-4">Track Progress</h3>
          <p>
            Monitor your fitness journey with detailed analytics, progress charts, and performance insights to stay motivated and on track.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <i className="ri-target-line" style={{
            backgroundColor: "lightgreen",
            color:"green"
          }}></i>
          <h3 className="text-primary mt-4">Set Goals</h3>
          <p>
            Define personalized fitness goals and milestones. Our platform helps you break down big objectives into achievable daily targets.
          </p>
        </div>

        <div className="col-md-4 mb-4">
          <i className="ri-calendar-check-line" style={{
            backgroundColor: "#FA8128",
            color:"#C95B0C"
          }}></i>
          <h3 className="text-primary mt-4">Stay Consistent</h3>
          <p>
            Build lasting habits with workout reminders, streak tracking, and motivational features designed to keep you consistent.
          </p>
        </div>
      </div>
    </div>
  </section>
    
  
  <FooterComponent />
  </>
  );
}
