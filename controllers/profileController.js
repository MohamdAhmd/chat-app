const userModel = require('../models/userModel')
exports.redirect = (req,res,next)=>{
    const user = res.locals.user
    res.redirect('profile/' + user.id)
}


exports.getProfile = (req,res,next)=>{
    const user = res.locals.user
    const Id = user.id
    userModel.profile(req.params.id).then((data) => {
        res.render('profile',{
            pageTitle:data.username,
            isAuth:req.cookies.jwt,
            myId:user.id,
            myName:user.username,
            myImage:user.image,
            friendId: data._id, 
            username:data.username,
            userImage:data.image,
            isOwner: req.params.id === user.id,
            isFriend:data.friends.find(friend => friend.id === user.id),
            addFriend:data.friendRequests.find(friend => friend.id === user.id),
            friendRequest:data.sentRequests.find(friend => friend.id === user.id),
        })
    }).catch((err) => {
        console.log(err);
    });
    
}

