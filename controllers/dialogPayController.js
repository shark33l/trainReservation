var mongoose = require('../models/schemas');
var schema = mongoose.model('dialogPay');

var dialogPay = function(){

    //Add a valid Dialog Number
    this.createRecord = function (data){
        return new Promise (function(resolve,reject){
            var dialogPay = schema ({
                name: data.name,
                phoneNumber: data.phoneNumber,
                pin: data.pin
            })
            dialogPay.save().then(function () {
                resolve({status: 200, message: "Added a new valid Phone Number.", phoneDetails: dialogPay});
            }).catch(err => {
                reject({status: 500, message: "Error :" + err});
            })
        })
    }

    //Validate Phone Number Payment
    this.validate = (dialogPay) => {
        return new Promise((resolve, reject) => {
            schema.find({'phoneNumber' : dialogPay.phoneNumber, 'pin' : dialogPay.pin}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

    //Get All Phone Numbers
    this.getPhoneNumbers = () => {
        return new Promise((resolve, reject) => {
            schema.find().exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

}

module.exports = new dialogPay();