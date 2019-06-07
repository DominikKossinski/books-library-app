import React, {Component} from 'react'
import './AddItem.css'

class AddItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            libId: props.libId,
            user: props.user,
            title: "",
            author: "",
            isbn: "",
            titleError: "",
            authorError: "",
            isbnError: "",
            titleOptions: [],
            authorOptions: [],
            isbnOptions: [],
        };

        this.titleReqex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.authorRegex = new RegExp("[0-9a-zA-Z ,.]{0,50}");
        this.isbnRegex = new RegExp("[0-9]+");

        this.onAuthorChange = this.onAuthorChange.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onISBNChange = this.onISBNChange.bind(this);
        this.searchByPatterns = this.searchByPatterns.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.addItem = this.addItem.bind(this);


    }

    componentWillMount() {
        const book = JSON.stringify({
            title: this.state.title,
            author: this.state.author,
            isbn: this.state.isbn,
        });
        this.searchByPatterns(book)
    }

    onTitleChange(e) {
        const title = e.target.value;
        this.setState({
            title: title,
            titleError: "",
            isbn:""
        });
        if (this.titleReqex.test(title)) {
            if(title === "") {
                this.setState({
                    titleError: "Empty title"
                })
            }
           const book = JSON.stringify({
                title: title,
                author: this.state.author,
                isbn: this.state.isbn,
            });
            this.searchByPatterns(book);
        } else {
            this.setState({
                titleError: "Title contains invalid character"
            })
        }
    }

    onAuthorChange(e) {
        const author = e.target.value;
        this.setState({
            author: author,
            authorError: "",
            isbn:""
        });
        if (this.authorRegex.test(author)) {
            if(author === "") {
                this.setState({
                    authorError: "Empty author"
                })
            }
            const book = JSON.stringify({
                title: this.state.title,
                author: author,
                isbn: this.state.isbn,
            });
            this.searchByPatterns(book)
        } else {
            this.setState({
                authorError: "Author name contains invalid character"
            })
        }
    }

    onISBNChange(e) {
        const isbn = e.target.value;
        this.setState({
            isbn: isbn,
            isbnError: ""
        });
        if(this.isbnRegex.test(isbn)) {
            if(isbn.length < 13) {
                this.setState({
                    isbnError: "ISBN is to short"
                })
            }
            const book = JSON.stringify({
                title: this.state.title,
                author: this.state.author,
                isbn: isbn,
            });
            this.searchByPatterns(book);
        } else {
            this.setState({
                isbnError: "ISBN contains invalid character"
            })
        }
    }


    searchByPatterns(book) {
        const component = this;
        const url = "http://localhost:8080/api/getBooksByPatterns";
        const http = new XMLHttpRequest();
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "Post");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(book);
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
        const titleOptions = books.map(function (book) {
            return (<option value={book.title}/>)
        });

        const authorOptions = books.map(function (book) {
            return (<option value={book.author}/>)
        });

        const isbnOptions = books.map(function (book) {
            return (<option value={book.isbn}/>)
        });
        this.setState({
            titleOptions: titleOptions,
            authorOptions: authorOptions,
            isbnOptions: isbnOptions
        })
    }

    addItem() {
        const component = this;
        const item = JSON.stringify({
            isbn:this.state.isbn
        });
        const url = "http://localhost:8080/api/library/" + this.state.libId + "/addItem";
        const http = new XMLHttpRequest();
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "Post");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(item);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const data = JSON.parse(http.responseText);
                console.log(data);
                //TODO better alert
                if(data.status === "ok") {
                    console.log(data);
                    alert("Successful adding")
                    component.setState({
                        title: "",
                        author: "",
                        isbn: "",
                        titleError: "",
                        authorError: "",
                        isbnError: ""
                    })
                } else {
                    alert(data.description)
                }
                component.props.refreshItems()
            }
        };
    }


    render() {
        return (
            <div className={"add-item-div"}>
                <label className={"add-item-title-label"}>Add Item To your Library</label><br/>

                <label className="add-item-label">Title:</label>
                <input className={"add-item-input"} list={"title-datalist"} type={"text"} minLength={0}
                       maxLength={100} value={this.state.title} onChange={this.onTitleChange} placeholder={"Title"}/>
                <datalist id={"title-datalist"}>{this.state.titleOptions}</datalist>
                <label className={"error-label"}>{this.state.titleError}</label><br/>

                <label className={"add-item-label"}>Author:</label>
                <input className={"add-item-input"} list={"author-datalist"} type={"text"} minLength={0} maxLength={200}
                       value={this.state.author} onChange={this.onAuthorChange} placeholder={"Author"}/>
                <datalist id={"author-datalist"}>{this.state.authorOptions}</datalist>
                <label className={"error-label"}>{this.state.authorError}</label><br/>

                <label className={"add-item-label"}>ISBN:</label>
                <input className={"add-item-input"} list={"isbn-datalist"} type={"text"} minLength={0} maxLength={13}
                       value={this.state.isbn} onChange={this.onISBNChange} placeholder={"ISBN"}/>
                <datalist id={"isbn-datalist"}>{this.state.isbnOptions}</datalist>
                <label className={"error-label"}>{this.state.isbnError}</label><br/>


                <input className={"add-item-button"} type={"submit"} value={"Add Item"} onClick={this.addItem}/>
            </div>
        )
    }

}

export default AddItem;