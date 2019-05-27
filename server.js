import express from 'express'
import {Schema} from "mongoose";
const mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');

// Set up the express app
const app = express();
// get all todos
app.get('/api', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'api successfully running',
        data: hello()
    })
});
const PORT = 5000;

function hello(){
    return 'Yell'
}

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

const url = 'mongodb://localhost:27017/trainReservation';

mongoose.connect(url, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});


