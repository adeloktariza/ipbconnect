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
  // usually this would be a database call:
  // var user = users[_.findIndex(users, {id: jwt_payload.id})];
  // if (user) {
  //   next(null, user);
  // } else {
  //   next(null, false);
  // }
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
//this will be accessible from http://127.0.0.1:3000/vacancies if the default route for / is left unchanged
router.route('/')
    //GET all vacancies
    .get(passport.authenticate('jwt', { session: false }),function(req, res, next) {
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {};
        
        //Check jobLocationId Param
        var query = req.query.jobLocationId;
        if(query != null && query != undefined && query != ''){
            if(mongoose.Types.ObjectId.isValid(query))
                param.jobLocationId = query;
            else{
                res.json({
                    error: "Object ID is not valid"
                });
                return;
            }
        }
        
        //Check title Param
        query = req.query.title; 
        if(query != null && query != undefined && query != '')
            param.title = new RegExp(query, 'i');

        query = req.query.salaryMin; 
        if(query != null && query != undefined && query != '')
            param.salaryMin = {$gte: Number(query)};

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
        
         //Add param close date
        query = req.query.filterCloseDate;
        if(query != null && query != undefined && query != '' && query == '1'){
            param.closeDate = {$gte: new Date().withoutTime()};
        }

        var skip = (pageOptions.page-1)*pageOptions.limit;
        var total = 0;
        mongoose.model('Vacancy').find(param).count({}, function(err , count){
            total = count;
        });
        //retrieve all vacancies from Mongo
        mongoose.model('Vacancy')
            .find(
                param
            )
            .skip(skip)
            .limit(pageOptions.limit)
            .sort({
                created: -1
            })
            .populate('jobLocationId')
            .populate('createdBy',{ fullName: 1, batch: 1, studyProgramId: 1, profile: 1})
            .lean()
            .exec(function(err, vacancies) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    var options = {
                        path: 'createdBy.studyProgramId',
                        model: 'StudyProgram'
                    };
                    mongoose.model('Vacancy').populate(vacancies, options, function (err, vacancies) {
                        // var modifiedVacancies = vacancies.reduce(function(prev,curr){
                        //     var modified = {
                        //         jobLocationName: curr.jobLocationId.name, 
                        //         jobLocationId: curr.jobLocationId._id
                        //     }
                        //     return prev.concat(Object.assign(curr, modified))
                        // },[]);
                        res.json({
                            results: vacancies,
                            page: pageOptions.page,
                            limit: pageOptions.limit,
                            total: total
                        }); 
                    });    
                }
        });
    })
    //POST a new Vacancy
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var title= req.body.title,
            company = req.body.company,
            closeDate = req.body.closeDate,
            email = req.body.email,
            subject = req.body.subject,
            companyProfile = req.body.companyProfile,
            jobQualification = req.body.jobQualification,
            jobDescription = req.body.jobDescription,
            salaryMax = req.body.salaryMax,
            salaryMin = req.body.salaryMin,
            jobLocationId = req.body.jobLocationId,
            file = req.body.file,
            address = req.body.address,
            createdBy = req.body.createdBy;
        //call the create function for our database
        mongoose.model('Vacancy').create({
            title: title,
            subject: subject,
            company: company,
            closeDate: closeDate,
            email: email,
            companyProfile: companyProfile,
            jobQualification: jobQualification,
            jobDescription: jobDescription,
            salaryMax: salaryMax,
            salaryMin: salaryMin,
            jobLocationId: jobLocationId,
            file: file,
            address: address,
            created: new Date(),
            createdBy: createdBy
        }, function(err, Vacancy) {
            if (err) {
                res.json({
                    message: 'There was a problem adding the information to the database ' + err,
                    isSuccess: false
                });
            } else {
                //Vacancy has been created
                res.json({
                    message: 'Insert successfull',
                    item: Vacancy,
                    isSuccess: true
                });
            }
        })
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Vacancy').findById(id, function(err, Vacancy) {
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
            //console.log(Vacancy);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});

router.route('/:id')
    .get(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('Vacancy')
        .findById(req.id) 
        .populate('jobLocationId',{name: 1})
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
                mongoose.model('Vacancy').populate(vacancy, options, function (err, vacancy) {
                   res.json(vacancy); 
                });    
            }
        });
    })
    //DELETE a Vacancy by ID
    .delete(passport.authenticate('jwt', { session: false }),function(req, res) {
        //find Vacancy by ID
        mongoose.model('Vacancy').findById(req.id, function(err, Vacancy) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                Vacancy.remove(function(err, vacancy) {
                    if (err) {
                        res.json({
                            message: 'There was a problem adding the information to the database ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: Vacancy,
                            isSuccess: true
                        });
                    }
                });
            }
        });
    })
    //PUT to update a Vacancy by ID
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var title= req.body.title,
            subject = req.body.subject,
            company = req.body.company,
            closeDate = req.body.closeDate,
            email = req.body.email,
            subject = req.body.subject,
            companyProfile = req.body.companyProfile,
            jobQualification = req.body.jobQualification,
            jobDescription = req.body.jobDescription,
            salaryMax = req.body.salaryMax,
            salaryMin = req.body.salaryMin,
            jobLocationId = req.body.jobLocationId,
            file = req.body.file,
            address = req.body.address;

        //find the document by ID
        mongoose.model('Vacancy').findById(req.id, function(err, Vacancy) {
            //update it
            Vacancy.update({
                title: title,
                subject: subject,
                company: company,
                closeDate: closeDate,
                email: email,
                companyProfile: companyProfile,
                jobQualification: jobQualification,
                jobDescription: jobDescription,
                salaryMax: salaryMax,
                salaryMin: salaryMin,
                jobLocationId: jobLocationId,
                file: file,
                address: address,
            }, function(err, VacancyID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    res.json({
                        message: 'Update successfull',
                        item: Vacancy,
                        isSuccess: true
                    });
                }
            })
        });
    });


module.exports = router;