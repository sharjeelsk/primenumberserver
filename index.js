const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const date = require('date-and-time');
require('dotenv').config()
const app = express()
app.use(bodyParser.json())
app.use(cors())

//connecting to mongodb cluster
mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@primecluster.vpook.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
mongoose.set("useCreateIndex", true);

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("successfully connected to mongodb atlas database")
})


//creating prime schema which will hold an array of prime numbers and timestamp
const PrimeSchema = mongoose.Schema({
    primenumbers:[],
    timestamp:{type:String}
})

//creating a mongoose model from prime schema which will be used later on create prime objects
const prime = new mongoose.model("prime",PrimeSchema)


//route for computing prime numbers and getting response

/*
{
    "lowerbound":1,
    "upperbound":10
}

//--------send data in this format to /getprime route
*/

app.post("/getprime",(req,res)=>{
    let a, b, i, j, flag, array = [];

    if(req.body.upperbound && req.body.lowerbound){ //checking if upperbound and lowerbound is present
         // Ask user to enter lower value of interval
    a = req.body.lowerbound
 
    b = req.body.upperbound //"\nEnter upper bound of the interval: ";
    // Traverse each number in the interval
    // with the help of for loop
    for (i = a; i <= b; i++) {
        // Skip 0 and 1 as they are
        // niether prime nor composite
        if (i == 1 || i == 0){
            continue;
        }
 
        // flag variable to tell
        // if i is prime or not
        flag = 1;
 
        for (j = 2; j <= i / 2; ++j) {
            if (i % j == 0) {
                flag = 0;
                break;
            }
        }
 
        // flag = 1 means i is prime
        // and flag = 0 means i is not prime
        if (flag == 1)
            array.push(i)
    }
    console.log(array) //array of prime numbers

    //this is to create a format (hh:mm) of date
    let datenow = date.format(new Date(), 'hh:mm');
    //created an obj to be inserted via prime model
    const primes = new prime({
        primenumbers:array, //array is the data structure which is holding the prime values
        timestamp:datenow
    })
    primes.save()
    .then(res=>console.log(res))
    res.status(200).json(array) // sending that array of prime numbers in json format


    }else{
        res.status(400).send("please provide data in this format: {lowerbound:<number>,upperbound:<number>}") //incase if user hasn't provided the data in correct format then this response
    }  
})


app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("server started at 3000")
})