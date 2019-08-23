import React, { Component } from "react";

class FollowButton extends Component {
    follow() {
        fetch("/api/followers/follow/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.props.username
            })
        })
        .then(() => window.location.reload());
    }

    render() {
        const followClass = this.props.configuration ? "d-none" : "d-inline";

        return (
            <div className={followClass}>
                {this.getButton()}
            </div>
        );
    }

    getButton() {
        if(this.props.state) {
            return (
                <button
                className={`btn btn-light ml-3`}
                onClick={this.follow.bind(this)}>
                    UnFollow
                </button>
            );
        } else {
            return (
                <button
                className={`btn btn-light ml-3`}
                onClick={this.follow.bind(this)}>
                    Follow
                </button>
            );
        }
    }
}

export default FollowButton;