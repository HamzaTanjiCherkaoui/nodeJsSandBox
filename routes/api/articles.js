var router = require('express').Router;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Article = mongoose.model('Article');
var auth = require('../auth');

