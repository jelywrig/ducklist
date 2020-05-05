const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/summaries", (req, res) => {
    db.query(`
      Select DISTINCT ON ((CASE WHEN from_user = $1 THEN to_user ELSE from_user END), re_item) i.title,
      messages.id, u1.first_name as from_user, u1.id as from_user_id, u2.first_name as to_user, content, sent_at, re_item, (CASE WHEN from_user = $1 THEN to_user ELSE from_user END) as other_user, $1::INTEGER as user_id
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

  router.get("/by_item_and_user/:item_id/:user_id", (req, res) => {
    db.query(`
      SELECT u1.first_name as from_user, u1.id as from_user_id, u2.first_name as to_user, u2.id as to_user_id, content, items.id as item_id,
      sent_at, items.title as item_title, (CASE WHEN from_user = $3 THEN to_user ELSE from_user END) as other_user_id, $3::integer as user_id
      FROM messages
      JOIN users u1 on from_user = u1.id
      JOIN users u2 on to_user = u2.id
      JOIN items ON re_item = items.id
      WHERE re_item = $1
        AND $2 IN (from_user, to_user)
        AND $3 IN (from_user, to_user)
      ORDER BY sent_at;
    `, [req.params.item_id, req.params.user_id, req.session.user_id])
      .then(data => {
        const messages = data.rows
        res.json({ messages })
      })
      .catch(error => console.log(error));
  })

  router.post("/", (req, res) => {

    const {to_user, item_id, content} = req.body;
    const queryParams = [req.session.user_id, to_user, content, item_id];
    db.query(`INSERT INTO messages (from_user, to_user, content, re_item) VALUES ($1, $2, $3, $4)`, queryParams)
    .then(res.json({success: true}));

  })

  return router;
};
