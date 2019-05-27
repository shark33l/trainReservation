var mongoose = require('../models/schemas');
var schema = mongoose.model('train');


var trainController = function () {

    //Get All tracks
    this.get = () => {
        return new Promise((resolve, reject) => {
            schema.find().exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

    //Get by Date, destination and Seats
    this.getByRequired = (date, destination, direction) => {
        return new Promise((resolve, reject) => {
            schema.find({'date' : date, 'destinations.place' : destination, 'trains.direction' : direction}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };


    //Get Track by Detsination
    this.getByDestination = (destinations) => {
        return new Promise((resolve, reject) => {
            schema.find({'destinations.place' : destinations}).exec().then((data) => { resolve({status: 200, data: data});
            }).catch(err => {
                reject({status: 500, message: "Error : " + err});
            }) })
    };

};

module.exports = new trainController();