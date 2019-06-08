import React, {Component} from 'react'
import './Invitation.css'

class Invitation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invitationId: props.match.params.invitationId,
            invitationStatus: ""
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.getInvitationState = this.getInvitationState.bind(this);
    }

    getInvitationState() {
        const component = this;
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/api/invitation/" + this.state.invitationId;
        http.open("GET", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "GET");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(null);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    component.setState({
                        invitationStatus: "Confirmed"
                    })
                } else {
                    if (response.description === "no user") {
                        component.setState({
                            invitationStatus: "No user"
                        })
                    } else if (response.description === "confirmed") {
                        component.setState({
                            invitationStatus: "Already confirmed"
                        })
                    } else {
                        component.setState({
                            invitationStatus: "No invitation"
                        })
                    }
                }
            }
        };
    }

    componentWillMount() {
        this.getInvitationState()
    }


    render() {
        return (<div id={"invitation-flex-div"}>
            <div className={"invitation-block-div"}>
                <h2 className={"invitation-title-label"}>Invitation status</h2>
                <h1 className={"invitation-data-label"}>{this.state.invitationStatus}</h1>
            </div>
        </div>)
    }
}

export default Invitation;