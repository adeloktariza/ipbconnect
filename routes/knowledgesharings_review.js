var express = require('express'),
router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/knowledgesharing/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'content-' + Date.now() + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}),
    moment = require('moment'),
    fs = require('fs');

    var ppt2png = require('ppt2png'); 
    var passport = require("passport");


//Copy and pasted from method-override
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').find()
    .select()
    .populate({
        path: 'createdBy',
        select: 'fullName'
    })
    .exec(function(err, list){
        res.json(list);
    })
});

router.route('/query')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').aggregate([
    {
        $group: {
            _id: '$createdBy',
            totalUpload: {
                $sum: 1
            },
            createdBy: {
                $push: "$title"
            }
        }
    }
    ])
    .exec(function(err, list){
        res.json({
            items: list
        });
    })
})

router.param('id', function(req, res, next, id){
    mongoose.model('KnowledgeSharing').findById(id, function(err, knowledgesharing){
        if(!err){
            req.id = id;
            next();
        } else{
            res.json({
                message: err.status+ ' ' + err
            });
        }
    })
});

router.route('/list')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    var pageOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 6
    }
    mongoose.model('KnowledgeSharing').count({}, function(err, result){
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        mongoose.model('KnowledgeSharing').find()
        .select('createdBy title cover totalLike created likers bookmarks')
        .populate({
            path: 'createdBy',
            select: 'fullName profile.photo'
        })
        .lean()
        .limit(pageOptions.limit)
        .skip(skip)
        .sort({totalLike: 'desc'})
        .exec(function(err, list){
            res.json(list)
        })
    })
})

router.route('/list/:id')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('KnowledgeSharing').findById(req.id)
        .exec(function(err, result){
            res.json(result);
        })
    })

router.route('/comment/:id')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('KnowledgeSharing').findById(req.id)
        .select('comments')
        .populate({
            path: 'comments',
            populate: {
                path: 'createdBy replies',
                select: 'fullName',
                populate: {
                    path: 'createdBy',
                    select: 'fullName studyProgramId',
                    populate: {
                        path: 'studyProgramId',
                        select: 'name'
                    }
                }
            }
        })
        .exec(function(err, result){
            res.json(result);
        })
    })

router.route('/async')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('User').find({}).select('fullName batch studyProgramId')
        .populate({
            path: 'studyProgramId',
            select: 'name'
        })
        .lean()
        .exec(function(err, results){
            var list = [];
            for(var i = 0; i < results.length; i++){
                mongoose.model('StudyProgram').findById(results[i].studyProgramId)
                .lean()
                .exec(function(err, faculty){
                    list.push(faculty)
                    console.log(faculty);
                })
            }
            console.log("print!!!")
            res.json({
                item: list
            });
        })
    })

router.route('/code')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        res.status(203).json();
    })

router.route('/recursive')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        var n = 10;
        var results = [];
        function fib(n){
            if(n == 0){
                return n;
            } else if(n == 1){
                return n;
            } else {
                return(fib(n-1) + fib(n-2));
            }
        }
        for(var i = 0; i <= n; i++){
            results.push(fib(i));
        }
        res.json(results);
    })

module.exports = router;