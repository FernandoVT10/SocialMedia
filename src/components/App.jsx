import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Upload from "../pages/Upload.jsx";
import Explore from "../pages/Explore.jsx";
import Profile from "../pages/Profile.jsx";

import "./App.scss";

class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/login/" component={Login} />
                    <Route path="/upload/" component={Upload} />
                    <Route path="/explore/" component={Explore} />
                    <Route path="/profile/:username" component={Profile} />
                </Switch>
            </div>
        );
    }
}

export default App;