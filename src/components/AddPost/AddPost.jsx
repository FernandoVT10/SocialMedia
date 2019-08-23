import React, { Component } from "react";

import "./AddPost.scss";

class AddPost extends Component {
    constructor() {
        super();

        this.state = {
            image: "",
            imageFile: null,
            content: "",
            error: ""
        }
    }

    handleInputFile(e) {
        this.setState(
            {
                image: URL.createObjectURL(e.target.files[0]),
                imageFile: e.target.files[0]
            }
        );
    }

    handleTextarea(e) {
        this.setState({content: e.target.value});
    }

    handleForm(e) {
        e.preventDefault();

        if(!this.state.imageFile) {
            this.setState({error: "Select a photo"});
            return;
        }

        const formData = new FormData();
        formData.append("imageFile", this.state.imageFile);
        formData.append("content", this.state.content);

        fetch("/api/publications/addPublication/",
        {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            },
            body: formData
        })
        .then(res => res.json())
        .then(res => window.location = "/")
        .catch(e => window.location = "/");
    }

    render() {
        const previewImageClass = this.state.image ? "d-block" : "d-none";
        const inputFileLabelClass = this.state.image ? "d-none" : "d-block";
        const alertClass = this.state.error ? "d-block" : "d-none";

        return (
            <div className="add-post-container">
                <div className={`alert alert-danger ${alertClass}`} role="alert">
                    {this.state.error}
                </div>
                <form onSubmit={this.handleForm.bind(this)}>
                    <div className="image-preview">
                        <img
                        className={previewImageClass}
                        src={this.state.image}
                        alt="Preview image" />

                        <label htmlFor="image" className={inputFileLabelClass}>
                            <span className="fas fa-upload"></span>
                            Post a photo
                        </label>
                        <input
                        type="file"
                        id="image"
                        onChange={this.handleInputFile.bind(this)} />
                    </div>

                    <textarea
                    placeholder="Add content"
                    maxLength="1000"
                    onChange={this.handleTextarea.bind(this)}
                    required />

                    <button className="btn btn-primary">Post</button>
                </form>
            </div>
        );
    }
}

export default AddPost;