import React, {Component} from 'react'
import './AddBook.css'

class AddBook extends Component {


    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            title: "",
            isbn: "",
            author: "",
            pagesCount: 0,
            authorError: "",
            titleError: "",
            isbnError: "",
            pagesCountError: "",
        };

        this.titleReqex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.authorRegex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.isbnRegex = new RegExp("[0-9]{0,13}");

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onISBNChange = this.onISBNChange.bind(this);
        this.onAuthorChange = this.onAuthorChange.bind(this);
        this.onPagesCountChange = this.onPagesCountChange.bind(this);
        this.addBook = this.addBook.bind(this);
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

    onPagesCountChange(e) {
        const pagesCount = parseInt(e.target.value);
        if (pagesCount > 0) {
            this.setState({
                pagesCount: pagesCount,
                pagesCountError: ""
            })
        } else {
            this.setState({
                pagesCount: "Invalid pages count"
            })
        }
    }

    addBook() {
        if (this.state.titleError === "" && this.state.authorError === "" && this.state.isbnError === "" && this.state.pagesCountError === "") {
            const book = JSON.stringify({
                title: this.state.title,
                isbn: this.state.isbn,
                author: this.state.author,
                pagesCount: this.state.pagesCount
            });
            const url = "http://localhost:8080/api/addBook";
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
                    if (data.status === "ok") {
                        alert("Successful adding book")
                    } else {
                        if (data.description === "book exists") {
                            alert("Book already exists")
                        } else {
                            alert("Error by adding book")
                        }
                    }
                }
            };
        }
    }


    render() {

        return (
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

                <label className={"add-book-label"}>Pages count</label>
                <input className={"add-book-input"} required type={"number"} min={0} step={1}
                       value={this.state.pagesCount}
                       onChange={this.onPagesCountChange}/>
                <label className={"error-label"}>{this.state.pagesCountError}</label><br/>

                <input className={"add-book-button"} type={"submit"} value={"Add Book"} onClick={this.addBook}/>
            </div>
        )
    }

}

export default AddBook;