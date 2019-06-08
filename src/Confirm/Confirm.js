import React, {Component} from 'react'
import './Confirm.css'
class Confirm extends Component {

    constructor(props) {
        super(props);
        const url = window.location.href;
        console.log(url);
        const urlTab = url.split("/");
        console.log(urlTab[urlTab.length - 1]);
        this.state = {
            confirmState: "",
            name: urlTab[urlTab.length - 2],
            id: parseInt(urlTab[urlTab.length - 1])
        };

        this.confirmAccount = this.confirmAccount.bind(this)
    }

    confirmAccount() {
        const component = this;
        console.log("login");
        const data = {
            id: this.state.id,
            name: this.state.name,
        };
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/api/confirmAccount";
        http.open("POST", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(JSON.stringify(data));
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const response = JSON.parse(http.responseText);
                console.log(response);
                if (response.status === "ok") {
                    component.setState({
                        confirmState: "ok"
                    })
                } else if(response.status === "error") {
                    component.setState({
                        confirmState: "error"
                    })
                } else if(response.status === "already confirmed") {
                    component.setState({
                        confirmState:"already confirmed"
                    })
                }
            }
        };
    }

    componentDidMount() {
        this.confirmAccount()
    }

    render() {
        //TODO poprawić render
        let confirmElement = (<span/>);
        if (this.state.confirmState === "") {
            confirmElement = (<div className={"confirm-div"}>
                <h1 className={"confirm-title"}>Confirm</h1>
            </div>)
        } else if (this.state.confirmState === "ok") {
            confirmElement = (<div className={"confirm-div"}>
                <h1 className={"confirm-title"}>Your account is now confirmed</h1>
            </div>)
        } else if(this.state.confirmState === "already confirmed"){
            confirmElement = (<div className={"confirm-div"}>
                <h1 className={"confirm-title"}>Account is already confirmed</h1>
            </div>)
        }else {
            confirmElement =(<div className={"confirm-div"}>
                <h1 className={"confirm-title"}>Error by confirming create your account again</h1>
            </div>)
        }

        return (<div className={"confirm-flex-div"}>
            {confirmElement}
        </div>)
    }
}

export default Confirm;