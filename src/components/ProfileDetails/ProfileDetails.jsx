import React, { Component } from "react";
import ProfilePhoto from "./ProfilePhoto/ProfilePhoto.jsx";
import Details from "./Details/Details.jsx";

class ProfileDetails extends Component {
    constructor() {
        super();
    }

    render() {
        const user = this.props.user;
        return (
            <div>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    width: "100%",
                    maxWidth: "800px",
                    margin: "30px auto"
                }}>
                    <ProfilePhoto image={user.Image} configuration={user.isMyProfile} />
                    <Details
                    configuration={user.isMyProfile}
                    username={user.Username}
                    following={user.following}
                    followers={user.followers}
                    followingStatus={user.followingStatus} />
                </div>
            </div>
        );
    }
}

export default ProfileDetails;