const router = require('express').Router()
const profileController = require('../controllers/profileController')
const authProtect = require('../middelware/authProtect')

router.get('/',authProtect.isAuth, profileController.redirect)
router.get('/:id', authProtect.isAuth, profileController.getProfile) 


module.exports = router