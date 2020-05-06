const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    db.query('SELECT is_admin FROM users WHERE id = $1', [req.params.id]).then(function (data) {
      req.session.is_admin = data.rows[0].is_admin;
      res.redirect('/');
    });

  });

  router.get('/logout', (req,res) => {
    req.session.user_id = undefined;
    req.session.is_admin = undefined;
    res.redirect('/');
  });
  return router;
};
