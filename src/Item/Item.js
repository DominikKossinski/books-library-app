import React, {Component} from 'react'
import './Item.css'
import Loan from "../Loan/Loan";
import AddComment from "../AddComment/AddComment";

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            item: props.item,
            access: props.access,
            loans: [],
            show: false,
            showLoans: "Show Loans"
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.mapLoans = this.mapLoans.bind(this);
        this.showLoans = this.showLoans.bind(this);
        this.lendItem = this.lendItem.bind(this);
        this.giveItemBack = this.giveItemBack.bind(this);
        this.refreshLib = this.refreshLib.bind(this);
        this.showAddComment = this.showAddComment.bind(this);
    }

    refreshLib() {
        this.props.refreshLib()
    }

    lendItem(itemId) {
        //TODO better info
        const component = this;
        const lending = JSON.stringify({
            userId: this.state.user.userId,
            itemId: itemId,
            showAddElement: false
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
                component.refreshLib()
            }
        };
    }

    giveItemBack(itemId, userId) {
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
                component.refreshLib()
            }
        };
        this.showAddComment = this.showAddComment.bind(this);
    }

    showAddComment() {
        this.setState({
            showAddElement: !this.state.showAddElement
        })
    }


    componentWillMount() {
        if (this.state.access) {
            this.mapLoans(this.props.loans)
        }
    }

    mapLoans(loans) {
        const loansElements = loans.map(function (loan) {
            return (<Loan loan={loan}/>)
        });
        this.setState({
            loans: loansElements
        })
    }

    showLoans() {
        if (this.state.show) {
            this.setState({
                showLoans: "Show Loans",
                show: false
            })
        } else {
            this.setState({
                showLoans: "Hide Loans",
                show: true
            })
        }
    }

    render() {
        const component = this;
        let itemDivClass = "item-div";
        if (this.state.item.actLibId) {
            itemDivClass = "borrowed-item-div"
        }
        let loanButton = (<span/>);
        let giveButton = (<span/>);
        let statusElement = (<div>
            <h3 className={"item-title-label"}>Book Status</h3>
            <h2 className={"item-data-label"}>{this.state.item.bookStatus}</h2>
        </div>);
        if (this.state.item.bookStatus === "") {
            statusElement = (<div>
                <h3 className={"item-title-label"}>Book Status</h3>
                <h2 className={"item-data-label"}>On the shelf</h2>
            </div>);
            if (this.state.item.libraryId !== this.state.user.libId) {
                loanButton = (<input className={"item-button"} type={"submit"} value={"Lend Item"}
                                     onClick={() => component.lendItem(this.state.item.itemId)}/>);
            }
        } else if (this.state.item.bookStatus === "outside") {
            statusElement = (<div>
                <h3 className={"item-title-label"}>Book Status</h3>
                <h2 className={"item-data-label"}>Outside</h2>
            </div>);

            if (this.state.item.libraryId === component.state.user.libId) {
                giveButton = (<input className={"item-button"} type={"submit"} value={"Give item back"}
                                     onClick={() => component.giveItemBack(component.state.item.itemId, component.state.user.userId)}/>)
            }
        }
        if (this.state.item.actLibId === this.state.user.libId) {
            giveButton = (<input className={"item-button"} type={"submit"} value={"Give item back"}
                                 onClick={() => component.giveItemBack(component.state.item.itemId, component.state.user.userId)}/>)

        }
        let loansButton = (<span/>);
        let loansElements = (<span/>);
        let commentElement = (<span/>);
        if (this.state.access) {
            loansButton = (
                <input className={"item-button"} type={"submit"} value={this.state.showLoans} onClick={this.showLoans}/>
            );
            if (this.state.item.comment !== "") {
                commentElement = (<div>
                    <h3 className={"item-title-label"}>Comment</h3>
                    <h2 className={"item-data-label"}>{this.state.item.comment}</h2>
                </div>);
            }
            if (this.state.show) {
                loansElements = this.state.loans;
                if (this.state.loans.length === 0) {
                    loansElements = (<div>
                        <h3 className={"item-title-label"}>No loans</h3>
                    </div>)
                }
            }
        }
        let editButton = (<span/>);
        let addElement = (<span/>);
        if (this.state.item.libraryId === this.state.user.libId) {
            let edit = "Edit";
            if (this.state.showAddElement) {
                edit = "Hide Edit";
                addElement = (<AddComment refreshLib={this.refreshLib} user={this.state.user} item={this.state.item}/>)
            }
            editButton = (
                <input className={"item-button"} type={"submit"} value={edit} onClick={this.showAddComment}/>
            )
        }
        let readingElement = (<span/>);
        if (this.state.item.startDate && !this.state.item.endDate) {
            readingElement = (
                <h5 className={"reading-item-label"}>Reading now</h5>
            )
        }
        return (
            <div className={itemDivClass}>
                <div>
                    <div className={"item-data-flex-div"}>
                        <div className={"item-data-block-div"}>
                            <h3 className={"item-title-label"}>Title</h3>
                            <h2 className={"item-data-label"}>{this.state.item.book.title}</h2>
                        </div>
                        <div className={"item-data-block-div"}>
                            {statusElement}
                        </div>
                        <div className={"item-data-block-div"}>
                            {commentElement}
                        </div>
                        <div className={"item-data-block-div"}>
                            {readingElement}
                        </div>
                    </div>
                    {editButton}
                    {loanButton}
                    {giveButton}
                    {loansButton}
                </div>
                {addElement}
                {loansElements}
            </div>
        );
    }
}

export default Item;