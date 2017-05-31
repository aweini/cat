/**
 * Created by mahong on 17/5/24.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一返回格式
var responseData;
router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    }

    next();
});

//注册
router.post('/user/register', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if(username==""){
        responseData.code = "1";
        responseData.message = "用户不能为空";
        res.json(responseData);
        return ;
    }


    //用户是否已经注册 数据库操作
    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = "4";
            responseData.message = "用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            //数据库每一条数据记录就是一个对象  通过操作model对象操作数据库
            var user = new User({
                username: username,
                password: password
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        //cookie里不能有汉字,汉字需要编码
        newUserInfo.username = encodeURI(newUserInfo.username);
        responseData.message = "用户注册成功";
        req.cookies.set("userInfo",JSON.stringify({
            _id : newUserInfo._doc._id,
            username : newUserInfo._doc.username
        }));
        res.json(responseData);
    })

});

//登陆

router.post('/user/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    if(username==""||password==""){
        responseData.code= "1";
        responseData.message = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code = "2";
            responseData.message = "用户名或密码错误"
            res.json(responseData);
            return;
        }

        responseData.code = "0";
        responseData.message = "用户登录成功";
        responseData.userInfo = {
            _id : userInfo._id,
            username : userInfo.username
        };
        //请求返回的时候,后端像浏览器发送cookie,浏览器保存cookie,每次请求的时候会把cookie自动放在http 头部信息里提交给后端
        //jsonp refer 域名 通过手动ajax 添加至头部再提交给后端
        userInfo.username = encodeURI(userInfo.username)
        req.cookies.set("userInfo", JSON.stringify({
            _id : userInfo._id,
            username : userInfo.username
        }));
        res.json(responseData);
    })

});

//退出
router.get('/user/logout', function(req, res){
    req.cookies.set("userInfo", null);
    res.json(responseData);

});





module.exports =  router;