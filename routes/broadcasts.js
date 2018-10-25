//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    multer = require('multer'),
    chance = require('chance'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/broadcast/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'broadcast-' + Date.now()+ chanceString.string({length: 5, pool: 'abcdefghijklmn'}) + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}).array('photos',5),
    fs = require('fs'),
    moment = require('moment');

var chanceString = new chance();
var passport = require("passport");
var async = require("async");

//Copy and pasted from method-override
router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

router.route('/')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        mongoose.model('Broadcast').count({}, function(err, result){
            total = result;
            pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
            if(skip >= total){
                res.json({
                    message: 'No more content in page ' + pageOptions.page + '!',
                    isSuccess: false
                });
            } else{
                mongoose.model('Broadcast').find({})
                .select('sender created createdBy message photos')
                .populate({
                    path: 'sender',
                    select: 'fullName profile.photo'
                })
                .limit(pageOptions.limit)
                .skip(skip)
                .lean()
                .exec(function(err, results){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else{
                        for(var i = 0; i < results.length; i++){
                            results[i].created = moment(results[i].created).fromNow();
                        }
                        res.json({
                            total: total,
                            page: pageOptions.page,
                            items: results
                        });
                    }
                });
            }
        });
    });

router.param('id', function(req, res, next, id){
    mongoose.model('Broadcast').findById(id, function(err, broadcast){
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

router.route('/:id')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('Broadcast').findById(req.id)
        .populate({
            path: 'receivers',
            select: 'fullName'
        })
        .populate({
            path: 'sender',
            select: 'fullName profile.photo'
        })
        .lean()
        .exec(function(err, result){
            result.created = moment(result.created).fromNow();
            res.json(result);
        }); 
    })
    .put(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }
            mongoose.model('Broadcast').findById(req.id, function(err, result){
                if(err){
                    res.json({
                        message: 'error ' + err,
                        isSuccess: false
                    });
                } else{
                    result.update({
                        sender: req.body.sender,
                        message: req.body.message,
                        photos: photos.length == 0 ? result.photos : photos
                    }, function(err){
                        if(err){
                            res.json({
                                message: 'error ' + err,
                                isSuccess: false
                            });
                        } else{
                            res.json({
                                message: 'Update successfull!',
                                isSuccess: true
                            });
                        }
                    });
                }
            })
        })
    })
    .delete(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('Broadcast').findById(req.id, function(err, result){
            if(result == undefined || err){
                res.json({
                    message: 'error ' + err,
                    isSuccess: false
                });
            } else {
                result.remove(function(err){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else{
                        res.json({
                            message: 'Delete successfull',
                            isSuccess: true
                        });
                    }
                })
            }
        });
    })

router.route('/all')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [],
                receivers = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }
            mongoose.model('User').find({})
                .select('id')
                .exec(function(err, users){
                    receivers = users;
                    mongoose.model('Broadcast').create({
                        sender: req.body.sender,
                        created: new Date(),
                        message: req.body.message,
                        photos: photos,
                        receivers: receivers
                    }, function(err){
                        if(err){
                            res.json({
                                message: 'error ' + err,
                                isSuccess: false
                            });
                        } else {
                            res.json({
                                message: 'Insert successfull',
                                isSuccess: true
                            });
                        }
                    });
                });
        })
    });

router.route('/batch')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [],
                receivers = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }
            mongoose.model('User').find({batch: req.body.batch})
            .select('id')
            .exec(function(err, users){
                receivers = users;
                mongoose.model('Broadcast').create({
                    sender: req.body.sender,
                    created: new Date(),
                    message: req.body.message,
                    photos: photos,
                    receivers: receivers
                }, function(err){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Insert successfull',
                            isSuccess: true
                        });
                    }
                })
            })
        });
    });

router.route('/faculty')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [],
                receivers = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }

            mongoose.model('StudyProgram').find({facultyId: req.body.faculty})
            .select('id')
            .exec(function(err, studyprograms){
                async.each(studyprograms, function(studyprogram, next){
                    mongoose.model('User').find({studyProgramId: studyprogram._id})
                    .select('id')
                    .exec(function(err, users){
                        if(users.length > 0){
                            receivers = receivers.concat(users);
                        }
                        next();
                    });
                }, function(err){
                        mongoose.model('Broadcast').create({
                        sender: req.body.sender,
                        created: new Date(),
                        message: req.body.message,
                        photos: photos,
                        receivers: receiversw
                    }, function(err){
                        if(err){
                            res.json({
                                message: 'error ' + err,
                                isSuccess: false
                            });
                        } else {
                            res.json({
                                message: 'Insert successfull',
                                isSuccess: true
                            });
                        }
                    });
                });
            });
        });
    });

router.route('/studyprogram')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [],
                receivers = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }
            mongoose.model('User').find({studyProgramId: req.body.studyprogram})
            .select('id')
            .exec(function(err, users){
                console.log(users.length);
                if(users.length == 0){
                    res.json({
                            message: 'Receiver is null, try another study program!',
                            isSuccess: false
                        });
                } else {
                    receivers = users;
                    mongoose.model('Broadcast').create({
                        sender: req.body.sender,
                        created: new Date(),
                        message: req.body.message,
                        photos: photos,
                        receivers: receivers
                    }, function(err){
                        if(err){
                            res.json({
                                message: 'error ' + err,
                                isSuccess: false
                            });
                        } else {
                            res.json({
                                message: 'Insert successfull',
                                isSuccess: true
                            });
                        }
                    });
                }
                
            });
        });
    });

router.route('/batchandstudyprogram')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [],
                receivers = [];
            if(req.files != undefined){
                for(var i = 0; i < req.files.length; i++){
                    photos.push(req.files[i].filename);
                }
            }
            mongoose.model('User').find({
                studyProgramId: req.body.studyprogram,
                batch: req.body.batch
            })
            .select('id')
            .exec(function(err, users){
                receivers = users;
                mongoose.model('Broadcast').create({
                    sender: req.body.sender,
                    created: new Date(),
                    message: req.body.message,
                    photos: photos,
                    receivers: receivers
                }, function(err){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Insert successfull',
                            isSuccess: true
                        });
                    }
                });
            });
        });
    });

router.route('/receivers/:id')
    .get(passport.authenticate('jwt', {session: false}), function(req, res){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        mongoose.model('Broadcast').findById(req.id, function(err, result){
            total = result.receivers.length;
        })
        mongoose.model('Broadcast').findById(req.id, 
            {
                receivers:{
                    $slice:[pageOptions.page == 1 ? 0 : (pageOptions.page-1)*pageOptions.limit,pageOptions.limit]
                }
            }
        )
        .exec(function(err, result){
            result.populate({
                path: 'receivers',
                select: 'fullName batch studyProgramId profile.photo',
                populate: {
                    path: 'studyProgramId',
                    select: 'name'
                }
            }, function(err){
                if(err){
                    res.json({
                        message: 'error ' + err,
                    })
                } else{
                    res.json({
                        total: total,
                        page: pageOptions.page,
                        items: result.receivers
                    });
                }

            });
        });
    });

router.route('/sent')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        mongoose.model('Broadcast').count({sender: req.body.sender}, function(err, result){
            total = result;
            pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
            if(skip >= total){
                res.json({
                    message: 'No more content in page ' + pageOptions.page + '!',
                    isSuccess: false
                });
            } else{
                mongoose.model('Broadcast').find({sender: req.body.sender})
                .select('sender created message photos')
                .populate({
                    path: 'sender',
                    select: 'fullName profile.photo'
                })
                .limit(pageOptions.limit)
                .skip(skip)
                .lean()
                .exec(function(err, results){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else{
                        for(var i = 0; i < results.length; i++){
                            results[i].created = moment(results[i].created).fromNow();
                        }
                        res.json({
                            total: total,
                            page: pageOptions.page,
                            items: results
                        });
                    }
                });
            }
        });
    })

router.route('/inbox')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        var broadcasts = [];
        mongoose.model('Broadcast')
        .aggregate([
                {   
                    $group: {
                        _id: '$sender'
                    }
                }
            ])
        .exec(function(err, results){
            if(err){
                res.json({
                    message: 'error ' + err,
                    isSuccess: false
                });
            } else{
                var userDetail;
                async.each(results, function(result, next){
                    mongoose.model('User').findById(result._id)
                    .select('fullName profile.photo')
                    .exec(function(err, user){
                        mongoose.model('Broadcast').find({
                            sender: user._id,
                            receivers: req.body.user
                        })
                        .select('message created photos sender')
                        .lean()
                        .exec(function(err, messages){
                            if(messages.length > 0){
                                var item;
                                item = {
                                    sender: user,
                                    messages: messages
                                }
                                broadcasts.push(item);
                            }
                            next();
                        });
                        
                    });
                }, function(err){
                    for(var i = 0; i < broadcasts.length; i++){
                        for(var j = 0; j<broadcasts[i].messages.length; j++){
                            broadcasts[i].messages[j].created = 
                                moment(broadcasts[i].messages[j].created).fromNow();
                        }
                    }
                    res.json(broadcasts);
                });
            }
        });
    })

module.exports = router;