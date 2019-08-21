import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();

        this.state = {
            username: "",
            password: "",
            error: ""
        };

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        this.setState({error: ""});

        if(e.target.id === "username") {
            this.setState({username: e.target.value});
        } else if(e.target.id === "password") {
            this.setState({password: e.target.value});
        }
    }

    handleForm(e) {
        e.preventDefault();

        fetch("/api/users/login/", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                this.setState({error: res.error});
            } else if(res.success) {
                window.localStorage.setItem("token", res.token);
                window.location = "/";
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
                    <h3>Login</h3>
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
                        type="password"
                        id="password"
                        onChange={this.handleInput}
                        required />
                        <label htmlFor="password">Password</label>
                    </div>

                    <button>Sign In</button>

                    <Link to="/">Do you not have an account?</Link>
                </form>
            </div>
        );
    }
}

export default Login;