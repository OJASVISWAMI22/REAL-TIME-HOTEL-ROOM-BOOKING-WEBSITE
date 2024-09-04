import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navnav">
      <div className="container-fluid">
        <a className="navbar-brand title" href="#">
          TravelNest
        </a>

        <div className="collapse navbar-collapse">
          <div className="navbar-nav">
            <a className="nav-link abc l" href="/login">
              Login
            </a>
            <a className="nav-link abc s" href="/signup">
              SignUp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
