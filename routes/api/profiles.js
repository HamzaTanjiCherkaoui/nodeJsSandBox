var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var auth = require('../auth');

router.param('username',function(req,res,next,username){
    console.log("passing username "+username);
    User.findOne({username : username}).then(function(user){
        if(!user) return res.sendStatus(404);
        req.profile = user;
        return next();
    }).catch(next);
})

router.get('/:username' ,auth.optional,function(req,res,next){

    if(req.payload) {
        
        User.findOne(req.payload.id).then(function(user){
            if(!user) return res.json({profile : req.profile.toProfileJSONFor(false)});
            return res.json({profile : req.profile.toProfileJSONFor(user)});
        }).catch(next);
        
    } else {
        return res.json({profile : req.profile.toProfileJSONFor(flase)});
    }

})

module.exports = router; 