/**
 * Created by mahong on 17/5/24.
 */
var mongoose = require('mongoose');

//用户的表结构

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

