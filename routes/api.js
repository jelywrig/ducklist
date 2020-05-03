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
      SELECT m1.*
      FROM messages AS m1
      LEFT OUTER JOIN messages AS m2
      ON m1.id = m2.id                                                                <----- here needs help
          AND((m1.sent_at < m2.sent_at
            OR (m1.sent_at = m2.sent_at AND m1.id< m2.id)))
      WHERE $1 IN (m1.from_user, m1.to_user);
    `, [5])
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
      ORDER BY sent_at;
    `, [req.params.item_id, req.params.user_id])
      .then(data => {
        const messages = data.rows
        res.json({ messages })
      })
  })

  return router;
};
