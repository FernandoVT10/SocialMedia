import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import validToken from "../services/validToken";
import ProfileDetails from "../components/ProfileDetails/ProfileDetails.jsx";
import Spinner from "../components/Spinner/Spinner.jsx";
import ProfilePublications from "../components/ProfilePublications/ProfilePublications.jsx";

class Profile extends Component {
    constructor(data) {
        super();

        this.state = {
            error: "",
            user: null,
            isLoading: true
        }

        this.username = data.match.params.username;
    }

    UNSAFE_componentWillMount() {
        validToken();

        fetch(`/api/users/getProfile/${this.username}`,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                this.setState({error: res.error});
            } else {
                // check if is the profile form the user
                fetch(`/api/configuration/isMyProfile/${res.Username}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + window.localStorage.token
                    }
                })
                .then(res => res.json())
                .then(status => {
                    const user = res;
                    user.isMyProfile = status;
                    this.setState({user: user, isLoading: false});
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Navbar/>
                <Spinner active={this.state.isLoading} />
                {this.getProfile()}
            </div>
        );
    }

    getProfile() {
        if(this.state.error) {
            return (
                <div style={
                    {
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        alignItems: "center",
                        height: "80vh"
                    }
                    }>
                    <h4 className="d-block font-weight-bold">
                        {this.state.error}
                    </h4>
                </div>
            );
        } else {
            if(this.state.user) {
                return (
                    <div>
                        <ProfileDetails user={this.state.user} />
                        <ProfilePublications userId={this.state.user._id} />
                    </div>
                );
            }
        }
    }
}

export default Profile;