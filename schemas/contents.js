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
        //引用 Content模型类
        ref: 'Content'
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

