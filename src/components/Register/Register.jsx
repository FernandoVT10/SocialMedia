import React, { Component } from "react";
import { Link } from "react-router-dom";
import validateEmail from "../../services/validateEmail.js";

import "./Register.scss";
import Spinner from "../Spinner/Spinner.jsx";

class Register extends Component {
    constructor() {
        super();

        this.state = {
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
            error: ""
        };

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        this.setState({error: ""});

        if(e.target.id === "username") {
            this.setState({username: e.target.value});
        } else if(e.target.id === "email") {
            this.setState({email: e.target.value});
        } else if(e.target.id === "password") {
            this.setState({password: e.target.value});
        } else if(e.target.id === "repeat-password") {
            this.setState({repeatPassword: e.target.value});
        }
    }

    handleForm(e) {
        e.preventDefault();

        if(this.state.username.length < 4 || this.state.username.length > 20) {
            this.setState({error: "The username must be at least 4 characters"});
            return;
        } else if(!validateEmail(this.state.email)) {
            console.log(this.state.email);
            this.setState({error: "The email is invalid"});
            return;
        } else if(this.state.password.length < 6) {
            this.setState({error: "The password must be at least 6 characters"});
            return;
        } else if(this.state.password.length !== this.state.repeatPassword.length) {
            this.setState({error: "Passwords do not match"});
            return;
        }

        fetch("/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                this.setState({error: res.error});
            } else if(res.success) {
                window.location = "/login/";
            }
        });
    }

    render() {
        const alert = this.state.error ? "d-block" : "d-none";
        return (
            <div className="register-form-container">
                <form className="register-form" onSubmit={this.handleForm.bind(this)}>
                    <div className={`alert alert-danger ${alert}`} role="alert">
                        {this.state.error}
                    </div>
                    <h3>Register</h3>
                    <div className="input-group">
                        <input
                        type="text"
                        id="username"
                        onChange={this.handleInput}
                        maxLength="20"
                        required />
                        <label htmlFor="username">Username</label>
                    </div>

                    <div className="input-group">
                        <input
                        type="text"
                        id="email"
                        onChange={this.handleInput}
                        required />
                        <label htmlFor="email">Email</label>
                    </div>

                    <div className="input-group">
                        <input
                        type="password"
                        id="password"
                        onChange={this.handleInput}
                        required />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="input-group">
                        <input
                        type="password"
                        id="repeat-password"
                        onChange={this.handleInput}
                        required />
                        <label htmlFor="repeat-password">Repeat password</label>
                    </div>

                    <button>Sign Up</button>

                    <Link to="/register/">Do you already have an account?</Link>
                </form>
            </div>
        );
    }
}

export default Register;