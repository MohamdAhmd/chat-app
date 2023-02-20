const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const User = require('../models/userModel')
const authModel = require('../models/authModel')

exports.isAuth = async (req,res,next)=>{ 
    const token = req.cookies.jwt
    // check if json web token exist 
    if(token){
        //if exist so verify token
        JWT.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login')
            }else{
                console.log(decodedToken);
                next()
            }
        })
    }else{
        res.redirect('/login')
    } 
}
//#############################################################################
//#############################################################################
exports.isNotAuth = (req,res,next)=>{ 
    const token = req.cookies.jwt
    // check if json web token exist 
    if(token){
        //if exist so verify token
        JWT.verify(token,JWT_SECRET,(err,decodedToken)=>{
            if(err){
                next()
            }else{
                res.redirect('/')
            }
        })
    }else{
        next()
    } 
}



exports.checkUser = (req,res,next)=>{ 
    const token = req.cookies.jwt
    // check if json web token exist 
    if(token){
        //if exist so verify token
        JWT.verify(token,JWT_SECRET,async (err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null
                next()
            }else{
                const user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    } 
}