var router = require('express').Router();
router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));


router.get('/clear-data', function (req, res, next) {
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    var Article = mongoose.model('Article');
    var Comment = mongoose.model('Comment');
    var Token = mongoose.model('Token');
    Comment.remove({}).exec();
    Token.remove({}).exec();
    Article.remove({}).exec();
    User.remove({}).exec();

}) 
module.exports = router;
