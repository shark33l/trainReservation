var mongoose = require('../models/schemas');
var schema = mongoose.model('reservations');
var nodemailer = require('nodemailer');

var reservations = function(){

    //Create new Reservation Record
    this.createRecord = function (data){
        return new Promise (function(resolve,reject){
            var reservations = schema ({
                name: data.name,
                date: data.date,
                email: data.email,
                nic: data.nic,
                tripFrom: data.tripFrom,
                tripTo: data.tripTo,
                noSeats: data.noSeats,
                total: data.total
            })
            reservations.save().then(function () {
                resolve({status: 200, message: "Added a new reservation record.", record : reservations});

                //Send Confirmation mail to Customer
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    auth: {
                        user: 'sltrainreservationshk@gmail.com',
                        pass: 'Sliit2019*'
                    },
                    tls: {
                        rejectUnauthorized : false
                    }
                });

                //Email Body
                var emailBody = 'Hi ' + data.name +',\r\rYour reservation was successful. Payment of LKR.' + data.total + ' was accepted for ' + data.noSeats
                    + ' ticket/s to ' + data.tripTo + ' from ' + data.tripFrom + '.\r\rThank You.\rTrain Reservation Services'

                console.log(emailBody);

                var mailOptions = {
                    from: 'sltrainreservationshk@gmail.com',
                    to: data.email,
                    subject: 'Train Reservation Successful for ' + data.date,
                    text: emailBody
                };

                console.log(mailOptions);

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        console.log('Preview URL : %s', nodemailer.getTestMessageUrl(info))
                    }
                });

            }).catch(err => {
                reject({status: 500, message: "Error :" + err});
            })
        })
    }

}

module.exports = new reservations();