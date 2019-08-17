import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Navbar.scss";

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <a className="navbar-brand font-weight-bold" href="/">SocialMedia</a>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/upload/">
                                <span className="fas fa-camera-retro"></span>
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/users/">
                                <span className="fas fa-search"></span>
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/myProfile/">
                                <span className="fas fa-user"></span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;