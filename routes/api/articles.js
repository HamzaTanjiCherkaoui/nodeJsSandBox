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
router.param('comment', function (req, res, next, id) {
    Comment.findById(id).then(function (comment) {
        if (!comment) return res.sendStatus(404);
        req.comment = comment;
        next();
    }).catch(next);
})

//GET Articles
router.get('/', auth.optional, function (req, res, next) {
    
    var query = {};
    var limit = 20;
    var offset = 0;

    if (typeof req.body.limit !== 'undefined') limit = req.body.limit;
    if (typeof req.body.offset !== 'undefined') offset = req.body.offset;
    if (typeof req.body.tag !== 'undefined') query.tagList = { "$in": [req.body.tag] };

    Promise.all([
        req.query.author ? User.findOne({ username: req.query.athor }) : null,
        req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    ]).then(function (results) {
        var author = results[0];
        var favoriter = results[1];
        if (author) query.author = author._id;

        if (favoriter) {
            query._id = { "$in": favoriter.favorites };
        } else if (req.query.favorited) {
            query._id = { '$in': [] };
        }

        return Promise.all([
            Article.find(query)
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('author')
                .exec(),
            Article.count(query).exec(),
            req.payload ? User.findById(req.payload.id) : null
        ]).then(function (results) {
            var articles = results[0];
            var articlesCount = results[1];
            var user = results[2];

            return res.json({
                articles: articles.map(function (article) {

                    return article.toJSONFor(user);
                }),
                articlesCount: articlesCount
            });

        }).catch(next);
    }).catch(next);
})
//GET feed of the user 
router.get('/feed', auth.required, function (req, res, next) {
    var limit = 20;
    var offset = 0;

    if (typeof req.body.limit !== 'undefined') limit = req.body.limit;
    if (typeof req.body.offset !== 'undefined') offset = req.body.offset;

    User.findById(req.payload.id).then(function (user) {
        if (!user) res.sendStatus(403);
        return Article.find({ author: { '$in': user.following } })
            .limit(Number(limit))
            .skip(Number(offset))
            .sort({ createdAt: 'desc' })
            .populate('author')
        then(function (articles) {
            if (!articles) return res.json({ articles: [] });
            return res.json({ articles: articles.map(article => article.toJSONFor(user)) });
        })
    })
})
//GET a single Article
router.get('/:article', auth.optional, function (req, res, next) {
    Promise.all([
        req.payload ? User.findById(req.payload.id) : null,
        req.article.populate('author').execPopulate()
    ]).then(function (results) {
        var user = results[0];
        return res.json({ article: req.article.toJSONFor(user) });
    }).catch(next);
})
// POST create an article
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
// Delete an article
router.delete('/:article', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) res.sendStatus(401);
        if (req.article.author._id.toString() === req.payload.id.toString()) {
            req.article.remove().exec().then(res.sendStatus(204));
        }
        else {
            res.sendStatus(403);
        }
    })
})
// Update an article
router.put('/:article', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }
        if(req.article.author._id.toString() === req.payload.id.toString()){
            if(typeof req.body.article.title !== 'undefined'){
              req.article.title = req.body.article.title;
            }
      
            if(typeof req.body.article.description !== 'undefined'){
              req.article.description = req.body.article.description;
            }
      
            if(typeof req.body.article.body !== 'undefined'){
              req.article.body = req.body.article.body;
            }
      
            if(typeof req.body.article.tagList !== 'undefined'){
              req.article.tagList = req.body.article.tagList
            }
      
            req.article.save().then(function(article){
              return res.json({article: article.toJSONFor(user)});
            }).catch(next);
          } else {
            return res.sendStatus(403);
          }
    })
})
// favorite an article
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
// unfavorite an article
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
// get articles comments
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
// add a comment to an article
router.post('/:article/comments', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user) { return res.sendStatus(401); }

        var comment = new Comment(req.body.comment);
        comment.article = req.article;
        comment.author = user;

        return comment.save().then(function () {
            req.article.comments.push(comment);
            return req.article.save().then(function (article) {
                res.json({ comment: comment.toJSONFor(user) });
            });
        });
    }).catch(next);
});
//delete a comment from an article
router.delete('/:article/comments/:comment', auth.required, function (req, res, next) {
    if (req.comment.author.toString() == req.payload.id) {
        req.article.comments.remove(req.comment._id);
        req.article.save()
            .then(Comment.find({ _id: req.comment._id }).remove().exec())
            .then(function () { res.sendStatus(204) });
    } else {
        res.sendStatus(403);
    }
})
module.exports = router;