import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import AddPost from "../components/AddPost/AddPost.jsx";
import validToken from "../services/validToken.js";

class Upload extends Component {
    UNSAFE_componentWillMount() {
        validToken();
    }

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