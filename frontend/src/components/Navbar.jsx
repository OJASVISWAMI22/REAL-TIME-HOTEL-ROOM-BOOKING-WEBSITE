import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary navnav">
      <div className="container-fluid">
        <a className="navbar-brand title" href="/home">
          TravelNest
        </a>

        <div className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            {user ? (
              <div className="dropdown xx">
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
                  <a className="dropdown-item" href="/profile">
                    Profile
                  </a>
                  <a className="dropdown-item" href="#" onClick={logout}>
                    Logout
                  </a>
                </div>
              </div>
            ) : (
              <>
                <a className="nav-link abc xx" href="/login">
                  Login
                </a>
                <a className="nav-link abc xx" href="/register">
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
