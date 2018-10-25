var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'),//used to manipulate POST
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/memory/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'memory-' + Date.now() + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}).single('photo'),
    fs = require('fs'); 


var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'ipbconnect';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  console.log(jwt_payload.id);

  mongoose.model('User')
  .findOne({
            _id: jwt_payload.id
        }, function(err, user) {
            if(err) {
                return next(err, false);
            }
            if(user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });

});

passport.use(strategy);


//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/memories if the default route for / is left unchanged
router.route('/')
    //GET all memories
    .get(passport.authenticate('jwt', { session: false }),function(req, res, next) {
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {};
        var studyProgramId = null;

        //Check title Param
        query = req.query.caption; 
        if(query != null && query != undefined && query != '')
            param.caption = new RegExp(query, 'i');

        //Check createdBy Param
        var query = req.query.createdBy;
        if(query != null && query != undefined && query != ''){
            if(mongoose.Types.ObjectId.isValid(query))
                param.createdBy = query;
            else{
                res.json({
                    error: "Object ID is not valid"
                });
                return;
            }
        }

        //Check createdBy Param
        query = req.query.studyProgramId;
        if(query != null && query != undefined && query != ''){
            if(mongoose.Types.ObjectId.isValid(query)){
                studyProgramId = query;
            }
            else{
                res.json({
                    error: "Object ID is not valid"
                });
                return;
            }
        }        
        var skip = (pageOptions.page-1)*pageOptions.limit;
        // var total = 0;
        // mongoose.model('Memory').find(param).count({}, function(err , count){
        //     total = count;
        // });

        //retrieve all memories from Mongo
        mongoose.model('Memory')
            .find(
                param
            )
            // .skip(skip)
            // .limit(pageOptions.limit)
            .sort({
                created: -1
            })
            .populate({
                path: 'createdBy',
                select: 'fullName batch studyProgramId profile'
            })
            .lean()
            .exec(function(err, memories) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    if(studyProgramId != null){
                        var memories = memories.filter(function(memory){
                            return memory.createdBy.studyProgramId == studyProgramId;
                        });
                    }
                    var memories = memories.slice(skip, skip+pageOptions.limit);
                    res.json({
                        results: memories,
                        page: pageOptions.page,
                        limit: pageOptions.limit,
                        total: memories.length
                    });  
                }
        });
    })
    //POST a new Memory
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        upload(req,res,function(err) {
            console.log(req.file);
            var caption =  req.body.caption,
                photo = '',
                createdBy = req.body.createdBy;
            if(req.file != undefined){
                fs.readFile(req.file.path, function (err, data){
                    if(err) {
                        return res.end("Error uploading file.");
                    }
                });
                photo = req.file.filename;
            }
            mongoose.model('Memory').create({
                caption: caption,
                photo: photo,
                totalLike: 0,
                created: new Date(),
                createdBy: createdBy
            }, function(err, memory) {
                if (err) {
                    res.json({
                        message: 'There was a problem adding the information to the database ' + err,
                        isSuccess: false
                    });
                } else {
                    //Memory has been created
                    res.json({
                        message: 'Insert successfull',
                        item: memory,
                        isSuccess: true
                    });
                }
            })
        });
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Memory').findById(id, function(err, Memory) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.json({
                 message: err.status + ' ' + err
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(Memory);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('Memory')
            .findById(req.id)
            .populate({
                path: 'createdBy',
                select: 'fullName profile'
            })
            .populate({
                path: 'comments.createdBy',
                select: 'fullName profile'
            })
            .exec(function(err, Memory) {
                if (err) {
                    console.log('GET Error: There was a problem retrieving: ' + err);
                } else {
                    res.json(Memory);
                }
            });
    })
    //DELETE a Memory by ID
    .delete(passport.authenticate('jwt', { session: false }),function(req, res) {
        //find Memory by ID
        mongoose.model('Memory').findById(req.id, function(err, Memory) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                Memory.remove(function(err, Memory) {
                    if (err) {
                        res.json({
                            message: 'There was a problem adding the information to the database ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: Memory,
                            isSuccess: true
                        });
                    }
                });
            }
        });
    })
    //PUT to update a Memory by ID
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        upload(req,res,function(err) {
            var caption =  req.body.caption,
                photo = '';
            if(req.file != undefined){
                fs.readFile(req.file.path, function (err, data){
                    if(err) {
                        res.send("There was a problem adding the information to the database " + err);
                        return;
                    }
                });
                photo = req.file.filename;
            }
                     
            // find the document by ID
            mongoose.model('Memory').findById(req.id, function(err, Memory) {
                //update it
                Memory.update({
                    caption: caption,
                    photo: photo == '' ?  Memory.photo : photo
                }, function(err, memory) {
                    if (err) {
                        res.json({
                            message: 'There was a problem updating the information to the database: ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Update successfull',
                            isSuccess: true
                        });
                    }
                })
            });
        });
    });


router.route('/like/:id')
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        var createdBy = req.body.createdBy;
        mongoose.model('Memory').findById(req.id, function(err, Memory) {
            if(Memory==null){
                res.json({
                    message: 'Memory not found'
                });
                return;
            }

            var totalLike = ++Memory.totalLike;
            var likers = [];
            if(Memory.likers){
                likers = Memory.likers;
            }

            var element = {
                createdBy: createdBy,
                created: new Date()
            }
            likers.push(element);
            //update it
            Memory.update({
                totalLike: totalLike,
                likers: likers
            }, function(err, MemoryID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Add like successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/unlike/:id')
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        var createdBy = req.body.createdBy;
        mongoose.model('Memory').findById(req.id, function(err, Memory) {
            if(Memory==null){
                res.json({
                    message: 'Memory not found'
                });
                return;
            }

            var totalLike = --Memory.totalLike;
            var likers = [];
            if(Memory.likers){
                likers = Memory.likers;
                likers = likers.filter(function( obj ) {
                    return obj.createdBy != createdBy;
                });
            }

            // update it
            Memory.update({
                totalLike: totalLike,
                likers: likers
            }, function(err, MemoryID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Unlike successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/comment/:id')
    .get(passport.authenticate('jwt', { session: false }),function(req, res, next) {
        mongoose.model('Memory')
            .findById(req.id)
            .populate('comments.createdBy',{ fullName: 1, profile: 1}).exec(function (err, Memory) {
                if(Memory == null){
                    res.json({
                        message: 'Memory not found'
                    });
                    return;
                }

                if(Memory.comments == undefined && query != ''){
                    res.json({});
                    return;
                }

                var limit = Number(req.query.limit) || 5;
                var page = Number(req.query.page) || 1;//Math.floor((Memory.comments.length-1)/limit)+1;
                var end = Memory.comments.length - ((page-1)*limit);
                var start = end-limit < 0 ? 0:end-limit;
                var comments = Memory.comments.slice(start, end);
                res.json({
                    results: comments,
                    page: page,
                    total: Memory.comments.length,
                    limit: limit
                }); 
            });
    })
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        var createdBy = req.body.createdBy,
            value = req.body.value;
        mongoose.model('Memory').findById(req.id, function(err, Memory) {
            if(Memory==null){
                res.json({
                    message: 'Memory not found'
                });
                return;
            }

            var comments = [];
            if(Memory.comments)
                comments = Memory.comments;

            var element = {
                value: value,
                createdBy: createdBy,
                created: new Date()
            }
            comments.push(element);
            //update it
            Memory.update({
                comments: comments
            }, function(err, comment) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    var options = {
                        path: 'createdBy',
                        model: 'User',
                        select: 'fullName profile'
                    };
                    mongoose.model('Memory').populate(element, options, function (err, comment) {
                        if (err) {
                            res.json({
                                message: 'GET Error: There was a problem retrieving: ' + err,
                                isSuccess: false
                            });
                        } else {
                            res.json({
                                item : comment,
                                message: 'Add comment successfull',
                                isSuccess: true
                            });
                        }
                    });  
                }
            })
        });
    });


module.exports = router;
