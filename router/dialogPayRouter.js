var dialogPay = require('../controllers/dialogPayController');
var express= require('express');
var router = express.Router();

//Call insert function in controller
router.post('/addphonenumber', function(req,res){
    dialogPay.createRecord(req.body).then(function(data){
        res.status(data.status).send({message: data.message});
    }).catch(err=>{
        res.status(err.status).send({message: err.message});
    })
});

//Validate Card
router.post('/validate', (req, res) => { dialogPay.validate(req.body).then(data => {
    res.status(data.status).send(data.data);

    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});

//get All Card
router.get('/getphonenumbers', (req, res) => { dialogPay.getPhoneNumbers().then(data => {
    res.status(data.status).send(data.data);

    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});




module.exports = router;
