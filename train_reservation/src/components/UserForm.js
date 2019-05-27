import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom'

class UserForm extends Component{

    constructor(props){
        super(props);
        this.state = {
            train : [],
            result : [],
            purchaseDetails: [],
            availableNic: [],
            errors: {
                name : "form-control",
                nic : "form-control",
                email : "form-control",
                paymentType : "form-control"
            },
            type: '/reservation',
            nicIsGov: true,
            formIsValid: true,
            processing: false,
            submitText: 'Submit'
        }
    }

    handleFormChange = e =>{

        const {name, value} = e.target;
        let purchaseDetails = {...this.state.purchaseDetails};
        purchaseDetails[name] = value;
        this.setState({purchaseDetails});

        console.log(purchaseDetails);

    }

    handleValidation(){
        let purchaseDetails = this.state.purchaseDetails;
        let formIsValid = true;
        let errors = {...this.state.errors};

        //NIC Validation, 9 Digits, last character can be a letter or digit
        const nicRegex = /\d{9}\w$/i;


        //Name
        if(!purchaseDetails["name"]){
            errors["name"] = "form-control is-invalid";
            formIsValid = false;
        } else if(typeof purchaseDetails["name"] !== "undefined"){
            if(!purchaseDetails["name"].match(/[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/)){
                errors["name"] = "form-control is-invalid";
                formIsValid = false;
            } else{
                errors["name"] = "form-control";
            }
        } else{
            errors["name"] = "form-control";
        }

        //Email
        if(!purchaseDetails["email"]){
            errors["email"] = "form-control is-invalid";
            formIsValid = false;
        } else if(typeof purchaseDetails["email"] !== "undefined"){
            let lastAtPos = purchaseDetails["email"].lastIndexOf('@');
            let lastDotPos = purchaseDetails["email"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && purchaseDetails["email"].indexOf('@@') == -1 && lastDotPos > 2 && (purchaseDetails["email"].length - lastDotPos) > 2)) {
                errors["email"] = "form-control is-invalid";
                formIsValid = false;
            }
        } else{
            errors["email"] = "form-control";
        }

        //nic
        if(!purchaseDetails.nic || purchaseDetails.nic === ''){
            errors["nic"] = "form-control is-invalid";
            formIsValid = false;
        }else if (!nicRegex.test(purchaseDetails.nic)){
            errors["nic"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["nic"] = "form-control";
        }

        //Payment Type
        if(!purchaseDetails.paymentType || purchaseDetails.paymentType === "0"){
            errors["paymentType"] = "form-control is-invalid";
            formIsValid = false;
        }else{
            errors["paymentType"] = "form-control";
        }

        this.setState({errors: errors});
        this.setState({formIsValid: formIsValid});
        return formIsValid;
    }

    onSubmitDetails(e){

        let self = this;

        if(this.handleValidation()){

            self.setState({
                processing : true,
                submitText : ''

            });

            let userNic = this.state.purchaseDetails.nic

            //check for government employee using NIC
            fetch('http://localhost:5000/nic/check/' + userNic)
                .then(response => response.json())
                .then(json => {
                    userNic = json.find(function(nic){
                        return nic === userNic

                    })
                    self.setState({
                        availableNic : json
                        }
                    )
                });

            setTimeout(function () {

                //Give discount if it's government employee;
                if(self.state.availableNic.length){

                    console.log(self.state.result.price)

                    var newPrice = parseFloat(self.state.result.price * 0.9).toFixed(2);

                    const price = 'price';

                    console.log(newPrice);

                    let result = {...self.state.result};
                    result[price] = newPrice;
                    self.setState({result});
                    self.setState({
                        nicIsGov : false
                    });

                    console.log(self.state.result.price);

                }

                self.setState({
                    submitText : 'Confirm'
                })

                self.setState({
                    processing : false
                });

            },1000);


            //Choosing the correct payment type gateway
            this.setState({
                type : '/reservation/' + this.state.purchaseDetails.paymentType
            })
        } else {
            this.setState({
                type : '/reservation/'
            })
        }

    }

    componentWillMount() {

            let train = this.props.location.state.train;
            let result = this.props.location.state.result;

            this.setState({
                train: train,
                result: result
            })

            console.log(train);
            console.log(result);


    }

    render(){

        let train = this.state.train;
        let result = this.state.result;

        //if(train.length && result.length) {
            return (
                <div className="container mt-5">
                    <div className="alert alert-danger my-3 container w-50" role="alert" hidden={this.state.formIsValid}>
                        Error! Please fill the form properly.
                    </div>
                    <div className="card w-50 mx-auto border-primary">
                        < div className="card-body">
                            <h5 className="card-title">Purchasing Details</h5>
                            <form>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="labelName">Name</label>
                                        <input type="text" className={this.state.errors.name}  name="name" placeholder="Name" onChange={this.handleFormChange}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="labelNic">NIC</label>
                                        <input type="text" className={this.state.errors.nic}  name="nic" placeholder="NIC" onChange={this.handleFormChange} maxlength="10" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="labelEmail">E-mail</label>
                                    <input type="email" className={this.state.errors.email}  name="email" placeholder="example@mail.com" onChange={this.handleFormChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="labelPaymentType">Payment Type</label>
                                    <select name="paymentType" className={this.state.errors.paymentType}  onChange={this.handleFormChange}>
                                        <option disabled selected value="0">Choose...</option>
                                        <option value="cardpayment">Credit/Debit Card</option>
                                        <option value="dialogpay">Dialog Pay</option>
                                    </select>
                                </div>
                            </form>
                            <p className="form-text text-muted">Add your NIC to check eligibility for Government staff
                                offers.</p>
                            <div className="alert alert-success my-3 container" role="alert" hidden={this.state.nicIsGov}>
                                You've received a 10% discount as a government employee.
                            </div>
                            <Link to={{pathname:this.state.type, state: {purchaseDetails : this.state.purchaseDetails, result : this.state.result}}}>
                            <button className="btn btn-primary w-100 mt-2 mb-2" onClick={this.onSubmitDetails.bind(this)}>{this.state.submitText}
                                <div className="spinner-border text-light spinner-border-sm" role="status" hidden={!this.state.processing}>
                                    <span className="sr-only">Loading...</span>
                                </div></button>
                            </Link>
                        </div>
                    </div>
                    <div className="card w-50 mx-auto mt-3">
                        < div className="card-body">
                            <h5 className="card-title">Reserved Ticket Details</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Date - {result.date}</li>
                                <li className="list-group-item">{train.name} Train to {result.destination} from {result.startLocation}</li>
                                <li className="list-group-item">{result.noTickets} to be Purchased</li>
                                <li className="list-group-item">LKR. {result.price}</li>
                            </ul>

                        </div>
                    </div>
                </div>

            );
        // } else {
        //     return(
        //         <Redirect to='/'/>
        //     );
        // }
    }
}

export default UserForm;