import React, { Component } from 'react';
const logo = require('../img/dialog-logo.png');

class DialogPayment extends Component{

    constructor(props){
        super(props);
        this.state = {
            result : [],
            purchaseDetails: [],
            phoneDetails: [],
            phoneValidation: [],
            errors: {
                name : "form-control",
                phoneNumber : "form-control",
                pin : "form-control",
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
        let phoneDetails = {...this.state.phoneDetails};
        phoneDetails[name] = value;
        this.setState({phoneDetails});

        console.log(phoneDetails);

    }

    handleValidation(){
        let phoneDetails = this.state.phoneDetails;
        let formIsValid = true;
        let errors = {...this.state.errors};

        //RegExp for Numbers

        //Phone Number Min 9 Digits
        const phoneRegex = /\d{9}/;

        //Pin Number 4 Digits
        const pinRegex = /\d{4}/;


        //Name
        if(!phoneDetails["name"]){
            errors["name"] = "form-control is-invalid";
            formIsValid = false;
        } else if(typeof phoneDetails["name"] !== "undefined"){
            if(!phoneDetails["name"].match(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)){
                errors["name"] = "form-control is-invalid";
                formIsValid = false;
            } else{
                errors["name"] = "form-control";
            }
        } else{
            errors["name"] = "form-control";
        }

        //Phone Number
        if(!phoneRegex.test(phoneDetails["phoneNumber"])){
            errors["phoneNumber"] = "form-control is-invalid";
            formIsValid = false;
        } else {
            errors["phoneNumber"] = "form-control";
        }

        //Pin number
        if(!pinRegex.test(phoneDetails["pin"])){
            errors["pin"] = "form-control is-invalid";
            formIsValid = false;
        } else {
            errors["pin"] = "form-control";
        }

        this.setState({formMessage: "Error! Please fill the form properly."});
        this.setState({errors: errors});
        this.setState({formIsValid: formIsValid});
        return formIsValid;
    }

    onSubmitDetails(e){
        //e.preventDefault();

        let self = this;
        let phone = this.state.phoneDetails;
        let result = this.state.result;
        let purchaseDetails = this.state.purchaseDetails;

        //Phone Number Data
        let phoneData = {
            "phoneNumber": phone.phoneNumber,
            "pin": phone.pin
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
            fetch('http://localhost:5000/dialogpay/validate', {
                method: 'POST',
                body: JSON.stringify(phoneData),
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                return response.json()
            })
                .then(json => {
                    console.log(json)
                    self.setState({
                            phoneValidation: json
                        }
                    )
                });

            setTimeout(function () {

                if(self.state.phoneValidation.length > 0){

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
                }  else {

                    self.setState({
                        processing : false,
                        submitText : 'Submit',
                        formMessage : "Phone Number Details Rejected. Please try again",
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
                <div className="card w-50 mx-auto border-danger">
                    < div className="card-body">
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <h5 className="card-title">Dialog Payment</h5>
                            </div>
                            <div className="form-group col-md-4">
                                <img src={logo} width="83" height="50"
                                     className="align-top float-left ml-5" alt="" />
                            </div>
                        </div>
                        <form className="mt-1">
                            <div className="form-group">
                                <label htmlFor="labelName">Name</label>
                                <input type="text" className={this.state.errors.name}  name="name" placeholder="Name" onChange={this.handleFormChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="labelPhoneNumber">Phone Number</label>
                                <input type="text" className={this.state.errors.phoneNumber}  name="phoneNumber" onChange={this.handleFormChange} maxlength="10"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="labelPin">Pin</label>
                                <input type="text" className={this.state.errors.pin}  name="pin" onChange={this.handleFormChange} maxlength="4"/>
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

export default DialogPayment;