import React, { Component } from "react";

import "./Spinner.scss";

class Spinner extends Component {
    render() {
        const spinnerClass = this.props.active ? "active" : "";

        return (
            <div className={`spinner ${spinnerClass}`}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}

export default Spinner;