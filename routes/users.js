const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');


module.exports = (db) => {

  router.post('/login', (req, res) => {
    const email = req.body.email;
    console.log(req.body);
    console.log(email);
    db.query(`SELECT id, is_admin, password FROM users WHERE email = $1`, [email])
      .then( data => {
        console.log(data.rows[0]);
        if (!data.rows[0]) {
          res.status(403).json({message: 'No account associated with this email'});
        } else if(!bcrypt.compareSync(req.body.password, data.rows[0].password)) {

          res.status(403).json({message: 'Incorrect Password'});
        } else {
          console.log('success');
          req.session.user_id = data.rows[0].id;
          req.session.is_admin = data.rows[0].is_admin;
          res.send({success: 'true'});
        }

      })
  });
//todo check if email already registered first
  router.post('/register', (req, res) => {
    const queryParams = [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, bcrypt.hashSync(req.body.password,10), req.body.is_admin];

    db.query(`INSERT INTO users (first_name, last_name, email, phone, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, queryParams)
      .then(data => {
        req.session.user_id = data.rows[0].id;
        req.session.is_admin = data.rows[0].is_admin;
        res.redirect('/');

      })

  })

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


