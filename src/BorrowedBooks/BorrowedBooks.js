import React, {Component} from 'react'
import './BorrowedBooks.css'

class BorrowedBooks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            borrowedBooks: []
        };
        this.componentWillMount = this.componentWillMount.bind(this);
        this.getBorrowedBooks = this.getBorrowedBooks.bind(this);
    }

    getBorrowedBooks() {
        const component = this;
        const url = "http://localhost:8080/api/library/" + this.state.user.libId + "/getBorrowedItems";
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
                        borrowedBooks: data.items
                    });
                }
            }
        };
    }

    componentWillMount() {
        this.getBorrowedBooks()
    }

    render() {
        let loanBooks = (<span/>);
        let title = (<span/>);
        if (this.state.borrowedBooks.length > 0) {
            title = (<h4 className={"stats-title-label"}>Borrowed Books</h4>);
            loanBooks = this.state.borrowedBooks.map(function (item) {
                return (<div className={"borrowed-book-flex-div"}>
                    <div className={"borrowed-book-data-div"}>
                        <h5 className={"stats-title-label"}>Title</h5>
                        <h3 className={"stats-label"}>{item.book.title}</h3>
                    </div>
                    <div className={"borrowed-book-data-div"}>
                        <h5 className={"stats-title-label"}>Author</h5>
                        <h3 className={"stats-label"}>{item.book.author}</h3>
                    </div>
                </div>)
            })
        }
        return (
            <div className={"borrowed-book-div"}>
                {title}
                {loanBooks}
            </div>
        );
    }

}

export default BorrowedBooks;