const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    username:String,
    useremail:String,
    userpassword:String,
    isActive:Boolean
})

const taskSchema=new mongoose.Schema({
    text:String,
    taskpic:String,
    checked:Boolean,

})

module.exports.user=mongoose.model('user',userSchema);

module.exports.task=mongoose.model('task',taskSchema);

//module.exports=user