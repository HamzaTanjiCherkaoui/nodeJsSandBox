var router = require('express').Router();
var mongoose = require('mongoose');
var Article = mongoose.model('Article');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var auth = require('../auth');

router.param('article', function (req, res, next, slug) {
    Article.findOne({ slug: slug }).populate('author').then(function (article) {
        if (!article) return res.sendStatus(404);
        req.article = article;
        next();
    }).catch(next);
})


router.get('/:article', auth.optional, function (req, res, next) {
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

router.post('/:article/favorite', auth.required, function (req, res, next) {
    var articleId = req.article._id;
    User.findById(req.payload.id).then(function (user) {
        if (!user) return res.sendStatus(401);
        return user.favorite(articleId).then(function () {
            return req.article.updateFavoritesCount().then(function (article) {
                return res.json({ article: article.toJSONFor(user) });
            }).catch(next);

        })
    }).catch(next);
})
router.delete('/:article/favorite', auth.required, function (req, res, next) {
    var articleId = req.article._id;
    User.findById(req.payload.id).then(function (user) {
        if (!user) return res.sendStatus(401);
        return user.unFavorite(articleId).then(function () {
            return req.article.updateFavoritesCount().then(function (article) {
                return res.json({ article: article.toJSONFor(user) });
            }).catch(next);

        })
    }).catch(next);
})

router.get('/:article/comments', auth.optional, function (req, res, next) {
    Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function (user) {
        return req.article.populate({
            path: 'comments',
            populate: { path: 'author' },
            options: {
                sort: { createdAt: 'desc' }
            }
        }).execPopulate().then(function (article) {
            return res.json({
                comments: article.comments.map(comment => comment.toJSONFor(user))
            });
        })
    }).catch(next);
})
router.post('/:article/comments', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
      if(!user){ return res.sendStatus(401); }
  
      var comment = new Comment(req.body.comment);
      comment.article = req.article;
      comment.author = user;
  
      return comment.save().then(function(){
        req.article.comments.push(comment);
  
        return req.article.save().then(function(article) {
          res.json({comment: comment.toJSONFor(user)});
        });
      });
    }).catch(next);
  });
  
  
module.exports = router;