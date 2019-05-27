import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class ReservationResults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            results: [],
            originObj: [],
            destinationObj: [],
            resultTrack: [],
            resultReceived: 0,
            trains: []
        }
    }

    // componentWillUpdate(){
    //
    //     if (this.props.results) {
    //
    //         let self = this;
    //         let direction = this.props.results.direction;
    //         let resultTrack = this.props.resultTrack;
    //         var trains = []
    //
    //         console.log(resultTrack);
    //         console.log(resultTrack[0].trains)
    //         console.log(direction)
    //
    //         trains = resultTrack[0].trains.filter(function (train) {
    //             return train.direction === direction
    //         })
    //         console.log(trains);
    //         self.setState({
    //             trains: trains
    //         })
    //     }
    //
    // }

    //get Values
    getSelectedTrain(train, result){

        console.log(train);
        console.log(result);

    }

    //get Leading Zero
    padNumber(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    //get time in hours and minutes
    formatTime (departure,time){

        var timeState = 0;

        if(departure === "Morning"){
            timeState = 6
        }else if (departure === "Day"){
            timeState = 14
        }else if (departure === "Night"){
            timeState = 19
        }

        //hours & minutes
        var hours = timeState + (time/60);
        var rHours = Math.floor(hours);
        var minutes = Math.round((hours - rHours) * 60);

        if(rHours > 12){
            rHours = rHours -12;
        }

        if(hours < 13 || hours >= 24){
            return rHours + ":" + this.padNumber(minutes, 2) + " AM"
        }else{
            return rHours + ":" + this.padNumber(minutes,2) + " PM"
        }
    }

    render(){

        let date = <div></div>;
        let resultList = <tr></tr>;

        if(this.props.resultReceived !== 0) {

            if (this.props.results && this.props.resultReceived === 2) {

                let result = this.props.results;
                let trains = this.props.trains;

                if(result.time !== 0) {

                    date =
                        <div className="container my-3">
                            <h5 className="mb-3 ml-3">Trains for {result.date}</h5>
                        </div>

                    resultList = trains.map(train =>
                            <div className="card mb-2">
                                <h5 className="card-header">{train.name} Train to {result.destination}</h5>
                                <div className="card-body">
                                    <div className="form-row">
                                        <div className="col">
                                            <h5 className="card-title">Departure from {result.startLocation} at {this.formatTime(train.name, result.timeTaken)}.
                                                <br/>Arrives
                                                to {result.destination} at {this.formatTime(train.name, result.time + result.timeTaken)}.
                                            </h5>
                                            <h5 className="card-title">
                                                {result.noTickets} seats to book.
                                            </h5>
                                        </div>
                                        <div className="col">
                                            <div className="float-right">
                                                <p className="card-text text-right">LKR. {result.price}</p>
                                                <Link to={{pathname:'/reservation', state: {train : train, result : result}}}>
                                                    <button className="btn btn-primary" onClick={this.getSelectedTrain.bind(this,train, result)}>Book Tickets</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )

                    // let departureTime = this.formatTime("Morning", result.timeTaken);
                    // let arrivalTime = this.formatTime("Morning", result.timeTaken + result.time)

                    console.log(result);

                    // resultList =
                    //     <div className="container my-3">
                    //         <h5 className="mb-3 ml-3">Trains for {result.date}</h5>
                    //         <div className="card">
                    //             <h5 className="card-header">Morning Train to {result.destination}</h5>
                    //             <div className="card-body">
                    //                 <h5 className="card-title">Departure from {result.startLocation} at {departureTime}.
                    //                     <br/>Arrives
                    //                     to {result.destination} at {arrivalTime}.<br/>{result.noTickets} seats to book.
                    //                 </h5>
                    //                 <p className="card-text">LKR. {result.price}</p>
                    //                 <a href="/" className="btn btn-primary">Book Tickets</a>
                    //             </div>
                    //         </div>
                    //     </div>
                } else {
                    date = <div></div>
                    resultList =
                    <div className="alert alert-danger my-3 container" role="alert">
                        Please select a proper Origin or Destination.
                    </div>
                }
            } else {
                date = <div></div>
                resultList =
                    <div className="container my-5">
                        <div className="d-flex justify-content-center">
                            <div className="spinner-grow text-primary mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-secondary mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-success mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-danger mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-warning mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-info mx-2" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div className="container my-5">
                            <p className="h3 text-center">Looking for available Trains...</p>
                            <p className="h5 text-center">Please wait while we fetch the best results.</p>
                        </div>
                    </div>
            }
        }

        return(
            <div className="container">
                <hr />
                {date}
                {resultList}
            </div>
        );
    }
}

export default ReservationResults;