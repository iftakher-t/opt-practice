const mongoose = require("mongoose");
const client = require("twilio")(process.env.ACCOUNTSID, process.env.AUTHTOKEN);
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {

    console.log(req.body);

    const user = new User(req.body);

    //mongoose connection
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    //var db = mongoose.connection();
    const db = mongoose.connection;

    db.on("connected", () => {
        console.log("we are now connected to mongodb compass");
    });

    db.on("disconnected", () => {
        console.log("we are dis-connected to mongodb compass");
    });

    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function () {
        // we're connected!

        user.save((error, data) => {
            console.log("Analyzing Data....");
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_IN
            })
            if (error) {
                return res.status(400).json({ error });
            }
            res.status(201).send({
                status: "success",
                token: token,
                data
            });

            console.log("Data added sucessfully");
            client
                .verify
                .services(process.env.SERVICEID)
                .verifications
                .create({
                    to: `+91${req.body.number}`,
                    channel: 'sms'
                })
                .then((data) => {
                    res.status(200).json({ data });
                });
        })

    })
}

exports.otp = (req, res) => {
    client
        .verify
        .services(process.env.SERVICEID)
        .verificationChecks
        .create({
            to: `+91${req.query.number}`,
            code: req.query.code
        })
        .then((data) => {
            if (data) {
                res.send(200).json(data)
            }
        })
        .catch((err) => {
            res.status(400).send(err);

        })
}