import React, {Component} from 'react'
import './Library.css'
import Item from "../Item/Item";
import AddItem from "../AddItem/AddItem";
import bookAccent from '../bookAccent.png'

class Library extends Component {

    constructor(props) {
        super(props);
        if (this.props.libId !== -1) {
            this.state = {
                user: props.user,
                libId: props.libId,
                owner: {
                    name:"",
                    email:""
                }
            };
        } else {
            const u = window.location.href.split("/");
            console.log(window.location.href.split("/"));
            this.state = {
                user: props.user,
                libId: u[u.length - 1],
                owner: {
                    name:"",
                    email:""
                }
            };
        }

        this.getLibItems = this.getLibItems.bind(this);
        this.mapItems = this.mapItems.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this)
    }

    componentWillMount() {
        if (this.state.user.userId !== -1) {
            this.getLibItems()
        }
    }

    getLibItems() {
        console.log("GetLibItems: " + this.state.libId);
        const component = this;
        const url = "http://localhost:8080/api/library/" + this.state.libId + "/getItems";
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
                    component.setState({
                        owner: data.owner
                    });
                    component.mapItems(data.items)
                }
            }
        };
    }

    mapItems(items) {
        this.setState({
            itemsList: []
        });
        const component = this;
        const itemsList = items.map((item) =>
            <Item key={"item" + item.bookId} refreshLib={this.getLibItems} user={component.state.user} access={true}
                  item={item} loans={item.loans}/>
        );
        this.setState({
            itemsList: itemsList
        })
    }

    render() {
        if (this.state.user.userId === -1) {
            return (<span/>)
        }
        return (<div>
            <div className={"library-title-div"}>
                <div className={"library-flex-div"}>
                    <img id={"left-img"} className={"library-title-img"} src={bookAccent} alt={""}/>
                    <h1 className={"library-title-label"}>Library</h1>
                    <img id={"right-img"} className={"library-title-img"} src={bookAccent} alt={""}/>
                </div>
                <div className={"line-div"}/>
            </div>
            <div className={"library-flex-div"}>
                <div className={"owner-div"}>
                    <h2 className={"owner-title-label"}>Owner user name</h2>
                    <h1 className={"owner-data-label"}>{this.state.owner.name}</h1>
                    <h2 className={"owner-title-label"}>Owner email</h2>
                    <h1 className={"owner-data-label"}>{this.state.owner.email}</h1>
                </div>
                <div className={"add-item-library-div"}>
                    <AddItem refreshItems={this.getLibItems} user={this.state.user} libId={this.state.libId}/>
                </div>
            </div>
            <div id={"items-div"}>
                {this.state.itemsList}
            </div>
        </div>)
    }

}

export default Library;