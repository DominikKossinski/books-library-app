import React, {Component} from 'react';
import './SingUp.css';
import singUp from '../singUp.png'

class SingUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
            email: "",
            passwordError: "",
            emailError: "",
            nameError: ""
        };
        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.onNameChanged = this.onNameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.singUp = this.singUp.bind(this);

        this.passwordErrorLabel = React.createRef();
        this.emailErrorLabel = React.createRef();
        this.nameErrorLabel = React.createRef();
    }

    onEmailChanged(e) {
        var component = this;
        const email = e.target.value;
        this.setState({
            email: email,
            emailError: ""
        });
        var http = new XMLHttpRequest();
        const data = "{\"email\":\"" + email + "\"}";
        var url = "http://localhost:8080/api/checkEmail";
        http.open("Post", url, true);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(data);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                var response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    if (response.email === "email free") {
                        component.setState({
                            emailError: ""
                        })
                    } else if (response.email === "email not free") {
                        component.setState({
                            emailError: "Email already exists"
                        })
                    } else if (response.email === "false") {
                        component.setState({
                            emailError: "This is not an email"
                        })
                    } else if (response.email === "empty email") {
                        component.setState({
                            emailError: "Empty email"
                        })
                    }
                }
            }
        };
    }

    onPasswordChanged(e) {
        const component = this;
        const password = e.target.value;
        this.setState({
            password: password,
            passwordError: ""
        });
        var http = new XMLHttpRequest();
        const data = "{\"password\":\"" + password + "\"}";
        var url = "http://localhost:8080/api/checkPassword";
        http.open("Post", url, true);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(data);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                var response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    if (response.password === "false") {
                        component.setState({
                            passwordError: "Password contains invalid character"
                        })
                    } else if (response.password === "true") {
                        component.setState({
                            passwordError: ""
                        })
                    } else if (response.password === "empty password") {
                        component.setState({
                            passwordError: "Empty password"
                        })
                    } else if (response.password === "to long name") {
                        component.setState({
                            passwordError: "Password is to long"
                        })
                    } else if (response.password === "to short password") {
                        component.setState({
                            passwordError: "Password is to short"
                        })
                    }
                }
            }
        };
    }

    onNameChanged(e) {
        const name = e.target.value;
        const component = this;
        this.setState({
            name: name,
            nameError: ''
        });
        var http = new XMLHttpRequest();
        const data = "{\"name\":\"" + name + "\"}";
        var url = "http://localhost:8080/api/checkName";
        http.open("Post", url, true);
        http.setRequestHeader("Content-Type", "application/json");
        http.send(data);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                var response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    if (response.name === "invalid character") {
                        component.setState({
                            nameError: "User name contains invalid character"
                        })
                    } else if (response.name === "name free") {
                        component.setState({
                            nameError: ""
                        })
                    } else if (response.name === "name not free") {
                        component.setState({
                            nameError: "User name isn't free"
                        })
                    } else if (response.name === "empty name") {
                        component.setState({
                            nameError: "Empty name"
                        })
                    } else if (response.name === "to long name") {
                        component.setState({
                            nameError: "Name is to long"
                        })
                    }
                }
            }
        };

    }

    singUp() {
        if (this.state.nameError === "" && this.state.passwordError === "" && this.state.emailError === "") {
            console.log("SingUp");
            const http = new XMLHttpRequest();
            const data = {
                id: 0,
                name: this.state.name,
                password: this.state.password,
                email: this.state.email
            };
            const parsed = JSON.stringify(data);
            const url = "http://localhost:8080/api/addUser";
            http.open("Post", url, true);
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.setRequestHeader("Access-Control-Allow-Methods", "POST");
            http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
            http.setRequestHeader("Access-Control-Allow-Credentials", "true");
            http.setRequestHeader("Access-Control-Max-Age", "3600");
            http.send(parsed);
            http.onreadystatechange = function (e) {
                if (http.readyState === 4) {
                    const response = JSON.parse(http.responseText);
                    console.log(response);
                    if(response.status === "ok") {
                        alert("Successful creating user")
                    } else {
                        alert("Error by adding user")
                    }
                }
            };
        }
    }

    render() {
        return (<div className="sing-up-div">
            <div className={"sing-up-title-div"}>
                <img src={singUp} className={"sing-up-img"} alt={""}/>
                <p className="sing-up-title-label">Sing up!</p><br/>
            </div>

            <div className={"sing-up-data-div"}>
                <label className="sing-up-input-label">User Name:</label>
                <input className="sing-up-text-input" type="text" required pattern="^[a-zA-Z0-9]+$"
                       onChange={this.onNameChanged} value={this.state.name} placeholder="User name" minLength="1"
                       maxLength={20}/>
                <label ref={this.nameErrorLabel} className="error-label">{this.state.nameError}</label><br/>

                <label className="sing-up-input-label">Email:</label>
                <input className="sing-up-text-input" type="text" required maxLength={50} onChange={this.onEmailChanged}
                       value={this.state.email} placeholder="Email"/>
                <label ref={this.emailErrorLabel} className="error-label">{this.state.emailError}</label><br/>

                <label className="sing-up-input-label">Password:</label>
                <input className="sing-up-text-input" type="password" required minLength="8" maxLength={20}
                       onChange={this.onPasswordChanged} value={this.state.password} placeholder="Password"/>
                <label ref={this.passwordErrorLabel} className="error-label">{this.state.passwordError}</label><br/>

                <input type="submit" value="Sing Up!" className="sing-up-button" onClick={this.singUp}/>
            </div>
        </div>)

    }
}

export default SingUp;