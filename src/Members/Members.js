import React, {Component} from 'react'
import './Members.css'
import Member from "../Member/Member";

class Members extends Component {

    constructor(props) {
        super(props);
        this.state = {
            libId: this.props.match.params.libId,
            membersList: []
        };

        this.componentWillMount = this.componentWillMount.bind(this)
    }

    componentWillMount() {
        const component = this;
        const url = "http://localhost:8080/api/library/" + this.state.libId + "/getMembers";
        const http = new XMLHttpRequest();
        http.open("Get", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "Get");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(null);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const data = JSON.parse(http.responseText);
                console.log(data);
                if (data.status === "ok") {
                    console.log(data);
                    component.mapMembers(data.members)
                }
            }
        };
    }

    mapMembers(members) {
        const membersList = members.map((member) =>
            <Member member={member}/>
        );

        this.setState({
            membersList: membersList
        })
    }

    render() {
        let members = (<h1 className={"members-title-label"}>Members</h1>);
        if(this.state.membersList.length === 0) {
            members = (<h1 className={"members-title-label"}>No Members</h1>)
        }
        return (<div id={"members-div"}>
            {members}
            {this.state.membersList}
        </div>)
    }
}

export default Members;