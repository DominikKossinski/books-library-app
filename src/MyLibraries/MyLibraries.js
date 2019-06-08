import React, {Component} from 'react'
import './MyLibaries.css'
import {Link} from "react-router-dom";
import bookAccent from "../bookAccent.png";

class MyLibraries extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            libraries: ""
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getMyLibraries = this.getMyLibraries.bind(this);
        this.mapLibraries = this.mapLibraries.bind(this);
    }

    mapLibraries(libraries) {
        const libs = libraries.map(function (library) {
            return (<Link className={"my-library-link"} to={"/library/" + library.id}>
                    <div key={"library" + library.libId} className={"my-library-div"}>
                        <h1 className={"my-library-data-label"}>{library.name}'s Library</h1>
                        <div className={"my-library-flex-div"}>
                            <div className={"my-library-block-div"}>
                                <h2 className={"my-library-title-label"}>Owner</h2>
                                <h1 className={"my-library-data-label"}>{library.name}</h1>
                            </div>
                            <div className={"my-library-block-div"}>
                                <h2 className={"my-library-title-label"}>Owner email</h2>
                                <h1 className={"my-library-data-label"}>{library.email}</h1>
                            </div>
                        </div>
                    </div>
                </Link>
            )
        });
        this.setState({
            libraries: libs
        })
    }

    getMyLibraries() {
        console.log(this.state.user.userId);
        const component = this;
        const url = "http://localhost:8080/api/" + this.state.user.userId + "/getLibraries";
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
                    component.mapLibraries(data.libraries)
                }
            }
        };
    }

    componentWillMount() {
        this.getMyLibraries()
    }

    render() {

        return (<div id={"libraries-div"}>
            <div className={"library-title-div"}>
                <div className={"library-flex-div"}>
                    <img id={"left-img"} className={"library-title-img"} src={bookAccent} alt={""}/>
                    <h1 className={"library-title-label"}>My Libraries</h1>
                    <img id={"right-img"} className={"library-title-img"} src={bookAccent} alt={""}/>
                </div>
                <div className={"line-div"}/>
            </div>
            <div className="my-libraries-div">
                {this.state.libraries}
            </div>
        </div>)
    }
}

export default MyLibraries;