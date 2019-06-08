import './Member.css'
import React, {Component} from 'react'

class Member extends Component {

    constructor(props) {
        super(props);
        this.state = {
            member: props.member
        }
    }

    render() {
        return (<div className={"member-div"}>
                <div className={"member-block-div"}>
                    <h2 className={"member-title-label"}>User name</h2>
                    <h1 className={"member-data-label"}>{this.state.member.user.name}</h1>
                </div>
                <div className={"member-block-div"}>
                    <h2 className={"member-title-label"}>Email</h2>
                    <h1 className={"member-data-label"}>{this.state.member.user.email}</h1>
                </div>
            </div>
        )
    }

}

export default Member;