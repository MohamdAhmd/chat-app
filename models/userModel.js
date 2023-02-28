const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const Chat = require('./chatMode').Chat 

const config = require('../config')
const DB_URL = config.DB_URL

mongoose.connect(config.DB_URL).then(()=>{
    console.log('Database connected successfully...');
}).catch((err)=> console.log(err))

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

//###############################################################################
//###############################################################################
/*
what i am trying to do here ?
iam trying to do two things ,
if I send a add request to my friend
1. add my data to friendRequests feild of my friend db
2. add friend data to sentRequests feild of my db
*/ 

exports.addFriend =async (data)=>{ // data means six hidden fields in profile.ejs page
    try {
        await User.updateOne({_id:data.friendId},
            {$push: {friendRequests: {name : data.myName, id: data.myId }}
        })
        await User.updateOne({_id:data.myId},
            {$push: {sentRequests: {name : data.friendName, id: data.friendId }}
        })
    } catch (error) {
        console.log(error);
    }
}
//###############################################################################
//###############################################################################
exports.cancelFriendRequest =async (data)=>{ // data means six hidden fields in profile.ejs page
    try {
            await User.updateOne(
                { _id: data.friendId },
                { $pull: { friendRequests: { id: data.myId } } }
            )
            await User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        sentRequests: { id: data.friendId }
                    }
                }
            )
        return;
    } catch (error) {
        throw new Error(error);
    }
}
//###############################################################################
//###############################################################################
/*
In This scenario I'm < user1 > My friend < user2 >
--------------------
The Logic in this function scenario of acceptance which contains two parts
1. First, pull my friend < user2 > data from my < user1 > friendRequests feild, 
    and also pull my data from sentRequests feild
2. Second, Is push my data < user1 > in friends feild to my friend< user2 >,
    and push data of my friend < user2 > to my friends feild in db
*/
exports.acceptFriend = async (data)=>{
try {
    let newChat = new Chat({
        users: [data.myId, data.friendId]
    });
    let chatDoc = await newChat.save();
    await User.updateOne({_id:data.friendId},
        {$pull: {sentRequests: { id: data.myId }}
    })
    await User.updateOne({_id:data.myId},
        {$pull: {friendRequests: { id: data.friendId }}
    })
    await User.updateOne({_id:data.friendId},
        {$push: {friends: { 
            name: data.myName,
            id: data.myId,
            image: data.myImage,
            chatId: chatDoc._id 
        }}
    })
    await User.updateOne({_id:data.myId},
        {$push: {friends: {
            name: data.friendName,
            id: data.friendId,
            image: data.friendImage,
            chatId: chatDoc._id
        }}
    })
} catch (err) {
    console.log(err);
}
}
//###############################################################################
//###############################################################################
exports.rejectlFriendRequest =async (data)=>{ // data means six hidden fields in profile.ejs page
    try {
            await User.updateOne(
                { _id: data.friendId },
                { $pull: { sentRequests: { id: data.myId } } }
            )
            await User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        friendRequests  : { id: data.friendId }
                    }
                }
            )
        return;
    } catch (error) {
        throw new Error(error);
    }
}
//###############################################################################
//###############################################################################
exports.DeleteFriend =async (data)=>{ // data means six hidden fields in profile.ejs page
    try {
            await User.updateOne(
                { _id: data.friendId },
                { $pull: { friends: { id: data.myId } } }
            )
            await User.updateOne(
                { _id: data.myId },
                {
                    $pull: {
                        friends: { id: data.friendId }
                    }
                }
            )
        return;
    } catch (error) {
        throw new Error(error);
    }
}