/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require("mongoose");

var categoriesSchema = require('../schemas/categories');

//创建文章分类模型
//返回一个构造函数或者说模型类,通过这个构造函数创建对象
module.exports =  mongoose.model('Category', categoriesSchema);