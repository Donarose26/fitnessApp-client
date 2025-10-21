export default function FooterComponent() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto w-100">
      <div className="container-fluid text-center px-4">
        {/* Brand Section */}
        <div className="mb-4">
          <h4 className="text-primary mb-2 fw-bold">FitnessTracker</h4>
          <p className="text-secondary small mb-2">
            Track your workouts, monitor progress, and achieve your fitness goals!
          </p>
          <div className="d-flex justify-content-center gap-3 mt-2">
            <a href="#" className="text-secondary fs-5">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-secondary fs-5">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-secondary fs-5">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>

        <hr className="border-secondary my-3 w-100" />

        {/* Bottom Section */}
        <div className="text-secondary small">
          © 2025 <span className="text-primary">FitnessTracker</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
