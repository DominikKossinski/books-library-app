import React, {Component} from 'react'
import './Search.css'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pattern: ""
        };

        this.onPatternChange = this.onPatternChange.bind(this);
    }

    onPatternChange(e) {
        const pattern = e.target.value;
        this.setState({
            pattern: pattern
        });
        this.props.onPatternChange(pattern);
    }

    render() {
        return (<div className={"search-div"}>
            <h3 className={"search-label"}>Search</h3>
            <input className={"search-input"} type={"text"} placeholder={"Search"} value={this.state.pattern} onChange={this.onPatternChange}/>
        </div>)
    }
}

export default Search;