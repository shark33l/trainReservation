import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import ReservationResults from "./ReservationResults"
import "react-datepicker/dist/react-datepicker.css";

class ReservationSearchForm extends Component {

    constructor() {
        super();
        this.state = {
            tracks: [],
            isFetched: false,
            searchForm : {
                reservationDate: new Date()
            },
            destinations: [],
            startDate: new Date(),
            results: [],
            resultTrack: [],
            trains:[],
            existingTrains:[],
            originObj: [],
            destinationObj: [],
            resultReceived: 0,
            errors: {
                startLocation : "form-control",
                destination : "form-control",
                noOfSeats : "form-control"
            },
            formIsValid: "true"
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSearchChange = e =>{
        const {name, value} = e.target;
        let searchForm = {...this.state.searchForm};
        searchForm[name] = value;
        this.setState({searchForm});
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });

        let e = {
            target: {
                name: "reservationDate",
                value: date
            }
        };
        this.handleSearchChange(e);
    }

    onOriginChange(e){
        let errors = {
            startLocation : this.state.errors.startLocation,
            destination : this.state.errors.destination,
            noOfSeats : this.state.errors.noOfSeats
        };


        console.log(e.target.value);

        if(e.target.value !== "0") {
            errors["startLocation"] = "form-control";
            this.setState({errors: errors});
            this.handleSearchChange(e);
            this.setDestinations(e);
        }else{
            this.setState({destinations : []})
        }
    }


    setDestinations(e){
        console.log(this.state);
        let origin = e.target.value;

        if(this.state.tracks.length) {
            let train = this.state.tracks.find(function (track) {
                return track.destinations.find(function (place) {
                    return place.place === origin
                })
            })
            this.setState({destinations: train.destinations})
        }

    }

    handleValidation(){
        let formIsValid = true;
        let errors = {};

        if(!this.state.destinations.length){
            errors["startLocation"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["startLocation"] = "form-control";
        }
        if(!this.state.searchForm.To){
            errors["destination"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["destination"] = "form-control";
        }
        if(!this.state.searchForm.noOfSeats){
            errors["noOfSeats"] = "form-control is-invalid";
            formIsValid = false;
        }else if (this.state.searchForm.noOfSeats === "0"){
            errors["noOfSeats"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["noOfSeats"] = "form-control";
        }
        if(this.state.searchForm.To === "0"){
            errors["destination"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["destination"] = "form-control";
        }

        this.setState({errors: errors});
        this.setState({formIsValid: formIsValid});
        return formIsValid;
    }

    getOriginObj(){

        let self = this;
        var origin = this.state.searchForm.From;
        var originObj = {};

        //get Origin Details
        fetch('http://localhost:5000/tracks/dest/' + this.state.searchForm.From)
            .then(response => response.json())
            .then(json => {
                originObj = json[0].destinations.find(function(place){
                    return place.place === origin

                })
                self.setState({
                        resultTrack : json,
                        originObj : originObj,
                        trainStart : json[0].destinations[0],
                        trainEnd : json[0].destinations[json[0].destinations.length - 1]
                    }

                )
            });

    }

    getDestinationObj(){

        let self = this;
        var destination = this.state.searchForm.To;
        var destinationObj = {}

        //get Destination Details
        fetch('http://localhost:5000/tracks/dest/' + this.state.searchForm.To)
            .then(response => response.json())
            .then(json => {
                destinationObj = json[0].destinations.find(function(place){
                    return place.place === destination

                })
                self.setState({
                        resultTrack : json,
                        destinationObj : destinationObj
                    }
                )
            });

    }

    getReservations(){

        this.getOriginObj();
        this.getDestinationObj();

        this.setState({resultReceived : 1});

        let self = this;

        setTimeout(function () {

            self.setReservations();

        },3000)

    }

    async getExistingReservations(date, trackNo, direction, noTickets) {

        let self = this;
        var trains;
        var ticketRange = 100 - noTickets;

        var data = {
            "date": date,
            "trackNo": trackNo,
            "direction": direction
        }

        console.log(data);

        //get Existing Reservation Details
        await fetch('http://localhost:5000/resRecords/getSeats', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                return response.json()
            })
            .then(json => {
                console.log(json)
                trains = json.find(function (tickets) {
                    return tickets.noTickets < ticketRange

                })
                self.setState({
                        existingTrains: trains
                    }
                )
            });

    }

    setReservations(){

        let resultSearch = {};

        let originObj = this.state.originObj;
        let destinationObj = this.state.destinationObj;
        let noTickets = parseInt(this.state.searchForm.noOfSeats);
        let resultTrack = this.state.resultTrack;

        var direction;
        var startDistanceDif;

        console.log(originObj);
        console.log(destinationObj);

        var distanceDif = originObj.distance - destinationObj.distance;

        if(distanceDif <= 0){
            resultSearch["price"] = this.calculatePrice(parseFloat(-distanceDif), noTickets);
            resultSearch["time"] = this.calculateTime(parseFloat(-distanceDif));
            resultSearch["direction"] = "0";
            direction = 0

            startDistanceDif = originObj.distance - this.state.trainStart.distance;
            resultSearch["timeTaken"] = this.calculateTime(startDistanceDif);

        }else{
            resultSearch["price"] = this.calculatePrice(parseFloat(distanceDif), noTickets);
            resultSearch["time"] = this.calculateTime(parseFloat(distanceDif));
            resultSearch["direction"] = "1";
            direction = 1

            startDistanceDif = this.state.trainEnd.distance - originObj.distance ;
            resultSearch["timeTaken"] = this.calculateTime(startDistanceDif);
        }

        var dateObj = this.state.searchForm.reservationDate;

        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        var convertedDate = day + "-" + month + "-" + year;

        resultSearch["date"] = convertedDate;
        resultSearch["startLocation"] = this.state.searchForm.From;
        resultSearch["destination"] = this.state.searchForm.To;
        resultSearch["noTickets"] = noTickets;

        console.log(resultTrack[0].trains);

        this.getExistingReservations(convertedDate, resultTrack.trackNo, direction, noTickets);

        let trains = resultTrack[0].trains.filter(function (train) {
            return train.direction === direction
        })
        this.setState(
            {
                trains : trains
            }
        )

        this.setState({resultReceived : 2})
        this.setState({resultSearch: resultSearch});
    }

    setResults(e){
        e.preventDefault();

        if(this.handleValidation()){

            this.getReservations();

            this.setState({results: this.state.searchForm});
        }


    }

    //Calculations

    //Calculate Price
    calculatePrice(distance, noTickets){

        //Lkr 3.00 per KM
        var rate = 3.0;

        return parseFloat(distance * rate * noTickets).toFixed(2);

    }

    //Calculate Time
    calculateTime(distance){

        //average Speed 75km/h in km/minute
        var speed = 1.25;

        return distance/speed;


    }

    componentWillMount() {

        let self = this;

        fetch('http://localhost:5000/tracks')
            .then(response => response.json())
            .then(json => {
                self.setState({
                    isFetched : true,
                    tracks : json,
                    }
                )
            });
    }

    render(){

        const { tracks, destinations } = this.state;
        var startLocationList = <option></option>;
        var destinationList = <option>Select a Start Location</option>;

        if(tracks.length){

            let locationList = tracks.map(location => location.destinations)

            let mergedLocationArray = locationList.flat(1)

            startLocationList = mergedLocationArray.map(location =>
                <option value={location.place}>{location.place}</option>
            )
        }

        if(destinations.length){

            destinationList = destinations.map(destination =>
                <option value={destination.place}>{destination.place}</option>
            )

        }

        if(tracks.length){
            return (
                <div className="Header">
                    <div className="alert alert-danger my-3 container" role="alert" hidden={this.state.formIsValid}>
                        Error! Please fill the form.
                    </div>
                    <div className="container my-5">
                    <form>
                        <div className="form-row">
                        <div className="form-group col-md-6">
                        <label name="DateLabel" className="mr-4 col-form-label">Date</label>
                        <DatePicker className="list-group-item" width= "100%"
                            selected={this.state.searchForm.reservationDate} dateFormat="dd MMM yyyy"
                            onChange={this.handleChange}
                        />
                        </div>
                            <div className="form-group col-md-6 mt-2">
                                <hr />
                            </div>
                        </div>

                        <div className="form-row my-4">
                        <div className="col">
                        <label name="FromLabel" className="col-sm-2 col-form-label">From</label>
                        <select name="From" className={this.state.errors.startLocation}  onChange={this.onOriginChange.bind(this)} disabled={!this.state.tracks.length} required>
                            <option value="0">-Select Start Location-</option>
                            {startLocationList}
                        </select>
                        </div>

                        <div className="col">
                        <label name="ToLabel" className="col-sm-2 col-form-label">To</label>
                        <select name="To" className={this.state.errors.destination} onChange={this.handleSearchChange} disabled={!this.state.destinations.length} required>
                            <option value="0">-Select Destination-</option>
                            {destinationList}
                        </select>
                        </div>
                        </div>

                        <div className="form-group my-4">
                        <label name="noTickets" className="col-sm-5 col-form-label">Number of Seats</label>
                        <input type="number" className={this.state.errors.noOfSeats} name="noOfSeats" onChange={this.handleSearchChange} required/>
                        </div>

                        <div className="form-group my-4">
                        <button name="search" className="form-control btn btn-primary btn-lg" onClick={this.setResults.bind(this)}>Search for Reservations</button>
                        </div>
                    </form>
                    </div>

                    <ReservationResults results={this.state.resultSearch} resultTrack={this.state.resultTrack} resultReceived={this.state.resultReceived} trains={this.state.trains}/>
                </div>
            );}
        else{
            return(
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
                        <p className="h3 text-center">Fetching Data...</p>
                        <p className="h5 text-center">Please refresh page if this takes longer.</p>
                    </div>
                </div>
            );
        }
    }
}

export default ReservationSearchForm;