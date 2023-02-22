const router = require('express').Router()
const authController = require('../controllers/authController')
const authProtect = require('../middelware/authProtect')

router.get('/login',authProtect.isNotAuth,authController.get_login)
router.post('/login',authProtect.isNotAuth,authController.post_login)
router.get('/signup',authProtect.isNotAuth,authController.get_signup)
router.post('/signup',authProtect.isNotAuth,authController.post_signup)
router.all('/logout',authProtect.isAuth ,authController.logout)

module.exports = router