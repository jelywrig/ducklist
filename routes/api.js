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

  router.get("/listings", (req, res) => {
    db.query("SELECT * FROM items ORDER BY posted_at DESC;")
      .then(data => {
        const listings = data.rows;
        res.json({ listings })
      })
  })

  // TODO: Refine query
  router.get("/messages/summaries", (req, res) => {
    db.query(`
      SELECT *
      FROM messages
      WHERE $1 IN (from_user, to_user);
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
