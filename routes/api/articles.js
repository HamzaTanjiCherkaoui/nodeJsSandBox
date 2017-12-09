var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User'); 
var auth = require('../auth');

router.param('article', function (req, res, next, slug) {
    Article.findOne({ slug: slug }).then(function (article) {
        if (!article) return res.sendStatus(404);
        req.article = article;
        next();
    }).catch(next);
})

router.get('/:article', auth.required, function (req, res, next) {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.article.populate('author').execPopulate()
    ]).then(function (results) {
        var user = results[0];
        return res.json({ article: req.article.toJSONFor(user) });
    }).catch(next);
})

router.post('/', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) return res.sendStatus(401);
        var article = new Article(req.body.article);
        article.author = user;
        return article.save().then(function () {
            
            return res.json({ article: article.toJSONFor(user) });
        }).catch(next);
    })
})

module.exports = router;