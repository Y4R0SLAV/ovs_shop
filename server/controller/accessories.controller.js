const db = require('../db')

class AccesoriesController {
  async getAccesories(req, res) {
    const accessories = await db.query(`SELECT subtype_id as id, title, picture FROM subtype 
    WHERE fk_type_id = (SELECT type_id FROM type WHERE title = 'Аксессуары')`)

    res.json(accessories.rows)
  }
}

module.exports = new AccesoriesController()