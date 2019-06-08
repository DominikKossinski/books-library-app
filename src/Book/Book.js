import React, {Component} from 'react'
import './Book.css'

class Book extends Component {

    constructor(props) {
        super(props);
        const u = window.location.href.split("/");
        this.state = {
            user: props.user,
            book: {
                bookId: u[u.length - 1],
                title: "",
                author: "",
                isbn: "",
                pagesCount: 0,
            },
            items: [],
            itemsTitle: ""
        };


        this.componentWillMount = this.componentWillMount.bind(this);
        this.getItemsByBookId = this.getItemsByBookId.bind(this);
        this.mapItems = this.mapItems.bind(this);
        this.lendItem = this.lendItem.bind(this);
        this.giveBookBack = this.giveBookBack.bind(this)
    }

    getItemsByBookId(bookId) {
        const component = this;
        const url = "http://localhost:8080/api/getItemsByBookId?bookId=" + bookId;
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
                    component.setState({
                        book: data.book
                    });
                    component.mapItems(data.items, data.book)
                }
            }
        };
    }

    lendItem(itemId) {
        //TODO better info
        const component = this;
        const lending = JSON.stringify({
            userId: this.state.user.userId,
            itemId: itemId
        });
        const url = "http://localhost:8080/api/lendItem";
        const http = new XMLHttpRequest();
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "Post");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(lending);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const data = JSON.parse(http.responseText);
                console.log(data);
                if (data.status === "ok") {
                    alert("Successful lending")
                } else {
                    alert("Error")
                }
                component.getItemsByBookId(component.state.book.bookId);
            }
        };
    }

    giveBookBack(itemId, userId) {
        const component = this;
        const lending = JSON.stringify({
            userId: userId,
            itemId: itemId
        });
        const url = "http://localhost:8080/api/endLending";
        const http = new XMLHttpRequest();
        http.open("Post", url, true);
        http.withCredentials = true;
        http.setRequestHeader("Content-Type", "application/json");
        http.setRequestHeader("Access-Control-Allow-Methods", "Post");
        http.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        http.setRequestHeader("Access-Control-Allow-Credentials", "true");
        http.setRequestHeader("Access-Control-Max-Age", "3600");
        http.send(lending);
        http.onreadystatechange = function (e) {
            if (http.readyState === 4) {
                const data = JSON.parse(http.responseText);
                console.log(data);
                if (data.status === "ok") {
                    alert("Successful end")
                } else {
                    alert("Error")
                }
                component.getItemsByBookId(component.state.book.bookId);
            }
        };
    }

    mapItems(items, book) {
        //TODO łądniejszy wygląd + wyporzyczenie + if do act lib
        const component = this;
        let itemsTitle = (<div>
            <h2 className="book-page-title-label">No Items</h2>
        </div>);
        if (items.length > 0) {
            itemsTitle = (<div>
                <h2 className="book-page-title-label">Items</h2>
            </div>);
        }
        const itemsElements = items.map(function (item) {
            let lendingButton = (<span/>);
            let giveButton = (<span/>);
            let statusElement = (<p>{item.bookStatus}</p>);
            let itemDivClass = "book-page-item-borrowed-div";
            if (item.bookStatus === "") {
                statusElement = "On The Shelf";
                if (item.libraryId !== component.state.user.libId) {
                    itemDivClass = "book-page-item-div";
                    lendingButton = (<input className={"book-page-button"} type={"submit"} value={"Lend Book"}
                                            onClick={() => component.lendItem(item.itemId)}/>);
                }
            } else if (item.bookStatus === "outside") {
                statusElement = "Outside";
                if (item.libraryId === component.state.user.libId) {
                    giveButton = (<input className={"book-page-button"} type={"submit"} value={"Give book back"}
                                         onClick={() => component.giveBookBack(item.itemId, -1)}/>)
                }
            }
            if (item.actLibId !== 0) {
                if (item.actLibId === component.state.user.libId) {
                    giveButton = (<input className={"book-page-button"} type={"submit"} value={"Give book back"}
                                         onClick={() => component.giveBookBack(item.itemId, component.state.user.userId)}/>)
                }
            }
            return (<div key={"item-book" + item.itemId} className={itemDivClass}>
                    <div className={"book-page-item-flex-div"}>
                        <div className={"book-page-item-block-div"}>
                            <h3 className={"book-page-item-title-label"}>Title</h3>
                            <h2 className={"book-page-item-data-label"}>{book.title}</h2>
                        </div>
                        <div className={"book-page-item-block-div"}>
                            <h3 className={"book-page-item-title-label"}>Library Id</h3>
                            <h2 className={"book-page-item-data-label"}>{item.libraryId}</h2>
                        </div>
                        <div className={"book-page-item-block-div"}>
                            <h3 className={"book-page-item-title-label"}>Status</h3>
                            <h2 className={"book-page-item-data-label"}>{statusElement}</h2>
                        </div>
                    </div>
                    {lendingButton}
                    {giveButton}
                </div>
            )
        });
        this.setState({
            items: itemsElements,
            itemsTitle: itemsTitle
        });
    }

    componentWillMount() {
        this.getItemsByBookId(this.state.book.bookId)
    }

    render() {
        return (
            <div className={"book-page-div"}>
                <div className={"book-page-data-div"}>
                    <h2 className={"book-page-title-label"}>Title</h2>
                    <h1 className={"book-page-data-label"}>{this.state.book.title}</h1>

                    <h2 className={"book-page-title-label"}>Author</h2>
                    <h1 className={"book-page-data-label"}>{this.state.book.author}</h1>

                    <h2 className={"book-page-title-label"}>ISBN</h2>
                    <h1 className={"book-page-data-label"}>{this.state.book.isbn}</h1>

                    <h2 className={"book-page-title-label"}>Pages count</h2>
                    <h1 className={"book-page-data-label"}>{this.state.book.pagesCount}</h1>

                </div>
                {this.state.itemsTitle}
                {this.state.items}
            </div>
        );
    }
}

export default Book;