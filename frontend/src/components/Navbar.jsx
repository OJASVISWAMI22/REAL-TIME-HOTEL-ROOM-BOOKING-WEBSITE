import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout=()=>{
    localStorage.removeItem(user);
    window.location.href='/login'
  }
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navnav">
      <div className="container-fluid">
        <a className="navbar-brand title" href="#">
          TravelNest
        </a>

        <div className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  onClick={toggleDropdown}
                  aria-expanded={isOpen}
                >
                  {user.name}
                </button>
                <div
                  className={`dropdown-menu${isOpen ? " show" : ""}`}
                  aria-labelledby="dropdownMenuButton"
                >
                  <a className="dropdown-item" href="#">
                    Bookings
                  </a>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    Logout
                  </a>
                </div>
              </div>
            ) : (
              <>
                <a className="nav-link abc l" href="/login">
                  Login
                </a>
                <a className="nav-link abc s" href="/register">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

