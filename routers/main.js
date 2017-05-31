/**
 * Created by mahong on 17/5/24.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    //console.log("html")
    //console.log(req.userInfo)
    res.render('main/index',{
        userInfo: req.userInfo
    });
});

module.exports =  router;