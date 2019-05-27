import express from 'express';
var routes=require('./router/router');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use('/',routes);

app.listen(5000,()=>{
    console.log("server listening to port 5000");
})