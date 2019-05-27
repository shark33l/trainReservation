var mongoose = require('../models/schemas');
var schema = mongoose.model('reservationRecords');


var reservationRecords = function () {

    //Create new Reservation Record
    this.createRecord = function (data){
        return new Promise (function(resolve,reject){
            var reservationRecord = schema ({
                date: data.date,
                trackNo: data.trackNo,
                time: data.time,
                direction: data.direction,
                noTickets: data.noTickets
            })
            reservationRecord.save().then(function () {
                resolve({status: 200, message: "Added a new reservation record."});
            }).catch(err => {
                reject({status: 500, message: "Error :" + err});
            })
        })
    }

    //Update Reservation Record
    this.updateRecord = (data) => {

        return new Promise((resolve, reject) => {
            schema.updateOne(
                { _id: data._id },
                { $inc: { noTickets: data.noTickets} }
            ).then((data) => { resolve({status: 200, message: "Seats are updated"});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };


    //Get available seats for all other parameters
    this.getAvailableSeats = (data) => {
        return new Promise((resolve, reject) => {
            schema.find({"date" : data.date, "trackNo" : data.trackNo, "direction" : data.direction}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

    //Get Track by Destination
    this.getByDestination = (destinations) => {
        return new Promise((resolve, reject) => {
            schema.find({'destinations.place' : destinations}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

};

module.exports = new reservationRecords();