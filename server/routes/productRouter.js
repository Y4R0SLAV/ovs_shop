const Router = require('express')
const router = new Router()
const ProductController = require('../controller/product.controller')

router.post('/', ProductController.createProduct)
router.get('/', ProductController.getProducts)
router.get('/:id', ProductController.getOneProduct)
router.get('/:collection_id/:subtype_id', ProductController.getRecommendedProducts)
router.put('/', ProductController.updateProduct)
router.delete('/:id', ProductController.deleteProduct)

module.exports = router