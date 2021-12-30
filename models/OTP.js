const mongoose = require('mongoose');


let otpCodeSchema = new mongoose.Schema({
    email: {
      type: String,
      default: 'email'
    },
    otpCode: {
        type: String,
        default: '0'
    },
    OTPTimeStamp:{
        type: Date,
        default: new Date()
    }
}, {timeStamps: true});


let otpCodeModel = mongoose.model('OTP', otpCodeSchema);

module.exports = otpCodeModel;