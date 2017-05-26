var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});
//注册
router.get('/regi', function(req, res, next) {
    res.render('regi',{});
});
//登录
// router.get('/shouye', function(req, res, next) {
//     res.render('shouye',{});
// });

// router.get('/login', function(req, res, next) {
//     res.render('login',{});
// });
router.get('/shouye', function(req, res, next) {
    res.render('shouye',{user:req.session.user});
});


module.exports = router;
