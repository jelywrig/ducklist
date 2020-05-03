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


  // ?from_price=xxxx&to_price=xxxx&favourites=false
  router.get("/listings", (req, res) => {
    const {from_price, to_price, favourites } = req.query;
    const user_id = req.session.user_id;
    const queryParams = [];
    queryParams.push(user_id ? user_id : 0);
    let query = `SELECT *, EXISTS(SELECT TRUE From favourite_items WHERE user_id=$${queryParams.length} AND item_id= items.id) as favourite FROM items`
    if(favourites === 'true') {
      queryParams.push(user_id);
      query += ` JOIN favourite_items on items.id = item_id WHERE user_id = $${queryParams.length}`
      if(Number(from_price)){
        queryParams.push(from_price);
        query += ` AND price_in_cents >= $${queryParams.length}`;
      }
      if(Number(to_price)){
        queryParams.push(to_price);
        query += ` AND price_in_cents <= $${queryParams.length}`;
      }
    } else if (Number(from_price) || Number(to_price)) {
      query += " WHERE "
      if(Number(from_price)){
        queryParams.push(from_price);
        query += `price_in_cents >= $${queryParams.length}`;
        if(Number(to_price)){
          queryParams.push(to_price);
          query += ` AND price_in_cents <= $${queryParams.length}`;
        }
      } else {
        queryParams.push(to_price);
        query += ` price_in_cents <= $${queryParams.length}`;
      }
    }

    query += " ORDER BY posted_at DESC;"

    db.query(query, queryParams)
      .then(data => {
        const listings = data.rows;
        res.json({ listings })
      })
  })

  // TODO: Refine query


  router.get("/messages/summaries", (req, res) => {
    db.query(`
    Select i.title, messages.id, u1.first_name as from_user, u2.first_name as to_user, content, sent_at
    FROM messages
    JOIN users u1 on from_user = u1.id
    JOIN users u2 on to_user = u2.id
    JOIN items i on re_item = i.id
    WHERE u1.id = $1 OR u2.id = $1
    ORDER BY sent_at DESC;
    `, [req.session.user_id])
      .then(data => {
        const messages = data.rows;
        res.json({ messages })
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
    const userId = req.session.user_id;
    const { unfavourite, favourite } = req.body;
    if (userId) {
      if (favourite === 'true') {
        db.query(`
          INSERT INTO favourite_items (user_id, item_id)
          VALUES ($1, $2)
        `, [userId, req.params.id])
          .then(data => res.json({ success: true }))
      } else if (unfavourite === 'true') {
        db.query(`
          DELETE FROM favourite_items
          WHERE user_id = $1
            AND item_id = $2
        `, [userId, req.params.id])
          .then(data => res.json({ success: true }))
      }
    }
  })

  return router;
};
