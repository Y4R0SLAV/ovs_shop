const db = require('../db')

class CollectionController {
  async createCollection(req, res, next) {
    const { title, picture, header } = req.body
    const newCollection = await db.query('INSERT INTO collection (title, picture, header) VALUES ($1, $2, $3) RETURNING *', [title, picture, header])

    res.json({ "collectionId": newCollection.rows[0].collection_id })
  }

  async getCollections(req, res) {
    const collections = await db.query(`SELECT collection_id as id, title, picture, header, 'collection/' || collection_id as url FROM collection`)

    res.json(collections.rows)
  }

  async getOneCollection(req, res) {
    const id = req.params.id
    const collection = await db.query('SELECT * FROM collection WHERE collection_id = $1', [id])

    res.json(collection.rows[0])
  }

  async updateCollection(req, res) {
    const { id, title, picture, header } = req.body
    const collection = await db.query(
      'UPDATE collection set title = $1, picture = $2, header = $3 where collection_id = $4 RETURNING *',
      [title, picture, header, id])

    res.json(collection.rows[0])
  }

  async deleteCollection(req, res) {
    const id = req.params.id
    const collection = await db.query('DELETE FROM collection WHERE collection_id = $1', [id])

    res.json(collection.rows[0])
  }
}

module.exports = new CollectionController()