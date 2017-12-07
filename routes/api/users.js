var mongoose = require('mongoose');
var router = require('router');
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user)
            return res.sendStatus(401);
        return res.json({ user: user.tokenAuthJSON });
    }).catch(next);
});

router.put('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user)
            return res.sendStatus(401)

        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if(typeof req.body.user.password !== 'undefined'){
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function(){
            return res.json({user : user.getAuthJSON()});
        }).catch(next)

    }).catch(next);

})

router.post('/users',function(req,res,next){
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function(){
        return res.json({user : user.getAuthJSON()});
    }).catch(next);
});

module.exports = router;