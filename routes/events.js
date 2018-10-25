var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/event/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'event-' + Date.now() + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}).single('picture'),
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


Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0, 0);
    return d
}

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
//this will be accessible from http://127.0.0.1:3000/events if the default route for / is left unchanged
router.route('/')
    //GET all events
    .get(passport.authenticate('jwt', { session: false }),function(req, res, next) {
        console.log(req.query);
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {};
        var studyProgramId = null;
                
        //Check title Param
        var query = req.query.title; 
        if(query != null && query != undefined && query != '')
            param.title = new RegExp(query, 'i');
        
        //Check title Param
        var query = req.query.place; 
        if(query != null && query != undefined && query != '')
            param.place = new RegExp(query, 'i');
        
        //Check jobLocationId Param
        query = req.query.createdBy;
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
        

        //add param studyProgram
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
        var total = 0;
        mongoose.model('Event').find(param).count({}, function(err , count){
            total = count;
        });
        //retrieve all events from Mongo
        mongoose.model('Event')
            .find(
                param
            )
            .skip(skip)
            .limit(pageOptions.limit)
            .sort({
                startDate: -1
            })
            .populate({
                path: 'createdBy',
                select: 'fullName batch studyProgramId profile'
            })
            .lean()
            .exec(function(err, events) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    if(studyProgramId != null){
                        var events = events.filter(function(event){
                            return event.createdBy.studyProgramId == studyProgramId;
                        });
                    }
                    var options = {
                        path: 'createdBy.studyProgramId',
                        model: 'StudyProgram'
                    };
                    var events = events.slice(skip, skip+pageOptions.limit);
                    mongoose.model('Event').populate(events, options, function (err, events) {
                        res.json({
                            results: events,
                            page: pageOptions.page,
                            limit: pageOptions.limit,
                            total: total
                        });  
                    });       
                }
        });
    })
    //POST a new Event
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        upload(req,res,function(err) {
            var title= req.body.title,
                place = req.body.place,
                latitude = req.body.latitude,
                longitude = req.body.longitude,
                startDate = req.body.startDate,
                endDate = req.body.endDate,
                startTime = req.body.startTime,
                endTime = req.body.endTime,
                description = req.body.description,
                contact = req.body.contact,
                price = req.body.price,
                picture = '',
                createdBy = req.body.createdBy;
            if(req.file != undefined){
                fs.readFile(req.file.path, function (err, data){
                    if(err) {
                        res.send("There was a problem adding the information to the database " + err);
                    }
                });
                picture = req.file.filename;
            } 
            //call the create function for our database
            mongoose.model('Event').create({
                title: title,
                place: place,
                latitude: latitude,
                longitude: longitude,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                description: description,
                contact: contact,
                price: price,
                picture: picture,
                createdBy: createdBy
            }, function(err, event) {
                if (err) {
                    res.json({
                        message: 'There was a problem adding the information to the database ' + err,
                        isSuccess: false
                    });
                } else {
                    //Event has been created
                    res.json({
                        message: 'Insert successfull',
                        item: event,
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
    mongoose.model('Event').findById(id, function(err, Event) {
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
            //console.log(Event);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('Event')
            .findById(req.id)
            .populate('createdBy',{ fullName: 1, batch: 1, studyProgramId: 1, profile: 1})
            .lean()
            .exec(function(err, vacancy) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    var options = {
                        path: 'createdBy.studyProgramId',
                        model: 'StudyProgram',
                        select: 'name'
                    };
                    mongoose.model('Vacancy').populate(vacancy, options, function (err, event) {
                        res.json(event); 
                    });    
                }
            });
    })
    //DELETE a Event by ID
    .delete(passport.authenticate('jwt', { session: false }),function(req, res) {
        //find Event by ID
        mongoose.model('Event').findById(req.id, function(err, Event) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                Event.remove(function(err, event) {
                    if (err) {
                        res.json({
                            message: 'There was a problem adding the information to the database ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: event,
                            isSuccess: true
                        });
                    }
                });
            }
        });
    })
    //PUT to update a Event by ID
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        upload(req,res,function(err) {
            var title= req.body.title,
                place = req.body.place,
                latitude = req.body.latitude,
                longitude = req.body.longitude,
                startDate = req.body.startDate,
                endDate = req.body.endDate,
                startTime = req.body.startTime,
                endTime = req.body.endTime,
                description = req.body.description,
                contact = req.body.contact,
                price = req.body.price,
                picture = '';
            if(req.file != undefined){
                fs.readFile(req.file.path, function (err, data){
                    if(err) {
                        res.json({
                            message: 'There was a problem updating the information to the database: ' + err,
                            isSuccess: false
                        });
                    }
                });
                picture = req.file.filename;
            }
                     
            // find the document by ID
            mongoose.model('Event').findById(req.id, function(err, Event) {
                //update it
                Event.update({
                    title: title,
                    place: place,
                    latitude: latitude,
                    longitude: longitude,
                    startDate: startDate,
                    endDate: endDate,
                    startTime: startTime,
                    endTime: endTime,
                    description: description,
                    contact: contact,
                    price: price,
                    picture: picture == '' ?  Event.picture : picture
                }, function(err, event) {
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


module.exports = router;