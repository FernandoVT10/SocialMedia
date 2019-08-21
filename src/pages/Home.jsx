import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import Publication from "../components/Publication/Publication.jsx";
import Spinner from "../components/Spinner/Spinner.jsx";
import Register from "../components/Register/Register.jsx";

class Home extends Component {
    constructor() {
        super();

        this.state = {
            publications: [],
            isLoading: false,
            userLogin: false
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({
            isLoading: true
        });

        this.setState({userLogin: true});

        fetch("/api/publications/getPublications/",
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => this.setState({isLoading: false, publications: res}))
        .catch(e => this.setState({userLogin: false}));
    }

    render() {
        return (
            <div style={{minHeight: "100vh"}}>
                {this.getHome()}
            </div>
        );
    }

    getHome() {
        if(this.state.userLogin) {
            const publications = this.state.publications.map((p, index) => {
                return <Publication publication={p} key={index}/>;
            });

            return (
                <div>
                    <Navbar/>
                    <Spinner active={this.state.isLoading}/>
                    <div className="d-flex flex-wrap justify-content-center">
                        {publications}
                    </div>
                </div>
            );
        } else {
            return (
                <Register/>
            );
        }
    }
}

export default Home;