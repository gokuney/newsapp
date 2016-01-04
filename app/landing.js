var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('NewsApp, View APIs <a href="/api">Here</a>')
});

module.exports = router;
