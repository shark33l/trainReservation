var govNic = require('../controllers/govNicController');
var express= require('express');
var router = express.Router();

//Call insert function in controller
router.post('/addNic', function(req,res){
    govNic.createRecord(req.body).then(function(data){
        res.status(data.status).send({message: data.message});
    }).catch(err=>{
        res.status(err.status).send({message: err.message});
    })
});

//Get NIC
router.get('/check/:nic', (req, res) => { govNic.getNic(req.params.nic).then(data => {
    res.status(data.status).send(data.data);

}).catch(err => {
    res.status(err.status).send({message: err.message});
});

//Get All nic
    router.get('/getnic', (req, res) => { govNic.get().then(data => {
        res.status(data.status).send(data.data);
    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
    });
});



module.exports = router;
