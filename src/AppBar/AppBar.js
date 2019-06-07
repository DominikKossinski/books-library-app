import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './AppBar.css';
import bookWhite from '../bookWhite.png';

class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged: props.isLogged,
            user: props.user
        };
        this.setLogged = this.setLogged.bind(this);
        this.logout = this.logout.bind(this);
        this.updateLogged = this.updateLogged.bind(this);
    }

    setLogged(logged, user) {
        this.setState({
            isLogged: logged,
            user: user
        });
    }

    updateLogged(logged, user) {
        this.props.setLogged(logged, user);
    }

    logout() {
        const component = this;
        console.log("login");
        const data = {
            id: this.state.user.userId,
            name: this.state.user.userName,
            password: this.state.user.password,
            email: this.state.user.email,
            status: 1
        };
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/api/logout";
        http.open("POST", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(JSON.stringify(data));
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const response = http.responseText;
                console.log(response);
                component.updateLogged(false, {
                    id: -1,
                    userName: "",
                    password: "",
                    email: "",
                });
            }
        };
    }

    render() {
        let logoutButton = (<div className="link-ref" onClick={this.logout}>
            Log Out
        </div>);

        let loginButton = (<Link className={"link"} to={"/login"}>
            <div className="link-ref">
                Log In
            </div>
        </Link>);

        let membersButton = (<span/>);
        let librariesButton = (<span/>);

        if (!this.state.isLogged) {
            logoutButton = (<span/>)
        } else {
            loginButton = (<span/>);
            membersButton = (<Link className={"link"} to={"/members/" + this.state.user.libId}>
                <div className={"link-ref"}>My Members</div>
            </Link>);
            librariesButton = (<Link className={"link"} to={"/libraries"}>
                <div className={"link-ref"}>My Libraries</div>
            </Link>);
        }

        return (
            <div id="logo">
                <div id="appbar">
                    <img src={bookWhite} className={"logo-img"} alt={""}/>
                    <Link className="link" to={"/home"}>
                        <div className={"link-ref"}>Home</div>
                    </Link>
                    <Link className="link" to={"/wholeLibrary"}>
                        <div className="link-ref">Library</div>
                    </Link>
                    {librariesButton}
                    {membersButton}
                    {logoutButton}
                    {loginButton}
                    <div id={"clear"}/>
                </div>

            </div>)
    }
}

export default AppBar