import React, {Component} from 'react'
import Library from "../Library/Library";
import './Home.css'
import Invite from "../Invite/Invite";
import UserStats from "../UserStats/UserStats";
import BorrowedBooks from "../BorrowedBooks/BorrowedBooks";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogged: props.isLogged,
            user: props.user,
            refresh: ""
        };

        this.setLogged = this.setLogged.bind(this);
    }

    setLogged(logged, user) {
        this.setState({
            isLogged: logged,
            user: user
        })
    }

    render() {
        let homePage = (<span/>);
        let userData = (<span/>);
        let myLibrary = (<span/>);
        let invite = (<span/>);
        let stats = (<span/>);
        let borrowedBooks = (<span/>);
        if (this.state.isLogged) {
            stats = (<div className={"stats-div"}>
                    <UserStats user={this.state.user}/>
                </div>
            );
            borrowedBooks = (<div className={"stats-div"}>
                    <BorrowedBooks user={this.state.user}/>
                </div>
            );
            userData = (<div className="user-data-div">
                <div className={"data-div"}>
                    <h3 className={"user-data-title-label"}>User Name</h3>
                    <h1 className={"user-data-label"}>{this.state.user.userName}</h1>
                    <h3 className={"user-data-title-label"}>Email</h3>
                    <h1 className={"user-data-label"}>{this.state.user.email}</h1>
                </div>
                {stats}
                {borrowedBooks}
            </div>);
            invite = (
                <Invite user={this.state.user}/>
            );
            myLibrary = (<div className={"library-home-div"}>
                    <Library user={this.state.user} libId={this.state.user.libId}/>
                </div>
            );

        } else {
            homePage = (<div className={"welcome-div"}>
                <div className={"auto-margin-div"}>
                    <h1 className={"welcome-label"}>WELCOME TO OUR LIBRARY</h1><br/>
                    <h2 className={"info-label"}>To login or sing up click Log In</h2><br/>
                    <h2 className={"info-label"}>To search a book in our library click on Library</h2>
                </div>
            </div>)
        }
        return (<div id={"home-div"}>
            {homePage}
            <div className={"flex-div"}>
                {userData}
                <div className={"invite-home-div"}>
                    {invite}
                </div>
            </div>
            {myLibrary}
        </div>)
    }
}

export default Home;