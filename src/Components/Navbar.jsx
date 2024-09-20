import React from 'react';
import { Link } from 'react-router-dom';
import "./../css/img.css";

function Navbar() {
  return (
    <div>
      <div className="container-fluid sticky-top bg-dblue shadow-sm ">
        <div className="container">
          <nav className="navbar navbar-expand-lg bg-dblue navbar-light py-3 py-lg-0">
            <Link to="/" className="navbar-brand">
              <h1 className="m-0 text-uppercase text-primary">
                <i className="fa fa-clinic-medical me-2" />
                LifeLine
              </h1>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <div className="navbar-nav ms-auto py-0">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, document.getElementById('service-section').offsetTop)}>Services</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, document.getElementById('blood-section').offsetTop)}>Blood Availability</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, document.getElementById('near-section').offsetTop)}>Near Hospital</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, document.getElementById('appointment-section').offsetTop)}>Book Appointment</Link>
                  </li>
                </ul>
                <Link to="https://dlifeline.lawseer.co/" className="nav-link" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary">Go to Dashboard</button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
