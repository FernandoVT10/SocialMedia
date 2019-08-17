import React, { Component } from "react";
import Home from "../pages/Home.jsx";
import { Route } from "react-router-dom";

import "./App.scss";

class App extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Home}/>
            </div>
        );
    }
}

export default App;