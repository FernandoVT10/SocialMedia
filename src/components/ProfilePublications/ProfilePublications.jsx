import React, { Component } from "react";
import Publication from "../Publication/Publication.jsx";
import Spinner from "../Spinner/Spinner.jsx";

class ProfilePublications extends Component {
    constructor() {
        super();

        this.state = {
            publications: [],
            isLoading: true,
            offset: true
        }

        this.offset = 0;
        this.limit = 3;

        this.loadMorePublications = this.loadMorePublications.bind(this);
    }

    UNSAFE_componentWillMount() {
        this.loadPublications()
    }

    loadPublications() {
        const userId = this.props.userId;

        fetch(`/api/publications/getProfilePublications/${userId}/${this.limit}/${this.offset}`,
        {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.token
            }
        })
        .then(res => res.json())
        .then(res => {
            const publications = this.state.publications;

            res.forEach(publication => {
                publications.push(publication);
            });

            this.setState({isLoading: false, publications: publications});

            if(res.length === this.limit) {
                this.setState({offset: true});
            } else {
                this.setState({offset: false});
            }
        });
    }

    loadMorePublications() {
        this.offset += this.limit;
        this.loadPublications();
    }

    render() {
        const loadMorePublicationsClass = this.state.offset ? "d-block" : "d-none";

        return (
            <div style={{
                display: "block",
                margin: "0 auto",
                width: "100%",
                maxWidth: "800px"
            }}>
                <Spinner active={this.state.isLoading} />
                {this.getPublications()}
                <button
                className={`btn btn-primary ${loadMorePublicationsClass} mx-auto mb-3`}
                onClick={this.loadMorePublications}>
                    Load more publications
                </button>
            </div>
        );
    }

    getPublications() {
        if(this.state.publications.length) {
            return this.state.publications.map((p, index) => {
                return <Publication publication={p} key={index}/>;
            });
        } else {
            return (
                <h3 className="font-weight-bold text-center">
                    The user not have publications.
                </h3>
            );
        }
    }
}

export default ProfilePublications;