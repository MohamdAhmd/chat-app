const dotenv = require('dotenv')
dotenv.config()

const { 
    DB_URL,
    JWT_SECRET
} = process.env

module.exports = {
    DB_URL: DB_URL,
    JWT_SECRET:JWT_SECRET
}
