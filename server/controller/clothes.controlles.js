const db = require('../db')

class ClothesController {
  async getClothes(req, res) {
    const clothes = await db.query(`SELECT subtype_id as id, title, picture, '/clothes/' || subtype_id as url FROM subtype WHERE fk_type_id = (SELECT type_id FROM type WHERE title = 'Одежда')`)

    res.json(clothes.rows)
  }
}

module.exports = new ClothesController()