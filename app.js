/**
 *应用程序的启动入口， 前端所有请求都会经过这
 */

// 加载express模块
var express = require("express");
//加载模版处理模块
var swig = require("swig");
// 创建app应用 => NodeJS http.createServer()
var app = express();
//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname+'/public'下的文件
app.use('/public' , express.static(__dirname+'/public'));
//加载数据库模块
var mongoose = require("mongoose");
//加载body-parser模块,用来处理post提交过来的数据
var bodyParser = require("body-parser");
//中间件 bodyParser设置  post请求传过来的数据会通过url编码,用这个来处理
app.use(bodyParser.urlencoded({extended: true}));//以后req里会封装一个body供使用
//加载cookies
var cookies = require("cookies");
//用中间件的方式 用户访问站点都会走这个中间件
var User = require('./models/User');

//中间件
app.use(function(req, res, next){
    req.cookies = new cookies(req, res);
    //解析登录用户的cookie信息
    req.userInfo = {}
    var cookiesUserInfo = req.cookies.get('userInfo');
    if(cookiesUserInfo){
        try{
            req.userInfo = JSON.parse(cookiesUserInfo);
            req.userInfo.username = decodeURI(req.userInfo.username)
            User.findOne({
                username:req.userInfo.username
            }).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            });

        }catch(e){
            next();
        }

    }else{
        next();
    }

});

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：表示模版引擎的名称，也是模版文件的后缀 tpl也行，第二参数表示用于解析处理模版内容的方法
app.engine('html', swig.renderFile);
//设置模版文件存放的目录， 第一个参数必须为views，第二个参数是目录
app.set('views', './views');
//注册所使用的模版引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称是一致的
app.set('view engine', 'html');
//在开发过程中 需要取消模版缓存，这样修改模版不用重新启动项目，通过刷新就可以更改
swig.setDefaults({cache: false});

//app.get('/', function(req, res, next){
//	//res.send("res.send (<h2>欢迎访问我的博客</h2>)")
//	//读取views目录下的指定文件，解析并返回给客户端
//	//第一个参数：表示模版文件 相对应views目录  views/index.html
//	//第二个参数： 传递给模版使用的数据
//	res.render('index');
//})

//根据不同的功能划分模块
//后端模块
app.use('/admin', require('./routers/admin'));
//api模块
app.use('/api', require('./routers/api'));
//首页模块
app.use('/', require('./routers/main'));

//连接数据库,链接之前先开启数据库  指定mongodb把数据存储的位置blog/db  数据库端口号
//sudo mongod --dbpath=/Users/mahong/Documents/mahong/myProjects/blog/db --port=27017
//如果blog/db是空的，第一次启动mongodb会在blog/db里生存一些文件collection－0/2，index－1/3/6，
//如果已经有了不会增加，比如从git上拉下来很多数据，会在读取这些数据,在这些数据基础上操作
//后续往数据库增加一个blog数据库目录会多一个collection-5.。。。index-6的 再加一个myblog会多出collection-7.。。。index-8

//项目连接数据库 用mongodb的插件mongoose连接数据库 通过数据库地址＋端口号localhost:27017就可以连接数据库
//然后用mongoose提供的方法操作数据库 把数据写在blog目录下
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blog', function(err){
    if(err){
        console.log("连接失败....");
    }else{
        console.log("连接成功....");
        app.listen(8088);
    }
});


//用户发送http请求 －》 url －》解析路由 －》 找到匹配的规则 －》执行指定的绑定函数，返回对应内容至用户
// /public-> 静态 －》直接读取指定目录下的文件， 返回给用户
// －》动态 －》处理业务逻辑 ，加载模版，解析模版 －》返回数据给用户