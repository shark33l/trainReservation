var creditCard = require('../controllers/creditCardController');
var express= require('express');
var router = express.Router();

//Call insert function in controller
router.post('/addcreditcard', function(req,res){
    creditCard.createRecord(req.body).then(function(data){
        res.status(data.status).send({message: data.message});
    }).catch(err=>{
        res.status(err.status).send({message: err.message});
    })
});

//Validate Card
router.post('/validate', (req, res) => { creditCard.validate(req.body).then(data => {
    res.status(data.status).send(data.data);

    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});

//get All Card
router.get('/getcards', (req, res) => { creditCard.getCards().then(data => {
    res.status(data.status).send(data.data);

    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});




module.exports = router;
