import React, {Component} from 'react'
import './AllBooks.css'
import Search from "../Search/Search";
import AddBook from "../AddBook/AddBook";
import {Link} from "react-router-dom";

class AllBooks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            pattern: "",
            books: [],
        };

        this.onPatternChange = this.onPatternChange.bind(this);
        this.searchBooks = this.searchBooks.bind(this);
        this.mapBooks = this.mapBooks.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    componentWillMount() {
        this.searchBooks("")
    }

    searchBooks(pattern) {
        const component = this;
        const url = "http://localhost:8080/api/getBooksByPattern?pattern=" + pattern;
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
                    console.log(data);
                    component.mapBooks(data.books)
                }
            }
        };
    }

    mapBooks(books) {
        const booksElements = books.map(function (book) {
            return (<div key={"book" + book.bookId} className={"book-div"}>
                <Link className={"book-link"} to={"/book/" + book.bookId}>
                    <div className={"book-flex-div"}>
                        <div className={"book-block-div"}>
                            <h3 className={"book-title-label"}>Title</h3>
                            <h2 className={"book-data-label"}>{book.title}</h2>
                        </div>
                        <div className={"book-block-div"}>
                            <h3 className={"book-title-label"}>Author</h3>
                            <h2 className={"book-data-label"}>{book.author}</h2>
                        </div>
                        <div className={"book-block-div"}>
                            <h3 className={"book-title-label"}>Pages Count</h3>
                            <h2 className={"book-data-label"}>{book.pagesCount}</h2>
                        </div>
                        <div className={"book-block-div"}>
                            <h3 className={"book-title-label"}>ISBN</h3>
                            <h2 className={"book-data-label"}>{book.isbn}</h2>
                        </div>
                    </div>
                </Link>
            </div>)
        });
        this.setState({
            books: booksElements
        })
    }

    onPatternChange(pattern) {
        this.setState({
            pattern: pattern
        });
        this.searchBooks(pattern)
    }

    render() {
        return (<div className={"all-books-div"}>
            <div className={"all-books-search-div"}>
                <Search onPatternChange={this.onPatternChange}/>
            </div>
            <div className={"all-books-add-book-div"}>
                <AddBook user={this.state.user}/>
            </div><br/>
            <div className={"books-div"}>
                {this.state.books}
            </div>
        </div>)
    }


}

export default AllBooks;