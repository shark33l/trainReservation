import mongoose, {Schema} from "mongoose";

//Schema for Tracks
var train = new Schema({
    trackNo: Number,
    destinations:
        [{ place: String,
            distance: Number }],
    trains:
        [{ name: String,
            direction: Number,
            totalSeats: Number}]
    },
    { collection : 'train' });

mongoose.model('train', train);

//Schema for Reservation Records
var reservationRecords = new Schema({
        date: String,
        trackNo: Number,
        time: String,
        direction: Number,
        noTickets: Number,
    });

mongoose.model('reservationRecords', reservationRecords);

//Schema for reservations
var reservationSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    date: {
      type : String,
      require : true
    },
    email: {
        type : String,
        required : true
    },
    nic : {
        type : String,
        required : true
    },
    tripFrom : {
      type : String,
        required : true
    },
    tripTo : {
        type : String,
        required : true
    },
    noSeats : {
        type: Number,
        required: true
    },
    total : {
        type : Number,
        required : true
    }
    },
    { collection : 'reservations' });

mongoose.model('reservations', reservationSchema);

//Schema for Credit card
var creditCardSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    cardNumber : {
        type : String,
        required : true
    },
    cvc : {
        type: String,
        required: true
    },
    expDate : {
        type : String,
        required : true
    }
    },
    { collection : 'creditCard' });

mongoose.model('creditCard', creditCardSchema);

//Schema for Dialog Pay
var dialogPaySchema = new Schema ({
    name: {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number,
        required : true
    },
    pin : {
        type: Number,
        required: true
    },
    },
    { collection : 'dialog' });

mongoose.model('dialogPay', dialogPaySchema);

var governmentNicSchema = new Schema ({
    nic: String,
})

mongoose.model('govNic', governmentNicSchema)

//Connecting to the trainReservation Database
mongoose.connect('mongodb://localhost:27017/trainReservation',{ useNewUrlParser: true });
    console.log("Database connection Successfull");

module.exports = mongoose;