import React, { Component } from "react";
import FollowButton from "../FollowButton/FollowButton.jsx";

class Details extends Component {
    constructor() {
        super();

        this.state = {
            username: "",
            usernameError: "",
            currentPassword: "",
            password: "",
            repeatPassword: "",
            passwordError: "",
            passwordSuccess: ""
        }

        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        if(e.target.id === "username") {
            this.setState({username: e.target.value});
        } else if(e.target.id === "current-password") {
            this.setState({currentPassword: e.target.value});
        } else if(e.target.id === "new-password") {
            this.setState({password: e.target.value});
        } else if(e.target.id === "repeat-new-password") {
            this.setState({repeatPassword: e.target.value});
        }
    }

    logout() {
        window.localStorage.removeItem("token");
        window.location = "/";
    }

    changeUsername() {
        if(this.state.username.length >= 4) {
            fetch("/api/configuration/changeUsername/",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + window.localStorage.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: this.state.username
                })
            })
            .then(res => res.json())
            .then(res => {
                if(res.error) {
                    this.setState({usernameError: res.error});
                } else {
                    window.location = `/profile/${this.state.username}`;
                }
            });
        } else {
            this.setState({usernameError: "The username must be at least 4 characters"});
        }
    }

    changePassword() {
        this.setState({passwordError: "", passwordSuccess: ""});

        if(this.state.password.length < 6) {
            this.setState({passwordError: "The password must be at least 6 characters"});
            return;
        } else if(this.state.password !== this.state.repeatPassword) {
            this.setState({passwordError: "Passwords do not match"});
            return;
        }

        fetch("/api/configuration/changePassword/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.password
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                this.setState({passwordError: res.error});
            } else {
                this.setState({
                    currentPassword: "",
                    password: "",
                    repeatPassword: "",
                    passwordError: "",
                    passwordSuccess: res.success
                });
            }
        });
    }

    render() {
        const userOptions = this.props.configuration ? "d-inline" : "d-none";
        const usernameErrorClass = this.state.usernameError ? "d-block" : "d-none";
        const passwordErrorClass = this.state.passwordError ? "d-block" : "d-none";
        const passwordSuccessClass = this.state.passwordSuccess ? "d-block" : "d-none";

        return (
            <div className="p-5">
                <span className="h4">{this.props.username}</span>

                <FollowButton
                configuration={this.props.configuration}
                state={this.props.followingStatus}
                username={this.props.username} />

                {/* USER OPTIONS */}

                <button
                className={`btn btn-light ml-3 ${userOptions}`}
                onClick={this.logout}>
                    Logout
                </button>

                <div className={`dropdown ${userOptions}`}>
                    <button className="btn"
                    id="configuration-menu"
                    data-toggle="dropdown">
                        <span className="fas fa-cog"></span>
                    </button>
                    <div className="dropdown-menu" aria-labelledby="configuration-menu">
                        <button
                        className="dropdown-item"
                        data-toggle="modal"
                        data-target="#change-username-modal">
                            Change username
                        </button>
                        <button
                        className="dropdown-item"
                        data-toggle="modal"
                        data-target="#change-password-modal">
                            Change password
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <span className="mr-3">
                        <b>{this.props.following}</b> Following
                    </span>
                    <span>
                        <b>{this.props.followers}</b> Followers
                    </span>
                </div>

                {/* CHANGE UERNAME MODAL */}

                <div className="modal fade" id="change-username-modal" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Change username</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div
                            className={`alert alert-danger ${usernameErrorClass}`}
                            role="alert">
                                {this.state.usernameError}
                            </div>

                            <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username"
                            onChange={this.handleInput} />
                        </div>
                        <div className="modal-footer">
                            <button
                            className="btn btn-primary"
                            onClick={this.changeUsername.bind(this)}>
                                Accept
                            </button>
                            <button className="btn btn-danger" data-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* CHANGE PASSWORD MODAL */}

                <div className="modal" id="change-password-modal" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Change password</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div
                            className={`alert alert-danger ${passwordErrorClass}`} role="alert">
                                {this.state.passwordError}
                            </div>

                            <div
                            className={`alert alert-success ${passwordSuccessClass}`} role="alert">
                                {this.state.passwordSuccess}
                            </div>

                            <input
                            type="password"
                            className="form-control"
                            id="current-password"
                            placeholder="Current password"
                            onChange={this.handleInput}
                            value={this.state.currentPassword} />

                            <input
                            type="password"
                            className="form-control mt-3"
                            id="new-password"
                            placeholder="New password"
                            onChange={this.handleInput}
                            value={this.state.password} />

                            <input
                            type="password"
                            className="form-control mt-3"
                            id="repeat-new-password"
                            placeholder="Repeat new password"
                            onChange={this.handleInput}
                            value={this.state.repeatPassword} />
                        </div>
                        <div className="modal-footer">
                            <button
                            className="btn btn-primary"
                            onClick={this.changePassword.bind(this)}>
                                Accept
                            </button>
                            <button className="btn btn-danger" data-dismiss="modal">
                                Cancel
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Details;