const bcrypt = require('bcrypt')
const userModel = require('./userModel')
module.exports.login = async (email,password)=>{
    const user = await userModel.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error('Incorrect Password')
    }
    throw Error('Incorrect Email')
}

