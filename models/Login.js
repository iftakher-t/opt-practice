const LoginSchema = new mongoose.Schema({
    email: String,
    password:String,
    verified: Boolean,
    otp:Number
});

const Model = mongoose.model("Users", LoginSchema);