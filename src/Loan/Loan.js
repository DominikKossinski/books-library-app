import React, {Component} from 'react'
import './Loan.css'

class Loan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loan: props.loan
        }
    }

    render() {
        //TODO ładniejszy widok
        return (<div className={"loan-div"}>
            <div className={"loan-block-div"}>
                <h5 className={"loan-title-label"}>User name</h5>
                <h4 className={"loan-data-label"}>{this.state.loan.name}</h4>
            </div>
            <div className={"loan-block-div"}>
                <h5 className={"loan-title-label"}>Start date</h5>
                <h4 className={"loan-data-label"}>{this.state.loan.startDate}</h4>
            </div>
            <div className={"loan-block-div"}>
                <h5 className={"loan-title-label"}>End date</h5>
                <h4 className={"loan-data-label"}>{this.state.loan.endDate}</h4>
            </div>
        </div>)
    }

}

export default Loan;