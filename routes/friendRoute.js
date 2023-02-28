const router = require('express').Router()
const bodyParser = require('body-parser').urlencoded({extended : true})
const friendController = require('../controllers/friendController')
const authProtect = require('../middelware/authProtect')

router.post('/add',authProtect.isAuth, bodyParser ,friendController.add)
router.post('/cancel', authProtect.isAuth, bodyParser ,friendController.cancel) 
router.post('/accept', authProtect.isAuth, bodyParser ,friendController.accept) 
router.post('/reject', authProtect.isAuth, bodyParser ,friendController.reject) 
router.post('/delete', authProtect.isAuth, bodyParser ,friendController.delete) 


module.exports = router
