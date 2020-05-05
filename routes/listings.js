const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // ?from_price=xxxx&to_price=xxxx&favourites=false&my_postings=true
  router.get("/", (req, res) => {
    const {from_price, to_price, favourites, my_listings} = req.query;
    const user_id = req.session.user_id;
    const queryParams = [];
    queryParams.push(user_id ? user_id : 0);
    let query = `SELECT *, $${queryParams.length}::INTEGER as user_id, EXISTS(SELECT TRUE From favourite_items WHERE user_id=$${queryParams.length} AND item_id= items.id) as favourite FROM items`
    let whereClause = ' WHERE deactivated_at IS NULL';
    if(favourites === 'true') {
      queryParams.push(user_id);
      query += ` JOIN favourite_items on items.id = item_id`;
      whereClause += ` AND user_id = $${queryParams.length}`;
    }
    if(Number(from_price)){
      queryParams.push(from_price);
      whereClause += ` AND price_in_cents >= $${queryParams.length}`;
    }
    if(Number(to_price)){
      queryParams.push(to_price);
      whereClause += ` AND price_in_cents <= $${queryParams.length}`;
    }
    if(my_listings === 'true') {
      queryParams.push(user_id ? user_id : 0);
      whereClause += ` AND owner_id = $${queryParams.length}`;
    }
    query += whereClause;
    query += " ORDER BY posted_at DESC;"

    db.query(query, queryParams)
      .then(data => {
        const listings = data.rows;
        res.json({ listings })
      })
  })

  router.post("/", (req, res) => {
    const queryParams = [req.session.user_id, req.body.title, req.body.description, req.body.image_url, Math.round(req.body.price * 100)];
    db.query("INSERT INTO items (owner_id, title, description, thumbnail_image_url, price_in_cents) VALUES ($1,$2,$3,$4,$5) RETURNING * ", queryParams)
    .then(data => {
      res.json(data.rows[0]);
    });
  });

  // body: {
  //   favourite: `Bool`
  //   unfavourite: `Bool`
  //   inactive: `Bool`
  //   sold: `Bool`
  // }
  router.post("/:id", (req, res) => {
    const itemId = req.params.id
    const userId = req.session.user_id;
    const { unfavourite, favourite, sold, inactive } = req.body;
    if (userId) {
      if (favourite === 'true') {
        db.query(`
          INSERT INTO favourite_items (user_id, item_id)
          VALUES ($1, $2)
        `, [userId, itemId])
          .then(data => res.json({ success: true }))
      } else if (unfavourite === 'true') {
        db.query(`
          DELETE FROM favourite_items
          WHERE user_id = $1
            AND item_id = $2
        `, [userId, itemId])
          .then(data => res.json({ success: true }))
      }

      if (sold === 'true') {
        db.query(`
          UPDATE items
          SET sold_at = NOW()
          WHERE id = $1
        `, [itemId])
          .then(data => res.json({ success: true }))
      }

      if (inactive === 'true') {
        db.query(`
          UPDATE items
          SET deactivated_at = NOW()
          WHERE id = $1
        `, [itemId])
          .then(data => res.json({ success: true }))
      }
    }
  })

  return router;
};
