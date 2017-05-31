/**
 * Created by mahong on 17/5/24.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');

router.use(function(req, res, next){
    if(!req.userInfo.isAdmin){
        res.send("对不起,您不是管理员,无法访问管理系统");
        return;
    }
    next();
});

//首页
router.get('/', function(req, res, next){
    //res.send('后台管理首页');
    //res.render(file,option)是express中专门渲染视图用的，
    // 首先你要在你的app.js或者index.js中设置一下渲染引擎，比如html,jade,handlebars等。
    // 然后将视图模板的文件位置放入file,将传入的模板数据放入option对象中，模板引擎就能自己渲染出视图
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

//用户管理
router.get('/user', function(req, res, next){
    var page = Number(req.query.page ||1);//页数
    var limit = 10;//每页条数
    var pages = 0; //总页数
    var skip = 0;//从第几条开始读数据
    //获取总条数 分页
    User.count().then(function(count){
        pages = Math.ceil(count/limit);
        page = Math.min( pages, page);
        page = Math.max(page, 1);
        skip = (page -1 )*limit;
        //从数据库中读取用户数据
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user', {
                userInfo: req.userInfo,
                users: users,
                page: page,
                count: count,
                limit: limit,
                pages: pages
            })
        });
    });
});

//分类管理

router.get('/category', function(req, res, next){
    Category.find().then(function(categories){
        res.render('admin/category',{
            userInfo: req.userInfo,
            categories:categories
        })
    });


});

//分类添加页面获取 get的方式
router.get('/category/add', function(req, res, next){
    res.render('admin/category_add',{
        userInfo: req.userInfo
    })
});

//分类添加 post 表单提交的数据

router.post('/category/add', function(req, res, next){
    var name = req.body.name || '';

    if(name==''){
        res.render('admin/category_error',{
            userInfo: req.userInfo,
            message: "用户名为空"
        })
        return;
    }else{
        Category.findOne({ name: name }).then(function(categoryInfo){
            if(categoryInfo){
                res.render('admin/category_error',{
                    userInfo: req.userInfo,
                    message: "分类名称已经存在"
                });
                return Promise.reject();
            }else{
                return new Category({name:name}).save();
            }
        }).then(function(newCategoryInfo){
            if(newCategoryInfo){
                res.render('admin/category_success',{
                    userInfo: req.userInfo,
                    message: "添加分类成功"
                });
            }else{
                res.render('admin/category_error',{
                    userInfo: req.userInfo,
                    message: "添加分类失败"
                });
            }

        })
    }



});

module.exports =  router;

