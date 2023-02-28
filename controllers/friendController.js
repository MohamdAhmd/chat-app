const userModel = require('../models/userModel')

exports.add = (req,res,next)=>{ 
    userModel.addFriend(req.body).then(()=>{
        res.redirect('/profile/' + req.body.friendId)
    }).catch((err)=>{
        console.log(err);
    })
}
exports.cancel = (req,res,next)=>{
    userModel.cancelFriendRequest(req.body).then(()=>{
        res.redirect('/profile/' + req.body.friendId)
    }).catch((err)=>{
        console.log(err);
    })
}
exports.accept = (req,res,next)=>{
    userModel.acceptFriend(req.body).then(()=>{
        res.redirect('/profile/' + req.body.friendId)
    }).catch((err)=>{
        console.log(err);
    })
}
exports.reject = (req,res,next)=>{
    userModel.rejectlFriendRequest(req.body).then(()=>{
        res.redirect('/profile/' + req.body.friendId)
    }).catch((err)=>{
        console.log(err);
    })

}
exports.delete = (req,res,next)=>{
    userModel.DeleteFriend(req.body).then(()=>{
        res.redirect('/profile/' + req.body.friendId)
    }).catch((err)=>{
        console.log(err);
    })

}
