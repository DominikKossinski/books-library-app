import React, {Component} from 'react';
import './App.css';
import Login from "../Login/Login";
import SingUp from "../SingUp/SingUp";
import Confirm from "../Confirm/Confirm";
import {Route, Link, BrowserRouter as Router, Switch} from 'react-router-dom'
import Home from "../Home/Home";
import AppBar from "../AppBar/AppBar";
import Members from "../Members/Members";
import Invitation from "../Invitation/Invitation";
import MyLibraries from "../MyLibraries/MyLibraries";
import Library from "../Library/Library";
import AllBooks from "../AllBooks/AllBooks"
import Book from "../Book/Book";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            user: {
                userId: -1,
                userName: "",
                password: "",
                email: ""
            }
        };
        this.setLogged = this.setLogged.bind(this);

        this.login = React.createRef();
        this.home = React.createRef();
        this.appBar = React.createRef();
    }

    setLogged(logged, user) {
        localStorage.setItem("user", user);
        this.setState({
            isLogged: logged,
            user: user
        });
        if (this.login.current != null) {
            this.login.current.setLogged(logged);
        }
        if (this.home.current != null) {
            this.home.current.setLogged(logged, user);
        }
        this.appBar.current.setLogged(logged, user);
        if (logged) {
            console.log("App state:");
            console.log(this.state.user.userId);
        }
    }

    render() {
        const routing = (

            <Router>
                <AppBar ref={this.appBar} isLogged={this.state.isLogged} setLogged={this.setLogged}/>
                <Switch>
                    <Route exact path="/login">
                        <div id="login-div">
                            <Login ref={this.login} isLogged={this.state.isLogged} setLogged={this.setLogged}/>
                            <SingUp/>
                        </div>
                    </Route>
                    <Route path="/confirmAccount" component={Confirm}/>
                    <Route path="/home">
                        <Home ref={this.home} isLogged={this.state.isLogged} user={this.state.user}/>
                    </Route>
                    <Route path="/wholeLibrary">
                        <AllBooks user={this.state.user}/>
                    </Route>
                    <Route exact path="/members/:libId" component={Members}>
                    </Route>
                    <Route path={"/libraries"}>
                        <MyLibraries user={this.state.user}/>
                    </Route>
                    <Route path={"/library/:libId"} component={() => <Library user={this.state.user} libId={-1}/>}>
                    </Route>
                    <Route exact path={"/invitation/:invitationId"} component={Invitation}>
                    </Route>
                    <Route exact path={"/book/:bookId"} component={() => <Book user={this.state.user}/>}/>
                </Switch>
            </Router>

        );
        return (
            routing
        );
    }
}

export default App;
