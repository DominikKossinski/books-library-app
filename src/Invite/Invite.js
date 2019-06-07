import React, {Component} from 'react'
import './Invite.css'

class Invite extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            email: "",
            emailError: ""
        };

        this.onEmailChanged = this.onEmailChanged.bind(this);
        this.invite = this.invite.bind(this);
    }

    invite() {
        if(this.state.emailError === "") {
            const data = JSON.stringify({
                userId: this.state.user.userId,
                email:this.state.email
            });
            const component  = this;
            const url = "http://localhost:8080/api/" + this.state.user.userId + "/invite";
            const http = new XMLHttpRequest();
            http.open("Post", url, true);
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.setRequestHeader("Access-Control-Allow-Methods", "POST");
            http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
            http.setRequestHeader("Access-Control-Allow-Credentials", "true");
            http.setRequestHeader("Access-Control-Max-Age", "3600");
            http.send(data);
            http.onreadystatechange = function (e) {
                if (http.readyState === 4) {
                    var response = JSON.parse(http.responseText);
                    console.log(response);
                    //TOOD ładniejsze alerty
                    if(response.status === "ok") {
                        component.setState({
                            email:""
                        });
                        alert("User successfully invited")
                    } else {
                        if(response.description === "already invited") {
                            component.setState({
                                emailError:"Already invited"
                            })
                        } else if(response.description === "error by sending email") {
                            component.setState({
                                emailError:"Error by sending email. Check email again"
                            })
                        } else if(response.description === "error by adding") {
                            component.setState({
                                emailError:"Error by adding invitation. Please Try later"
                            })
                        } else if(response.description === "not an email") {
                            component.setState({
                                emailError:"This is not an email"
                            })
                        } else if(response.description === "self") {
                            component.setState( {
                                emailError: "You can't invite ryour self"
                            })
                        }
                    }
                }
            };
        }
    }

    onEmailChanged(e) {
        const email = e.target.value;
        this.setState({
            email: email,
            emailError: ""
        });
        const component = this;
        const url = "http://localhost:8080/api/" + this.state.user.userId + "/checkEmail";
        const http = new XMLHttpRequest();
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "POST");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send("{\"email\":\"" + email + "\"}");
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                var response = JSON.parse(http.responseText);
                console.log(response);
                if(response.email) {
                    component.setState({
                        emailError:""
                    })
                } else {
                    component.setState({
                        emailError:"This is not an email"
                    })
                }
            }
        };
    }

    render() {
        return (
            <div className={"invite-div"}>
                <label className={"invite-label"}>Invite to your library:</label>
                <input className="invite-input" type="text" required maxLength={50} onChange={this.onEmailChanged}
                       value={this.state.email} placeholder="Email"/>
                <label ref={this.emailErrorLabel} className="error-label">{this.state.emailError}</label><br/>

                <input type={"submit"} value={"Invite"} className={"invite-button"} onClick={this.invite}/>
            </div>
        );
    }

}

export default Invite;