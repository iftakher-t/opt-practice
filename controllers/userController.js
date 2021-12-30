app.post("/verify/:id", async(req, res) => {

    var User = await Model.findOne({ _id: req.params.id, otp:req.body.otp });
    
    Model.findOneAndUpdate({ otp: User.otp }, {$unset: {otp: 1 }},(err, res) => {
        if (err) console.log(err)
        else console.log("succesful");
    })
})



router.post('/forgot-password', CatchAsync(async(req, res) =>{
    mobile = req.body.mobile;
    const foundUser= await User.findOne({mobileno: mobile});
    console.log(foundUser);
    if(!foundUser){
        req.flash('error', 'No records found');
        res.redirect('/register');
    }else{
        random = randomString.generate();
        const secret= process.env.JWT_SECRET + random;
        const payload = {
            mobileNo: foundUser.mobileno,
            id: foundUser._id
        }
        const token = jwt.sign(payload, secret, {expiresIn: '15m'})
        const link = '/reset-password/'+foundUser._id+'/'+token;
        randomOtp= Math.floor(Math.random()*100000);
        var options = {authorization : process.env.API_KEY , message : "Dear" + foundUser.firstname + "," + "Your password reset otp is:" + randomOtp,  numbers : [foundUser.mobileno]} 
        await fast2sms.sendMessage(options).then(() =>{
        console.log("Message Sent Successfully");
        })
        res.redirect(link);
    }
});



router.get('/forgot-password', CatchAsync(async(req, res) =>{
    res.render('forgot-password');

    router.get('/reset-password/:id/:token', CatchAsync(async(req, res) =>{
        res.render('otp-verification');


        router.post('/reset-password/:id/:token', CatchAsync(async(req, res) =>{
            let otp = req.body.otp;
            otp = Number(otp);
            if(otp !== randomOtp){
                res.send('you have entered wrong OTP');
            }else{
                const foundUser= await User.findOne({mobileno: mobile});
                const secret= process.env.JWT_SECRET + random;
                const payload = {
                    mobileNo: foundUser.mobileno,
                    id: foundUser._id
                }
                const token = jwt.sign(payload, secret, {expiresIn: '15m'})
                const link = '/reset-password/'+foundUser._id+'/'+token;
                res.redirect(link+'/change-password');
            }

            router.get('/reset-password/:id/:token/change-password', CatchAsync(async(req, res) =>{
                res.render('change-password')

                router.post('/reset-password/:id/:token/change-password', CatchAsync(async(req, res) =>{
                    const foundUser= await User.findOne({mobileno: mobile});
                    foundUser.setPassword(req.body.newPassword);
                    await foundUser.save();
                    res.redirect('/login');