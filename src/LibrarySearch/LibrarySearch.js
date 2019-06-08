import React, {Component} from 'react'
import './LibrarySearch.css'

class LibrarySearch extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            libId:props.libId,
            pattern:""
        };

        this.setItems = props.setItems;
        this.onPatternChange = this.onPatternChange.bind(this);
        this.searchItems = this.searchItems.bind(this);
    }

    onPatternChange(e) {
        const pattern = e.target.value;
        this.setState({
            pattern:pattern
        });
        this.searchItems(pattern)
    }

    searchItems(pattern) {
        const component = this;
        const url = "http://localhost:8080/api/library/" + this.state.libId + "/search?pattern=" + pattern;
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
                    component.setItems(data.items)
                }
            }
        };
    }

    render() {
        return (<div className={"lib-search-div"}>
            <h1 className={"lib-search-label"}>Search</h1>
            <input className={"lib-search-input"} value={this.state.pattern} placeholder={"Search"} onChange={this.onPatternChange}/>
        </div>)
    }


}

export default LibrarySearch;