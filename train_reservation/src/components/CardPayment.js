import React, { Component } from 'react';
const logo = require('../img/sampath-logo.png');

class CardPayment extends Component{

    constructor(props){
        super(props);
        this.state = {
            result : [],
            purchaseDetails: [],
            cardDetails: [],
            cardValidation: [],
            errors: {
                name : "form-control",
                cardNumber : "form-control",
                cvc : "form-control",
                expDate : "form-control"
            },
            formIsValid: "true",
            formMessage: "Error! Please fill the form properly.",
            processing: false,
            submitText: 'Submit',
            successButton : "btn btn-dark w-100 mt-2 mb-2"
        }
    }

    handleFormChange = e =>{
        const {name, value} = e.target;
        let cardDetails = {...this.state.cardDetails};
        cardDetails[name] = value;
        this.setState({cardDetails});

        console.log(cardDetails);

    }

    handleValidation(){
        let cardDetails = this.state.cardDetails;
        let formIsValid = true;
        let errors = {...this.state.errors};

        //RegExp for Numbers

        //Card Number 16 Digits
        const cardRegex = /\d{16}/;
        const cvcRegex = /\d{3}/;
        const expRegex = /\d{2}-\d{2}$/;


        //Name
        if(!cardDetails["name"]){
            errors["name"] = "form-control is-invalid";
            formIsValid = false;
        } else if(typeof cardDetails["name"] !== "undefined"){
            if(!cardDetails["name"].match(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)){
                errors["name"] = "form-control is-invalid";
                formIsValid = false;
            } else{
                errors["name"] = "form-control";
            }
        } else{
            errors["name"] = "form-control";
        }

        //Card Number
        if(!cardRegex.test(cardDetails["cardNumber"])){
            errors["cardNumber"] = "form-control is-invalid";
            formIsValid = false;
        } else {
            errors["cardNumber"] = "form-control";
        }

        //CVC number
        if(!cvcRegex.test(cardDetails["cvc"])){
            errors["cvc"] = "form-control is-invalid";
            formIsValid = false;
        } else {
            errors["cvc"] = "form-control";
        }

        //Expiry Date
        if(!expRegex.test(cardDetails["expDate"])){
            errors["expDate"] = "form-control is-invalid";
            formIsValid = false;
        } else {
            errors["expDate"] = "form-control";
        }

        this.setState({formMessage: "Error! Please fill the form properly."});
        this.setState({errors: errors});
        this.setState({formIsValid: formIsValid});
        return formIsValid;
    }

    onSubmitDetails(e){
        //e.preventDefault();

        let self = this;
        let card = this.state.cardDetails;
        let result = this.state.result;
        let purchaseDetails = this.state.purchaseDetails;

        //Credit Card Data
        let cardData = {
            "cardNumber": card.cardNumber,
            "cvc": card.cvc
        }

        //User Ticket Data
        let ticketData = {
            "name": purchaseDetails.name,
            "date": result.date,
            "email": purchaseDetails.email,
            "nic": purchaseDetails.nic,
            "tripFrom": result.startLocation,
            "tripTo": result.destination,
            "noSeats": result.noTickets,
            "total": result.price
        }

        if(this.handleValidation()){

            self.setState({
                processing : true,
                submitText : ''

            });

            //Validate Card, Fetch Details
            fetch('http://localhost:5000/creditcard/validate', {
                method: 'POST',
                body: JSON.stringify(cardData),
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                    return response.json()
                })
                .then(json => {
                    console.log(json)
                    self.setState({
                            cardValidation: json
                        }
                    )
                });

            setTimeout(function () {

                if(self.state.cardValidation.length){

                    //Create new Ticket
                    fetch('http://localhost:5000/addTicket/insertTicket', {
                        method: 'POST',
                        body: JSON.stringify(ticketData),
                        headers: {'Content-Type': 'application/json'}
                    }).then(response => {
                        return response.json()
                    })
                        .then(json => {
                            console.log(json)
                        });

                    self.setState({
                        processing : false,
                        successButton : "btn btn-success w-100 mt-2 mb-2",
                        submitText : 'Reservation Confirmed. Mail Sent.'
                    })

                    setTimeout(function(){
                        window.location.replace("http://localhost:3000");
                    }, 4000)
                } else {

                    self.setState({
                        processing : false,
                        submitText : 'Submit',
                        formMessage : "Card validation failed. Authorization Rejected. Please try again",
                        formIsValid: false
                    });
                }

            },1000);
        };

    }

    componentWillMount() {

        let purchaseDetails = this.props.location.state.purchaseDetails;
        let result = this.props.location.state.result;

        this.setState({
            purchaseDetails: purchaseDetails,
            result: result
        })

        console.log(purchaseDetails);
        console.log(result);


    }

    render(){
        return(
            <div className="container mt-4">
                <div className="alert alert-danger my-3 w-50 mx-auto" role="alert" hidden={this.state.formIsValid}>
                    {this.state.formMessage}
                </div>
                <div className="card w-50 mx-auto border-warning">
                    < div className="card-body">
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <h5 className="card-title">Card Payment</h5>
                            </div>
                            <div className="form-group col-md-4">
                                <img src={logo} width="130" height="30"
                                     className="align-top float-left ml-4" alt="" />
                            </div>
                        </div>
                        <form className="mt-1">
                                <div className="form-group">
                                    <label htmlFor="labelName">Name</label>
                                    <input type="text" className={this.state.errors.name}  name="name" placeholder="Name" onChange={this.handleFormChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="labelCardNumber">Card Number</label>
                                    <input type="text" className={this.state.errors.cardNumber}  name="cardNumber" onChange={this.handleFormChange} maxlength="16"/>
                                </div>
                            <div className="form-group">
                                <label htmlFor="labelCVC">CVC</label>
                                <input type="text" className={this.state.errors.cvc}  name="cvc" onChange={this.handleFormChange} maxlength="3"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="labelDate">Expiry Date</label>
                                <input type="text" className={this.state.errors.expDate}  name="expDate" placeholder="mm-dd" onChange={this.handleFormChange} maxlength="5"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">Amount - LKR.{this.state.result.price}</label>
                            </div>
                        </form>
                        <button className={this.state.successButton} onClick={this.onSubmitDetails.bind(this)}>{this.state.submitText}
                        <div className="spinner-border text-light spinner-border-sm" role="status" hidden={!this.state.processing}>
                            <span className="sr-only">Loading...</span>
                        </div></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default CardPayment;