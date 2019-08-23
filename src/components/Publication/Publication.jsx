import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Publication.scss";
import Comments from "./Comments.jsx";

class Publication extends Component {
    constructor() {
        super();

        this.state = {
            liked: false,
            isDeleted: false,
            likes: 0
        };
    }

    toggleLike() {
        const likes = this.state.likes += !this.state.liked ? 1 : -1;

        fetch("/api/likes/like/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicationId: this.props.publication.publication._id
            })
        })
        .then(res => res.json())
        .then(res => this.setState({liked: !this.state.liked, likes: likes}))
        .catch(e => window.location = "/");
    }

    deletePublication() {
        if(!confirm("Are you sure to delete this post?")) {
            return;
        }

        fetch("/api/publications/deletePublication/",
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicationId: this.props.publication.publication._id
            })
        })
        .then(res => res.json())
        .then(res => this.setState({isDeleted: true}))
        .catch(e => window.location = "/");
    }

    UNSAFE_componentWillMount() {
        this.setState({
            liked: this.props.publication.publication.liked,
            likes: this.props.publication.publication.likes
        });
    }

    render() {
        // The "props.publication" have 2 objects
        // 1: "publication" where is the publication data
        // 2: "user" where is the user data
        const publication = this.props.publication.publication;
        const user = this.props.publication.user;
        const publicationClass = this.state.isDeleted ? "d-none" : "d-block";

        return (
            <div className={`publication ${publicationClass}`}>
                <div className="caption">
                    <Link to={`/profile/${user.Username}`}>
                        <div
                        className="image"
                        style={{background: `url(${__dirname}img/users/${user.Image})`}}></div>
                        {user.Username}
                    </Link>
                </div>

                <img src={`${__dirname}img/publications/${publication.Image}`} alt="Publication Image" />

                <p className="message">
                    {publication.Content}
                </p>

                <div className="options">
                    <button onClick={this.toggleLike.bind(this)}>
                        <span className={this.state.liked ? "fas fa-heart" : "far fa-heart"}></span>
                    </button>
                    <button
                    className={publication.isFromTheUser ? "d-inline" : "d-none"}
                    onClick={this.deletePublication.bind(this)}>
                        <span className="far fa-trash-alt"></span>
                    </button>
                    <span className="likes">
                        {this.state.likes} I Like It
                    </span>
                </div>

                <Comments publicationId={publication._id}/>
            </div>
        );
    }
}

export default Publication;