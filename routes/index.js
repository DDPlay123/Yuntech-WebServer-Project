var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.getConnection(function(error, conn) {
    conn.query('SELECT * FROM detail ORDER BY id DESC', function(err, rows, fields) {
      if (err) {
        req.flash('error', err)
          res.render('index', {
            title: '',
            data: ''
          })
      } else {
        // render to views/index.ejs 
        res.render('index', {
          title: '',
          data: rows
        })
      }
    })
  })
});

module.exports = router;
