const Router = require('express')
const router = new Router()
const accessoriesController = require('../controller/accessories.controller')

router.get('/', accessoriesController.getAccesories)

module.exports = router