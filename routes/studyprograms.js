var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


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
router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//build the REST operations at the base for StudyPrograms
//this will be accessible from http://127.0.0.1:3000/studyprograms if the default route for / is left unchanged
router.route('/')
    //GET all studyprograms
    .get(function(req, res, next) {
        //retrieve all studyprograms from Mongo
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {};
        
        //Check title Param
        var query = req.query.name; 
        if(query != null && query != undefined && query != '')
            param.name = new RegExp(query, 'i');
        
        
        var skip = (pageOptions.page-1)*pageOptions.limit;
        var total = 0;
        mongoose.model('StudyProgram').find(param).count({}, function(err , count){
            total = count;
        });
        mongoose.model('StudyProgram')
            .find(
                param
            )
            .populate('facultyId')
            .populate({
                path: 'createdBy',
                select: 'fullName profile'
            })
            .skip(skip)
            .limit(pageOptions.limit)
            .sort({
                created: -1
            })
            .lean()
            .exec(function(err, studyprograms) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    res.json({
                        results: studyprograms,
                        page: pageOptions.page,
                        limit: pageOptions.limit,
                        total: total
                    });      
                }
        })
    })
    //POST a new StudyProgram
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var facultyId = req.body.facultyId,
            name = req.body.name,
            createdBy = req.body.createdBy;
        //call the create function for our database
        mongoose.model('StudyProgram').create({
            facultyId: facultyId,
            name: name,
            created: new Date(),
            createdBy: createdBy
        }, function(err, studyProgram) {
            if (err) {
                res.json({
                        message: 'There was a problem adding the information to the database ' + err,
                        isSuccess: false
                    });
            } else {
                res.json({
                    message: 'Insert successfull',
                    item: studyProgram,
                    isSuccess : true
                });
            }
        })
    });
router.route('/getlist')
    .get(function(req, res, next) {
        //retrieve all studyprograms from Mongo
        mongoose.model('StudyProgram')
            .find()
            .select('name')
            .sort({
                name: 1
            })
            .lean()
            .exec(function(err, studyprograms) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    res.json(
                        studyprograms
                    );      
                }
        })
    })
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('StudyProgram').findById(id, function (err, studyProgram) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('StudyProgram')
        .findById(req.id)
        .populate('facultyId')
        .exec(function(err, studyProgram) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                res.json(studyProgram);
            }
        });
    })
    //PUT to update a StudyProgram by ID
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var facultyId = req.body.facultyId,
            name = req.body.name,
            modified = req.body.modified,
            modifiedBy = req.body.modifiedBy

        //find the document by ID
        mongoose.model('StudyProgram').findById(req.id, function(err, StudyProgram) {
            //update it
            StudyProgram.update({
                facultyId: facultyId,
                name: name,
                modified: modified,
                modifiedBy: modifiedBy
            }, function(err, StudyProgramID) {
                if (err) {
                    res.json({
                            message: 'There was a problem adding the information to the database ' + err,
                            isSuccess: false
                        });
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Update successfull',
                        item: StudyProgram,
                        isSuccess : true
                    });
                }
            })
        });
    })
    //DELETE a StudyProgram by ID
    .delete(passport.authenticate('jwt', { session: false }),function(req, res) {
        //find StudyProgram by ID
        mongoose.model('StudyProgram').findById(req.id, function(err, StudyProgram) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                StudyProgram.remove(function(err, studyProgram) {
                    if (err) {
                        res.json({
                            message: 'There was a problem adding the information to the database ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: studyProgram,
                            isSuccess : true
                        });
                    }
                });
            }
        });
    });


module.exports = router;