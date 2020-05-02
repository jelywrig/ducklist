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
    db.query("SELECT * FROM items")
      .then(data => {
        const listings = data.rows;
        res.json({ listings })
      })
  })

  router.get("/messages/summaries", (req, res) => {
    db.query(`
      SELECT * FROM messages
      WHERE $1 IN (from_user, to_user)
    `, [5])
      .then(data => {
        const messages = data.rows;
        res.json({ messages })
      })
  })

  return router;
};
