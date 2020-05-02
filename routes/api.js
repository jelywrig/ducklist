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
  return router;
};
