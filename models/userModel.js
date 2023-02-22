const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const config = require('../config')
const DB_URL = config.DB_URL

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required: [true,'Pleasw Enter The user name'],
        lowercase:true
    },
    email: { 
        type:String,
        required: [true,'Email feild is required'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please Enter a valid Email']
    },
    password:{
        type:String,
        required: [true,'Please Enter The Password'],
        minlength:[6,'Minimum Password Length Is 6 characters']
    },
    image: { type: String, default: "default-user-image.png" },
    friends: {
        type: [{ name: String, image: String, id: String, chatId: String }],
        default: []
    },
    friendRequests: {
        type: [{ name: String, id: String }],
        default: []
    },
    sentRequests: {
        type: [{ name: String, id: String }],
        default: []
    }
});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})



const User = mongoose.model("user", userSchema);
exports.User = User


exports.profile = async (id)=>{
    try {
        const user = await User.findById(id)
        return user
    } catch (err) {
        console.log(err);
    }
}