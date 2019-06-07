import React, {Component} from 'react'
import './AddComment.css'

class AddComment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            comment: "",
            item: props.item,
        };

        this.refreshLib = props.refreshLib;
        this.setReading = this.setReading.bind(this);
        this.addComment = this.addComment.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
    }

    setReading() {
        const component = this;
        const url = "http://localhost:8080/api/" + this.state.user.userId + "/reading";
        const http = new XMLHttpRequest();
        const item = JSON.stringify({
            itemId:this.state.item.itemId,
        });
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
                if (data.status === "ok") {
                    alert("Successful reading change");
                    component.refreshLib()
                }
            }
        };
    }

    addComment() {
        const component = this;
        const url = "http://localhost:8080/api/" + this.state.user.userId + "/addComment";
        const http = new XMLHttpRequest();
        const item = JSON.stringify({
            itemId:this.state.item.itemId,
            comment:this.state.comment
        });
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
                if (data.status === "ok") {
                    alert("Successful adding comment");
                    component.refreshLib()
                }
            }
        };
    }

    onCommentChange(e) {
        const comment = e.target.value;
        this.setState({
            comment: comment
        })
    }

    render() {
        let reading = "Read Book";
        if (!this.state.item.endDate) {
            reading = "End Reading"
        }
        return (<div className={"comment-div"}>
            <textarea className={"comment-textarea"} value={this.state.comment} onChange={this.onCommentChange}/>
            <br/>

            <input className={"add-comment-button"} type={"submit"} value={"Add Comment"} onClick={this.addComment}/>
            <input className={"add-comment-button"} type={"submit"} value={reading} onClick={this.setReading}/>
        </div>)
    }

}

export default AddComment;