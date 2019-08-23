import React, { Component } from "react";
import { Link } from "react-router-dom";
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
            userLogin: false,
            offset: false
        };

        this.limit = 3;
        this.offset = 0;
    }

    UNSAFE_componentWillMount() {
        this.getPublications();
    }

    getPublications() {
        this.setState({
            isLoading: true
        });

        this.setState({userLogin: true});

        fetch(`/api/publications/getPublications/${this.limit}/${this.offset}`,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.length === this.limit) {
                this.setState({offset: true});
            } else {
                this.setState({offset: false});
            }

            const publications = this.state.publications;

            res.forEach(publication => {
                publications.push(publication);
            });

            this.setState({isLoading: false, publications: publications});
        })
        .catch(e => this.setState({userLogin: false}));
    }

    loadMorePublications() {
        this.offset += this.limit;
        this.getPublications();   
    }

    render() {
        const loadMorePublicationsClass = this.state.offset ? "d-block" : "d-none";

        return (
            <div>
                {this.getHome()}
                <button
                className={`btn btn-link mx-auto mb-3 ${loadMorePublicationsClass}`}
                onClick={this.loadMorePublications.bind(this)}>
                    Load more publications
                </button>
            </div>
        );
    }

    getHome() {
        if(this.state.userLogin) {
            const publications = this.state.publications.map((p, index) => {
                return <Publication publication={p} key={index}/>;
            });

            const notFoundClass = publications.length ? "d-none" : "d-flex";

            return (
                <div>
                    <Navbar/>
                    <Spinner active={this.state.isLoading}/>
                    <div className="d-flex flex-wrap justify-content-center">
                        {publications}
                    </div>
                    <div className={notFoundClass} style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "90vh"
                        }}>
                        <h3 className="text-center font-weight-bold">
                            No publications available
                        </h3>
                        <h4 className="text-center">
                            <Link to="/explore/">Search users</Link>
                        </h4>
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