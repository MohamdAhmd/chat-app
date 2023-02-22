const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const config = require('./config')
const cookieParser = require('cookie-parser')

const {isAuth,checkUser} = require('./middelware/authProtect')
const authRoute = require('./routes/authRouter')
const profileRoute = require('./routes/profileRouter')

const app = express()

// middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))


app.set('views', 'views')
app.set('view engine', 'ejs')
mongoose.connect(config.DB_URL).then(()=>{
    console.log('Database connected successfully...');
}).catch((err)=> console.log(err))

app.use('*',checkUser)
app.get('/',(req,res,_next)=>{ 
    res.render('index',{
        isAuth:req.cookies.jwt,
    })
})
app.get('/test',isAuth,(req,res,_next)=>{
    res.render('test',{
        isAuth:req.cookies.jwt
    })
})
app.use(authRoute)
app.use('/profile',profileRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
