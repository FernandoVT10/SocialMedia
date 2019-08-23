import React, { Component } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import validToken from "../services/validToken";
import UserCard from "../components/UserCard/UserCard.jsx";

class Explore extends Component {
    constructor() {
        super();

        this.state = {
            users: [],
            search: ""
        };

        this.limit = 10;
        this.offset = 0;
    }

    UNSAFE_componentWillMount() {
        validToken();

        fetch(`/api/users/getUsers/${this.limit}/${this.offset}`)
        .then(res => res.json())
        .then(res => this.setState({users: res}));
    }

    handleInput(e) {
        this.setState({search: e.target.value});
    }

    search(e) {
        e.preventDefault();
        fetch(`/api/users/searchUsers/${this.state.search}/${this.limit}/${this.offset}`)
        .then(res => res.json())
        .then(res => this.setState({users: res}));
    }

    render() {
        const userCards = this.state.users.map((user, index) => {
            return <UserCard username={user.username} image={user.image} key={index} />
        });

        const noResultsFoundClass = userCards.length ? "d-none" : "d-block";

        return (
            <div>
                <Navbar/>
                
                <div style={{
                    display: "flex",
                    width: "100%",
                    flexWrap: "wrap",
                    padding: "20px"
                }}
                className="justify-content-center justify-content-sm-between">
                    <h5 className="font-weight-bold">Search user</h5>
                    <form className="form-inline flex-nowrap" onSubmit={this.search.bind(this)}>
                        <input
                        className="form-control"
                        placeholder="Search a user"
                        onChange={this.handleInput.bind(this)}
                        required
                        minLength="3" />
                        <button className="btn btn-primary text-center">
                            <span className="fas fa-search"></span>
                        </button>
                    </form>
                </div>

                <div
                style={{display: "flex", flexWrap: "wrap"}}
                className="justify-content-center justify-content-md-start">
                    {userCards}
                    <h3 className={`font-weight-bold mx-auto ${noResultsFoundClass}`}>
                        No results found
                    </h3>
                </div>
            </div>
        );
    }
}

export default Explore;