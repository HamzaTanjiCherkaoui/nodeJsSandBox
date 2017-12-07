var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var auth = require('../auth');

router.params('username',function(req,res,next,username){
    User.findOne({username : username}).then(function(user){
        if(!user) return res.sendStatus(404);
        req.profile = user;
        return next();
    }).catch(next);
})

router.get('/:username' ,auth.optional,function(req,res,next){
    
})