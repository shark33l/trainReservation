var express=require('express');
var routes=express.Router();

var trainRouter = require ('./trainRouter');
var reservationRecordsRouter = require('./reservationRecordsRouter');
var govNicRouter = require('./govNicRouter');
var reservationRouter = require('./reservationRouter');
var creditCardRouter = require('./creditCardRouter');
var dialogPayRouter = require('./dialogPayRouter');

routes.use('/tracks', trainRouter);
routes.use('/resRecords', reservationRecordsRouter);
routes.use('/nic', govNicRouter);
routes.use('/addTicket', reservationRouter);
routes.use('/creditcard', creditCardRouter);
routes.use('/dialogpay', dialogPayRouter);

module.exports = routes;