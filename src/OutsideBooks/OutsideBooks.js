import React, {Component} from 'react'
import './OutSideBooks.css'

class OutsideBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            books: [],
            title: "",
            author: "",
            isbn: "",
            titleError: "",
            authorError: "",
            isbnError: ""
        };

        this.titleReqex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.authorRegex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.isbnRegex = new RegExp("[0-9]{0,13}");

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onISBNChange = this.onISBNChange.bind(this);
        this.onAuthorChange = this.onAuthorChange.bind(this);
        this.getBooks = this.getBooks.bind(this);
        this.mapBooks = this.mapBooks.bind(this);
        this.addBook = this.addBook.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    componentWillMount() {
        this.getBooks()
    }


    onTitleChange(e) {
        const title = e.target.value;
        if (this.titleReqex.test(title)) {
            this.setState({
                title: title,
                titleError: ""
            });
        } else {
            this.setState({
                titleError: "Title contains invalid character"
            })
        }
    }

    onISBNChange(e) {
        const isbn = e.target.value;
        if (this.isbnRegex.test(isbn)) {
            this.setState({
                isbn: isbn,
                isbnError: ""
            })
        } else {
            if (isbn.length === 13) {
                this.setState({
                    isbnError: "ISBN contains invalid character"
                })
            } else {
                this.setState({
                    isbnError: "ISBN is to short"
                })
            }
        }
    }

    onAuthorChange(e) {
        const author = e.target.value;
        if (this.authorRegex.test(author)) {
            this.setState({
                author: author,
                authorError: ""
            })
        } else {
            this.setState({
                authorError: "Author name contains invalid character"
            })
        }
    }

    addBook() {
        const component = this;
        console.log(this.state.user);
        if (this.state.titleError === "" && this.state.authorError === "" && this.state.isbnError === "") {
            const book = JSON.stringify({
                title: this.state.title,
                isbn: this.state.isbn,
                author: this.state.author,
            });
            const url = "http://localhost:8080/api/library/" + this.state.user.libId + "/addOutsideBook";
            const http = new XMLHttpRequest();
            http.open("Post", url, true);
            http.withCredentials = true;
            http.setRequestHeader("Content-Type", "application/json");
            http.setRequestHeader("Access-Control-Allow-Methods", "Post");
            http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
            http.setRequestHeader("Access-Control-Allow-Credentials", "true");
            http.setRequestHeader("Access-Control-Max-Age", "3600");
            http.send(book);
            http.onreadystatechange = function () {
                if (http.readyState === 4) {
                    const data = JSON.parse(http.responseText);
                    console.log(data);
                    //TOdo lepsze komunikaty
                    if (data.status === "ok") {
                        alert("Successful adding book")
                    } else {
                        if (data.description === "book exists") {
                            alert("Book already exists")
                        } else {
                            alert("Error by adding book")
                        }
                    }
                    component.getBooks()
                }
            };
        }
    }

    getBooks() {
        const component = this;
        const http = new XMLHttpRequest();
        const url = "http://localhost:8080/api/library/" + this.state.user.libId + "/getOutsideBooks";
        http.open("GET", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "GET");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(null);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const response = JSON.parse(http.responseText);
                if (response.status === "ok") {
                    component.mapBooks(response.books)
                }
            }
        };
    }

    mapBooks(books) {
        const booksElements = books.map(function (book) {
            return (<div key={"book" + book.bookId} className={"book-div"}>
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
                        <h3 className={"book-title-label"}>ISBN</h3>
                        <h2 className={"book-data-label"}>{book.isbn}</h2>
                    </div>
                </div>
            </div>)
        });
        this.setState({
            books: booksElements
        })
    }

    render() {
        let booksFromOutside = (<h1 className={"outside-title-label"}>No books from outside</h1>);
        if (this.state.books.length > 0) {
            booksFromOutside = (<h1 className={"outside-title-label"}>Books from outside</h1>);
        }
        return (<div className={"outside-books-div"}>
                <div className={"add-book-div"}>
                    <label className={"add-book-title-label"}>Add new book</label><br/>

                    <label className="add-book-label">Title</label>
                    <input className={"add-book-input"} required type={"text"} minLength={0} maxLength={100}
                           value={this.state.title} onChange={this.onTitleChange} placeholder={"Title"}/>
                    <label className={"error-label"}>{this.state.titleError}</label><br/>

                    <label className={"add-book-label"}>Author</label>
                    <input className={"add-book-input"} required type={"text"} minLength={0} maxLength={200}
                           value={this.state.author} onChange={this.onAuthorChange} placeholder={"Author"}/>
                    <label className={"error-label"}>{this.state.authorError}</label><br/>

                    <label className={"add-book-label"}>ISBN</label>
                    <input className={"add-book-input"} required type={"text"} minLength={0} maxLength={13}
                           value={this.state.isbn} onChange={this.onISBNChange} placeholder={"ISBN"}/>
                    <label className={"error-label"}>{this.state.isbnError}</label><br/>

                    <input className={"add-book-button"} type={"submit"} value={"Add Book"} onClick={this.addBook}/>
                </div>
                {booksFromOutside}
                <div className={"outside-books-div"}>
                    {this.state.books}
                </div>
            </div>
        )
    }
}

export default OutsideBooks;