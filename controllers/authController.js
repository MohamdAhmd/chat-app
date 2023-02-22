const userModel = require('../models/userModel').User
const authModel = require('../models/authModel')
const JWT = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const handelError = (err)=>{
    
    console.log(err.message,err.code);
    let errors = {username:'', email:'',password:''}
    // if wrong email fro login
    if(err.message === 'Incorrect Email'){
        errors.email = 'Incorrect Email'
    }
    // if wrong password for login
    if(err.message === 'Incorrect Password'){
        errors.password = 'Incorrect Password'
    }
    // duplicate email error
    if(err.code === 11000){
        errors.email = 'This Email Is Already Registered ' 
    }
    
    // validation errors
    if(err.message.includes('user validation failed')){
    Object.values(err.errors).forEach(({properties} )=>{
        errors[properties.path] = properties.message
    })
}
    return errors
}
//########################################################################################
const maxAge = 1 * 24 * 24 * 60 
const createToken = (id)=>{ // here i create a token which contains paylod, secret, and signture
    return JWT.sign({id},JWT_SECRET,{
        expiresIn: maxAge
        // this jwt will expire in one day
    })
}


exports.get_signup = (req,res,next) => {
    res.render('signup',{
        isAuth:req.cookies.jwt
    })
}
exports.post_signup = async (req,res,next)=>{
    try {
        const {username,email,password} = req.body
        const user = await userModel.create({username,email,password})
        // here i created token for every one user signup
        const token = createToken(user._id) 
        // here i send cookie for frontend
        res.cookie('jwt',token,{ httpOnly:true, maxAge:maxAge * 1000}) 
        res.status(201).json({user:user._id})
    } catch (err) {
        const errors = handelError(err)
        res.status(404).json({errors})
    }
}
exports.get_login = (req,res,next)=>{
    res.render('login',{       
    isAuth:req.cookies.jwt
    })
}
exports.post_login = async (req,res,next)=>{
    const {email , password} = req.body
    try {
        const user = await authModel.login(email,password)
        // here i created token for every one user signup
        const token = createToken(user._id) 
        // here i send cookie for frontend
        res.cookie('jwt',token,{ httpOnly:true, maxAge:maxAge * 1000}) 
        res.status(201).json({user:user._id})
    } catch (err) {
        const errors = handelError(err)
        res.status(404).json({errors})
    }
}


exports.logout = (req,res,next)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
}