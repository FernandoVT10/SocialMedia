import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import AddPost from "../components/AddPost/AddPost.jsx";

class Upload extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <AddPost/>
            </div>
        );
    }
}

export default Upload;