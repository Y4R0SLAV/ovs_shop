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
    let whereArray = []
    let sale = -1

    if (have_sale == "true") { sale = 0 }

    term = term ? '%' + term + '%' : ""

    let products
    // всё вроде работает но ещё один фильтр невозможно будет вставить
    // в конце запросов прибавляю sorted_by потому что беру его из енв
    // никакие дроп табле туда не могут попасть
    console.log(sale)
    if (sorted_by) {
      if (collection_id) {
        if (subtype_id) {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND fk_subtype_id = $2 AND title LIKE %$3% AND sale_price > $4 ORDER BY ' + sorted_by,
              [collection_id, subtype_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND fk_subtype_id = $2 AND sale_price > $3 ORDER BY ' + sorted_by,
              [collection_id, subtype_id, sale])
          }
        } else {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND title LIKE %$3% AND sale_price > $3 ORDER BY ' + sorted_by,
              [collection_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND sale_price > $2 ORDER BY ' + sorted_by,
              [collection_id, sale])
          }
        }
      } else {
        if (subtype_id) {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE AND fk_subtype_id = $1 AND title LIKE %$2% AND sale_price > $3 ORDER BY ' + sorted_by,
              [subtype_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_subtype_id = $1 AND sale_price > $2 ORDER BY ' + sorted_by,
              [subtype_id, sale])
          }
        } else {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE title LIKE %$1% AND sale_price > $2 ORDER BY ' + sorted_by,
              [term, sale])
          }
          else {
            products = await db.query(
              'SELECT product_id, price, title, fk_collection_id, fk_subtype_id, description, sale_price, sizing, xxs, xs, s, m, l, xl, xxl FROM product WHERE sale_price > $1 ORDER BY ' + sorted_by,
              [sale])
          }
        }
      }
    } else {
      if (collection_id) {
        if (subtype_id) {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND fk_subtype_id = $2 AND title LIKE %$3% AND sale_price > $4',
              [collection_id, subtype_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND fk_subtype_id = $2 AND sale_price > $3 ',
              [collection_id, subtype_id, sale])
          }
        } else {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND title LIKE %$3% AND sale_price > $3',
              [collection_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_collection_id = $1 AND sale_price > $2',
              [collection_id, sale])
          }
        }
      } else {
        if (subtype_id) {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE AND fk_subtype_id = $1 AND title LIKE %$2% AND sale_price > $3',
              [subtype_id, term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE fk_subtype_id = $1 AND sale_price > $2',
              [subtype_id, sale])
          }
        } else {
          if (term) {
            products = await db.query(
              'SELECT * FROM product WHERE title LIKE $1 AND sale_price > $2',
              [term, sale])
          }
          else {
            products = await db.query(
              'SELECT * FROM product WHERE sale_price > $1',
              [sale])
          }
        }
      }
    }

    res.json(products.rows)
  }

  async getOneProduct(req, res) {
    const id = req.params.id
    const product = await db.query('SELECT * FROM product WHERE product_id = $1', [id])

    res.json(product.rows[0])
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