app.post('/verify', function(req, res, next) {
    mongoose.connect('mongodb://localhost:27017/cuts');
    var db = mongoose.connection;
    var PwdSchema = mongoose.Schema({
      phone: {
        type: Number,
        required: true
      },
      otp: {
        type: String,
        required: true,
  
      }
  
    });
  
    User = mongoose.model('usersotp', PwdSchema);
    const inputPhone = typeof req.body.phone === "string" ? parseInt(req.body.phone) : req.body.phone;
    User.findOne({ phone: inputPhone }, function (err, user) {
      console.log(user);
      if (err) {
        console.log(err);
      } else {
  
        if (user) {
          console.log(user);
        } else {
          console.log("no data found");
        }
      }
  
    });
    res.send("Any text");
  }); 



  //Validate the otp
if (validTrainer.otp === req.body.otp ) {
    console.log(`send otp: ${req.body.otp}`);
    console.log(`original otp:${validTrainer.otp}`);
    await TrainerAuth.findOneAndUpdate({ trainerID: req.body.trainerID }, { isVerified: true }, { new: true }, (err, newAuth) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newAuth);
            res.send({
                statusCode: 200,
                message: `Phone number is verified.`
            })
        }
    })
  } else {
    res.send({
                statusCode: 401,
                message: `Wrong OTP. Try again.`
            })
  }

  