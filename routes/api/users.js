var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var auth = require('../auth');

router.get('/user', auth.required, function (req, res, next) {
    User.findById(req.payload.id).then(function (user) {
        if (!user)
            return res.sendStatus(401);
        return res.json({ user: user.toAuthJSON() });
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
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }

        return user.save().then(function () {
            return res.json({ user: user.toAuthJSON() });
        }).catch(next)

    }).catch(next);

})

router.post('/users', function (req, res, next) {
    var user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.setPassword(req.body.user.password);

    user.save().then(function (user) {

        var token = new Token();
        token._userId = user._id;
        token.setToken(user);
        token.save().then(function (token) {
            console.log(token);
        })

        sendTokenToUser(token);
    }).catch(next);
});

var sendTokenToUser = function (token) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey("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");
    const msg = {
        to: 'hamzatanjicherkaoui@gmail.com',
        from: 'test@example.com',
        subject: `Verify your Account `,
        text: `click the link bellow to verify your account`,
        html: `<a href="localhost:3000/api/user/confirm?token=${token}">`,
    };
    sgMail.send(msg);
    res.sendStatus(204);
}
router.get('/user/confirm', function (req, res, next) {
    if (typeof req.query.token === 'undefined') res.sendStatus(403);
    var token = req.query.token;
    Token.findOne({ token: token }).then(function (token) {
        User.findById(token._userId).then(function (user) {
            if (!user)
                return res.sendStatus(401)
            user.isVerified = true;
            token.remove().exec();
            user.save().then(function (user) {
                res.sendStatus(204);
            }).catch(next)
        });

    }).catch(next);
})
router.post('/user/resend', function (req, res, next) {
    if (typeof req.body.email === 'undefined') return res.status(422).json({ errors: { email: "can't be blank" } });
    User.findOne({ email: req.body.email }).then(function (user) {
        var token = new Token();
        token._userId = user._id;
        token.setToken(user);
        token.save().then(function (token) {
            console.log(token);
        })

        sendTokenToUser(token);
    })
})
router.post('/users/login', function (req, res, next) {
    User.count({ email: req.body.user.email, isVerified: true }).then(function (count) {
        if (count == 0) res.send("the account is not verified");
    })

    if (!req.body.user.email)
        return res.status(422).json({ erros: { email: "cant't be blank" } })
    if (!req.body.user.password)
        return res.status(422).json({ errors: { password: "can't be blank" } });

    passport.authenticate('local', { session: false }, function (err, user, info) {
        if (err)
            return next(err)
        if (user) {
            user.token = user.generateJWT();
            return res.json({ user: user.toAuthJSON() });
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

module.exports = router;