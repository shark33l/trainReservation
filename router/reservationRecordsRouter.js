var reservationRecordsController = require('../controllers/reservationRecordsController');
var express= require('express');
var router = express.Router();

//Call insert function in controller
router.post('/', function(req,res){
    reservationRecordsController.createRecord(req.body).then(function(data){
        res.status(data.status).send({message: data.message});
    }).catch(err=>{
        res.status(err.status).send({message: err.message});
    })
});

//Get Available Seats Request
router.post('/getSeats', (req, res) => { reservationRecordsController.getAvailableSeats(req.body).then(data => {
    res.status(data.status).send(data.data);
    }).catch(err => {
    res.status(err.status).send({message: err.message});
    });
});

//Update Seats
router.post('/update', function (req, res, next) {
    reservationRecordsController.updateRecord(req.body).then(data => {
        res.status(data.status).send({message: "Seats Successfully Updated."});
    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
})

module.exports = router;