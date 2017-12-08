var router = require('express').Router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var auth = require('../auth');

router.param('article', function (req, res, next, slug) {
    Article.findOne({ slug: slug }).then(function (article) {
        if (!article) return res.sendStatus(404);
        req.article = article;
        next();
    }).catch(next);
})