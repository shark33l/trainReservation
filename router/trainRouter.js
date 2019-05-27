var trainController=require('../controllers/trainController');
var express=require('express');
var router=express.Router();

//Get All Request
router.get('/', (req, res) => { trainController.get().then(data => {
        res.status(data.status).send(data.data);
    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});

//Get track by Date & Destination
router.get('/dest/:date/:destination/:direction', (req, res) => { trainController.getByRequired(req.params.date,req.params.destination,req.params.direction).then(data => {
    res.status(data.status).send(data.data);

}).catch(err => {
    res.status(err.status).send({message: err.message});
});
});

//Get track by Destination
router.get('/dest/:destination', (req, res) => { trainController.getByDestination(req.params.destination).then(data => {
    res.status(data.status).send(data.data);

    }).catch(err => {
        res.status(err.status).send({message: err.message});
    });
});

module.exports = router;