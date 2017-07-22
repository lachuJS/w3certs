var express = require('express');
var router = express.Router();
var institution = require('../bin/issuer-model');
var passport = require('passport');

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.json({loggedin:true});
  });
//home all issuers
router.get('/', function (req, res, next) {
    if(req.user) {
        institution.allIssuers(req.user.id,function (err, issuers) {
            if(err) return next(err);
            res.json(issuers);
        });
    }
    else {
        res.status(401).send('log in');
    }
});
//issuer
router.get('/issuer/:issuerId', function (req, res, next) {
    if(req.user) {
        console.log(req.params.issuerId);
        institution.issuer(req.params.issuerId, function (err, issuer) {
            if(err) return done(err);
            res.json(issuer);
        })
    }
    else {
        res.sendStatus(401);
    }
});
router.get('/recent-issues', function(req, res, next) {
    if(req.user) {
        institution.recentIssued(req.user.id, function (err, recents) {
            if(err) return next(err);
            res.json(recents);
        });
    }
    else {
        res.sendStatus(401)
    }
});
router.get('/logout', function (req, res, next) {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;