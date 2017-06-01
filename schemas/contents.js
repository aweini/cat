/**
 * Created by mahong on 17/5/31.
 */
var mongoose = require('mongoose');

//文章内容的表结构

module.exports = new mongoose.Schema({
    //关联字段-内容分类id
    category: {
        //类型 ObjectId 是一个对象,与它关联
        type: mongoose.Schema.Types.ObjectId,
        //引用 Category模型类
        ref: 'Category'
    },
    //关联字段-用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },

    //阅读量
    views: {
        type: Number,
        default: 0
    },
    title: String,
    description:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        default:''
    }
});

