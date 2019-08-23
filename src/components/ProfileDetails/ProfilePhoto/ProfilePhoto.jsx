import React, { Component } from "react";

import "./ProfilePhoto.scss";

class ProfilePhoto extends Component {
    constructor() {
        super();

        this.state = {
            image: "",
            isLoading: false
        }
    }

    handleInputFile(e) {
        this.setState({
            image: URL.createObjectURL(e.target.files[0]),
            isLoading: true
        });

        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        fetch("/api/configuration/changePhoto/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            },
            body: formData
        })
        .then(res => res.json())
        .then(() => this.setState({isLoading: false}))
        .catch(e => window.location = "/");
    }

    render() {
        const image = this.state.image ? this.state.image : `../img/users/${this.props.image}`;
        const loaderClass = this.state.isLoading ? "d-flex" : "d-none";

        // check if the profile is from The user
        // if we do not remove the photo change
        const configurationClass = this.props.configuration ? "d-block" : "d-none";
        const previewImageClass = this.props.configuration ? "d-none" : "d-block";

        return (
            <div className="profile-photo">
                <div className={configurationClass}>
                    <label
                    className="image"
                    style={{background: `url(${image})`}}
                    htmlFor="input-image"
                    title="Change profile photo"></label>

                    
                    <div className={`loader ${loaderClass}`}>
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>

                    <input type="file" id="input-image" onChange={this.handleInputFile.bind(this)} />
                </div>
                <div className={previewImageClass}>
                    <div
                    className="image"
                    style={{background: `url(${image})`}}></div>
                </div>
            </div>
        );
    }
}

export default ProfilePhoto;