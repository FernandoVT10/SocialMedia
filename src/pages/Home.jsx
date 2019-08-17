import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Publication from "../components/Publication/Publication.jsx";

class Home extends Component {
    render() {
        return (
            <div style={{background: "#f1f1f1"}}>
                <Navbar/>
                <div className="d-flex justify-content-center">
                    <Publication/>
                </div>
            </div>
        );
    }
}

export default Home;