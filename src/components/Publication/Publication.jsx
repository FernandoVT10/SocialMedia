import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Publication.scss";
import Comments from "./Comments.jsx";

class Publication extends Component {
    constructor() {
        super();

        this.state = {
            liked: false
        };
    }

    toggleLike() {
        this.setState({
            liked: !this.state.liked
        });
    }

    render() {
        return (
            <div className="publication">
                <div className="caption">
                    <Link to="/">
                        <img src="img/bg_01.png"></img>
                        Re:Zero
                    </Link>
                </div>

                <img src="img/bg_01.png" alt=""></img>

                <p className="message">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                    Exercitationem optio ex illo placeat qui? Odit sit harum dicta 
                    modi asperiores voluptatum autem magni debitis, fugit ipsa quos 
                    pariatur distinctio nemo obcaecati enim architecto est at temporibus 
                    blanditiis nulla facere ad cupiditate sed? Consectetur hic dolorem impedit 
                    itaque nemo pariatur dolorum.
                </p>

                <div className="options">
                    <button onClick={this.toggleLike.bind(this)}>
                        <span className={this.state.liked ? "fas fa-heart" : "far fa-heart"}></span>
                    </button>
                    <span className="likes">
                        255555 i like it
                    </span>
                </div>

                <Comments/>
            </div>
        );
    }
}

export default Publication;