import React, {Component} from 'react';
import './Login.css';
import login from '../login.png'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
            isLogged: props.isLogged,
            nameError: "",
            passwordError: ""
        };

        this.onNameChanged = this.onNameChanged.bind(this);
        this.onPasswordChanged = this.onPasswordChanged.bind(this);
        this.login = this.login.bind(this);
        this.setLogged = this.setLogged.bind(this);
        this.updateLogged = this.updateLogged.bind(this);
        this.setNameError = this.setNameError.bind(this);
        this.setPasswordError = this.setPasswordError.bind(this);

        this.nameErrorLabel = React.createRef();
        this.passwordErrorLabel = React.createRef();
    }


    login() {
        const component = this;
        console.log("login");
        const data = {
            id: 0,
            name: this.state.name,
            password: this.state.password,
            email: "email@email.com",
            status: 1
        };
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/api/login";
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "POST");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(JSON.stringify(data));
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                const response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    component.updateLogged(true, {
                        userId: response.user.id,
                        userName: response.user.name,
                        password: response.user.password,
                        email: response.user.email,
                        libId: response.user.libId
                    });
                    component.setState({
                        passwordError: "",
                        nameError: ""
                    })
                } else {
                    if (response.description === "wrong password") {
                        component.setPasswordError();
                    } else {
                        component.setNameError();
                    }
                    component.updateLogged(false, {
                        userId: -1,
                        userName: "",
                        password: "",
                        email: "",
                        libId: -1
                    });
                }
            }
        };
    }

    setNameError() {
        this.setState({
            name: "",
            nameError: "No user"
        })
    }

    setPasswordError() {
        this.setState({
            password: "",
            passwordError: "Wrong password"
        })
    }


    setLogged(logged) {
        this.setState({
            isLogged: logged,
            name: "",
            password: ""
        });
    }

    updateLogged(logged, user) {
        this.props.setLogged(logged, user);
    }

    onNameChanged(e) {
        const name = e.target.value;
        this.setState({
            name: name,
            nameError: ""
        })
    }

    onPasswordChanged(e) {
        const password = e.target.value;
        this.setState({
            password: password,
            passwordError: ""
        })
    }


    render() {
        if (!this.state.isLogged) {
            return (<div className="login-div">
                <div className={"login-title-div"}>
                    <img src={login} className={"login-img"} alt={""}/>
                    <p className="login-title-label">Login</p><br/>
                </div>

                <div className={"login-data-div"}>
                    <label className="login-input-label">User name:</label>
                    <input className="login-text-input" type="text" value={this.state.name}
                           onChange={this.onNameChanged}
                           placeholder="User Name"/>
                    <label ref={this.nameErrorLabel} className="error-label">{this.state.nameError}</label><br/>
                    <label className="login-input-label">Password:</label>
                    <input className="login-text-input" type="password" value={this.state.password}
                           onChange={this.onPasswordChanged} placeholder="Password"/>
                    <label ref={this.passwordErrorLabel} className="error-label">{this.state.passwordError}</label><br/>

                    <input className="login-button" value="Log in" type="submit" onClick={this.login}/>
                </div>
            </div>)
        } else {
            return (<span/>)
        }
    }
}

export default Login;