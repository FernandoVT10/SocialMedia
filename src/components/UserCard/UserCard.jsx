import React, { Component } from "react";

import "./UserCard.scss";

class UserCard extends Component {
    handleCard() {
        window.location = `/profile/${this.props.username}`;
    }

    render() {
        return (
            <div className="user-card" onClick={this.handleCard.bind(this)}>
                <div
                className="image"
                style={{
                    background: `url(${__dirname}img/users/${this.props.image})`
                }}></div>
                <h4>{this.props.username}</h4>
            </div>
        );
    }
}

export default UserCard;