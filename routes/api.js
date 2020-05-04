const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });





  // ?from_price=xxxx&to_price=xxxx&favourites=false&my_postings=true
  router.get("/listings", (req, res) => {
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


  router.post("/listings", (req, res) => {

    const queryParams = [req.session.user_id, req.body.title, req.body.description, req.body.image_url, req.body.price * 100];

    db.query("INSERT INTO items (owner_id, title, description, thumbnail_image_url, price_in_cents) VALUES ($1,$2,$3,$4,$5) RETURNING * ", queryParams)
    .then(data => {
      res.json(data.rows[0]);
    });

  });





  router.get("/messages/summaries", (req, res) => {
    db.query(`

      Select DISTINCT ON ((CASE WHEN from_user = $1 THEN to_user ELSE from_user END), re_item) i.title,
      messages.id, u1.first_name as from_user, u2.first_name as to_user, content, sent_at
      FROM messages
      JOIN users u1 on from_user = u1.id
      JOIN users u2 on to_user = u2.id
      JOIN items i on re_item = i.id
      WHERE u1.id = $1 OR u2.id = $1
      ORDER BY (CASE WHEN from_user = $1 THEN to_user ELSE from_user END), re_item, sent_at DESC;
    `, [req.session.user_id])
      .then(data => {
        const messages = data.rows;
        res.json({ messages });
      })
  })

  router.get("/messages/by_item_and_user/:item_id/:user_id", (req, res) => {
    db.query(`
      SELECT *
      FROM messages
      WHERE re_item = $1
        AND $2 IN (from_user, to_user)
        AND $3 IN (from_user, to_user)
      ORDER BY sent_at;
    `, [req.params.item_id, req.params.user_id, req.session.user_id])
      .then(data => {
        const messages = data.rows
        res.json({ messages })
      })
  })

  // body: {
  //   favourite: `Bool`
  //   unfavourite: `Bool`
  //   inactive: `Bool`
  //   sold: `Bool`
  // }
  router.post("/listings/:id", (req, res) => {
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
