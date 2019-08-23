import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Navbar.scss";

class Navbar extends Component {
    constructor() {
        super();

        this.state = {
            username: ""
        };
    }

    UNSAFE_componentWillMount() {
        fetch("/api/users/getUserByToken/",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => this.setState({username: res.Username}))
        .catch(e => console.log(e));
    }

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
                            <Link className="nav-link" to="/explore/">
                                <span className="far fa-compass"></span>
                            </Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to={`/profile/${this.state.username}`}>
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