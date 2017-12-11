var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var router = require('express').Router();

router.get('/', function(req,res,next){
    Article.find().distinct('taglist').then(function(tags){
        return res.json({tags : tags});
    }).catch(next)
})

module.exports = router;
