import React, { Component } from "react";
import { Link } from "react-router-dom";

class Comments extends Component {
    constructor() {
        super();

        this.state = {
            comments: [],
            message: "",
            isLoading: false,
            offset: false
        }

        this.limit = 10;
        this.offset = 0;
    }

    UNSAFE_componentWillMount() {
        this.getComments();
    }

    getComments() {
        this.setState({
            isLoading: true
        });

        fetch(`/api/comments/getComments/${this.props.publicationId}/${this.limit}/${this.offset}`,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.length === 10) {
                this.setState({offset: true});
            } else {
                this.setState({offset: false});
            }
            
            const comments = this.state.comments;

            res.forEach(comment => {
                comments.push(comment);
            });

            this.setState({isLoading: false, comments: comments})
        });
    }

    handleInput(e) {
        this.setState({message: e.target.value});
    }

    handleForm(e) {
        e.preventDefault();

        fetch("/api/comments/addComment/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                publicationId: this.props.publicationId,
                message: this.state.message
            })
        })
        .then(res => res.json())
        .then(res => {
            const comments = this.state.comments;
            comments.push(res);

            this.setState(
                {
                    comments: comments,
                    message: ""
                }
            );
        })
        .catch(e => window.location = "/");
    }

    loadMoreComments() {
        this.offset += this.limit;
        this.getComments();
    }

    deleteComment(commentId) {
        if(!confirm("Are you sure to delete this comment?")) {
            return;
        }

        fetch("/api/comments/deleteComment/",
        {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                commentId: commentId
            })
        })
        .then(res => res.json())
        .then(res => {
            const comments = this.state.comments.filter(c => c.comment._id !== commentId);

            this.setState(
                {
                    comments: comments
                }
            );
        })
        .catch(e => window.location = "/");
    }

    render() {
        const comments = this.state.comments.map((c, index) => {
            const deleteMenuClass = c.comment.isFromTheUser ? "d-block" : "d-none";

            return (
                <div className="comment" key={index}>
                    <Link to={`/profile/${c.user.Id}`}>
                        {c.user.Username}
                    </Link>
                    
                    {c.comment.Message}

                    <div className={`dropleft ${deleteMenuClass}`}>
                        <button
                        id="comment-dropdown"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                            <span className="fas fa-ellipsis-h"></span>
                        </button>
                        <div className="dropdown-menu" aria-labelledby="comment-dropdown">
                            <button
                            onClick={() => {this.deleteComment(c.comment._id)}}
                            className="dropdown-item">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            );
        });

        const loadMoreCommentsClass = this.state.offset ? "d-block" : "d-none";

        return (
            <div className="comments">
                {comments}
                <button
                className={`btn btn-link ${loadMoreCommentsClass}`} 
                onClick={this.loadMoreComments.bind(this)}>
                    Load more comments
                </button>
                <hr/>
                <div className="publish-comment">
                    <form onSubmit={this.handleForm.bind(this)}>
                        <textarea
                        type="text"
                        placeholder="Add a comment"
                        onChange={this.handleInput.bind(this)}
                        value={this.state.message}
                        required />

                        <button>
                            <span className="fas fa-paper-plane"></span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Comments;