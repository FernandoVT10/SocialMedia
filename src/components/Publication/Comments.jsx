import React, { Component } from "react";

class Comments extends Component {
    render() {
        return (
            <div className="comments">
                <div className="comment">
                    <span className="username">User Test</span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, minima!
                </div>
                <div className="comment">
                    <span className="username">User Test 2</span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Reprehenderit iure, veritatis repudiandae sunt aut fugit!
                </div>
                <hr/>
                <div className="publish-comment">
                    <form>
                        <textarea
                        type="text"
                        placeholder="Add a comment"></textarea>

                        <button type="button">
                            <span className="fas fa-paper-plane"></span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Comments;