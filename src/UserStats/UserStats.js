import React, {Component} from 'react'
import './UserStats.css'

class UserStats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            avg: 0,
            avgBooks: 0,
            lastItem: null,
            readingItems: []
        };

        this.getStats = this.getStats.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    componentWillMount() {
        this.getStats();
    }

    getStats() {
        const component = this;
        const url = "http://localhost:8080/api/" + this.state.user.userId + "/getStats";
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
                        avg: data.average,
                        avgBooks: data.averageBooks,
                        lastItem: data.lastItem,
                        readingItems: data.readingBooks
                    });
                }
            }
        };
    }

    render() {
        let lastItem = (<span/>);
        if (this.state.lastItem) {
            lastItem = (<div className={"last-book-div"}>
                <h4 className={"stats-title-label"}>Last Book</h4>
                <div className={"last-book-flex-div"}>
                    <div className={"last-book-data-div"}>
                        <h5 className={"stats-title-label"}>Title</h5>
                        <h3 className={"stats-label"}>{this.state.lastItem.book.title}</h3>
                    </div>
                    <div className={"last-book-data-div"}>
                        <h5 className={"stats-title-label"}>Author</h5>
                        <h3 className={"stats-label"}>{this.state.lastItem.book.author}</h3>
                    </div>
                </div>
            </div>)
        }
        let readingDiv = (<span/>);
        let reading = (<span/>);
        if (this.state.readingItems.length > 0) {
            reading = this.state.readingItems.map(function (item) {
                return (<div className={"last-book-flex-div"}>
                    <div className={"last-book-data-div"}>
                        <h5 className={"stats-title-label"}>Title</h5>
                        <h3 className={"stats-label"}>{item.book.title}</h3>
                    </div>
                    <div className={"last-book-data-div"}>
                        <h5 className={"stats-title-label"}>Author</h5>
                        <h3 className={"stats-label"}>{item.book.author}</h3>
                    </div>
                </div>)
            });
            readingDiv = (<div>
                    <h4 className={"stats-title-label"}>Actual reading</h4>
                    {reading}
                </div>
            );

        }
        return (<div className={"stats-div"}>
            <h4 className={"stats-title-label"}>Average Books per month</h4>
            <h3 className={"stats-label"}>{this.state.avgBooks}</h3>
            <h4 className={"stats-title-label"}>Average Pages per day</h4>
            <h3 className={"stats-label"}>{this.state.avg / 30}</h3>
            {lastItem}
            {readingDiv}
        </div>)
    }

}

export default UserStats;