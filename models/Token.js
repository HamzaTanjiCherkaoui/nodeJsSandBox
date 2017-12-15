var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');

var TokenSchema = mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 86400 }
});

TokenSchema.methods.setToken = function (user) {
    var salt = crypto.randomBytes(16).toString('hex');
    //To CHange 
    this.token = crypto.randomBytes(16).toString('hex');

}

mongoose.model('Token',TokenSchema);