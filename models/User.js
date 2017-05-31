/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require("mongoose");

var usersSchema = require('../schemas/users');

//创建用户模型
//返回一个构造函数或者说模型类,通过这个构造函数创建对象
module.exports =  mongoose.model('User', usersSchema);