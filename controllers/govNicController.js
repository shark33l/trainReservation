var mongoose = require('../models/schemas');
var schema = mongoose.model('govNic');

var govNic = function(){

    //Create new Reservation Record
    this.createRecord = function (data){
        return new Promise (function(resolve,reject){
            var nic = schema ({
                nic: data.nic
            })
            nic.save().then(function () {
                resolve({status: 200, message: "Added a new NIC to the Government discount Record."});
            }).catch(err => {
                reject({status: 500, message: "Error :" + err});
            })
        })
    }

    //Check NIC
    this.getNic = (nic) => {
        return new Promise((resolve, reject) => {
            schema.find({'nic' : nic}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

    //Get All nic
    this.get = () => {
        return new Promise((resolve, reject) => {
            schema.find().exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

}

module.exports = new govNic();