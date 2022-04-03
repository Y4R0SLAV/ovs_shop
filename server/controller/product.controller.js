const sortedByString = require("../utilits/sqlSortedBy")
const db = require('../db')

class ProductController {
  async createProduct(req, res, next) {
    const { title, price, collection_id, subtype_id, description, sale_price, sizing, XXS, XS, S, M, L, XL, XXL } = req.body

    let newProduct

    if (sizing) {
      newProduct = await db.query(
        'INSERT INTO product (title, price, fk_collection_id, fk_subtype_id, description, sale_price, sizing, XXS, XS, S, M, L, XL, XXL) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
        [title, price, collection_id, subtype_id, description, sale_price, sizing, XXS, XS, S, M, L, XL, XXL])
    } else {
      newProduct = await db.query(
        'INSERT INTO product (title, price, fk_collection_id, fk_subtype_id, description, sale_price, sizing) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, price, collection_id, subtype_id, description, sale_price, sizing])
    }

    res.json(newProduct.rows[0])
  }

  async getProducts(req, res) {
    let { subtype_id, collection_id, have_sale, term, sorted } = req.query

    let sorted_by = sortedByString(sorted)
    let sale = -1
    let needAnd = false

    if (have_sale == "true") { sale = 0 }
    term = term ? '%' + term + '%' : ""

    let query = `SELECT product_id as id, title, price, sale_price as sale, 
    (SELECT url FROM photo WHERE fk_product_id = product_id AND is_front = true) as front, 
    (SELECT url FROM photo WHERE fk_product_id = product_id AND is_back = true) as back
    FROM product LEFT JOIN photo ON product.product_id = photo.fk_product_id WHERE`

    if (subtype_id > 0) {
      query += ' fk_subtype_id = ' + subtype_id
      needAnd = true
    }

    if (collection_id > 0) {
      if (needAnd) {
        query += ' AND fk_collection_id = ' + collection_id
      }
      else {
        query += ' fk_collection_id = ' + collection_id
        needAnd = true
      }
    }

    // на терме валидация, тут могут быть только буквы без {}%$ и тд
    if (term !== "") {
      if (needAnd) {
        query += ' AND title LIKE ' + '%' + term + '%'
      } else {
        query += ' title LIKE ' + '%' + term + '%'
        needAnd = true
      }
    }

    needAnd ? query += ' AND sale_price > ' + sale : query += ' sale_price > ' + sale
    sorted_by ? query += ' ORDER BY ' + sorted_by : query += ''
    query += ' GROUP BY id'

    const products = await db.query(query)
    res.json(products.rows)
  }

  async getOneProduct(req, res) {
    const id = req.params.id
    const product = await db.query(`
    SELECT product_id as id, price, title, fk_collection_id as collection_id,
      fk_subtype_id as subtype_id, description, sale_price, sizing, xxs, xs, s, m, l, xl, xxl,
      (SELECT url FROM photo WHERE fk_product_id = product_id AND is_front = true) as front, 
      (SELECT url FROM photo WHERE fk_product_id = product_id AND is_back = true) as back
  
    FROM product JOIN photo ON product.product_id = photo.fk_product_id
    WHERE product_id = $1;`, [id]).then(res => res.rows[0])

    const photos = await db.query(`SELECT url FROM photo WHERE fk_product_id = $1 
    AND is_front = false AND is_back = false;`, [id])
    let newPhotos = []

    for (let i = 0; i < photos.rows.length; i++) {
      newPhotos.push(photos.rows[i].url)
    }

    res.json({ ...product, photos: [...newPhotos] })

  }

  async updateProduct(req, res) {
    const { id, title, price, collection_id, subtype_id, description, sale_price, sizing, XXS, XS, S, M, L, XL, XXL } = req.body
    let newProduct

    if (sizing) {
      newProduct = await db.query(
        'UPDATE product set title = $1, price = $2, fk_collection_id = $3, fk_subtype_id = $4, description = $5, sale_price = $6, sizing = $7, XXS = $8, XS = $9, S = $10, M = $11, L = $12, XL = $13, XXL = $14 WHERE product_id = $15 RETURNING *',
        [title, price, collection_id, subtype_id, description, sale_price, sizing, XXS, XS, S, M, L, XL, XXL, id])
    } else {
      newProduct = await db.query(
        'UPDATE product set title = $1, price = $2, fk_collection_id = $3, fk_subtype_id = $4, description = $5, sale_price = $6, sizing = $7 WHERE product_id = $8 RETURNING *',
        [title, price, collection_id, subtype_id, description, sale_price, sizing, id])
    }

    res.json(newProduct.rows[0])
  }

  async deleteProduct(req, res) {
    const id = req.params.id
    const product = await db.query('DELETE FROM product WHERE product_id = $1', [id])

    res.json(product.rows[0])
  }
}

module.exports = new ProductController()