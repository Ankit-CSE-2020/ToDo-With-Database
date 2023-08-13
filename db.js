const mongoose = require('mongoose');

module.exports.init= async function(){

    await mongoose.connect('mongodb+srv://userCodeQuotient:Fx7mvGQHSlXou1Ac@cluster0.rtgyaju.mongodb.net/summerTraining?retryWrites=true&w=majority')
 
    console.log('connected to mongoDB');
}