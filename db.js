const mongoose = require('mongoose');

function connectDB(uri) {
    return mongoose.connect(uri).then(()=>{
        console.log('connected to DB');
    }).catch(err => console.log('error', err));
}

module.exports = connectDB;