var reservations = require('../controllers/reservationController');
var express= require('express');
var router = express.Router();

//Call insert function in controller
router.post('/insertTicket', function(req,res){
    reservations.createRecord(req.body).then(function(data){
        res.status(data.status).send({message: data.message});
        return res.redirect('/');
    }).catch(err=>{
        res.status(err.status).send({message: err.message});
    })
});

module.exports = router;
