const Router = require('express')
const router = new Router()
const clothesController = require('../controller/clothes.controlles')

router.get('/', clothesController.getClothes)

module.exports = router