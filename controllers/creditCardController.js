var mongoose = require('../models/schemas');
var schema = mongoose.model('creditCard');

var creditCard = function(){

    //Add a valid Creditcard
    this.createRecord = function (data){
        return new Promise (function(resolve,reject){
            var creditCard = schema ({
                name: data.name,
                cardNumber: data.cardNumber,
                cvc: data.cvc,
                expDate: data.expDate
            })
            creditCard.save().then(function () {
                resolve({status: 200, message: "Added a new valid Creditcard.", cardDetails: creditCard});
            }).catch(err => {
                reject({status: 500, message: "Error :" + err});
            })
        })
    }

    //Validate Creditcard
    this.validate = (creditCard) => {
        return new Promise((resolve, reject) => {
            schema.find({'cardNumber' : creditCard.cardNumber, 'cvc' : creditCard.cvc}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

    //Get All Cards
    this.getCards = () => {
        return new Promise((resolve, reject) => {
            schema.find().exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

}

module.exports = new creditCard();