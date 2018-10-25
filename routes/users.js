var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'), //used to manipulate POST
    bcrypt   = require('bcrypt-nodejs'),
    multer = require('multer'),
    chance = require('chance'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/uploads/profile/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'profile-' + Date.now() + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}).single('photo'),
    fs = require('fs');

var helper = require('sendgrid').mail;

var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'ipbconnect';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  //console.log('payload received', jwt_payload);
  //onsole.log(jwt_payload.id);

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

var app = express();
app.use(passport.initialize());

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({
    extended: true,
}))
router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

//build the REST operations at the base for Users
//this will be accessible from http://127.0.0.1:3000/users if the default route for / is left unchanged
router.route('/')
    //GET all users
    .get(passport.authenticate('jwt', { session: false }), function(req, res, next) {
        //retrieve all users from Mongo
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {};
        
        //Check name Param
        var query = req.query.fullName; 
        if(query != null && query != undefined && query != '') 
            param.fullName = new RegExp(query, 'i');

        //Check batch Param
        query = req.query.batch; 
        if(query != null && query != undefined && query != '')
            param.batch = query;
        
        //Check batch Param
        query = req.query.studyProgramId; 
        if(query != null && query != undefined && query != ''){
            if(mongoose.Types.ObjectId.isValid(query))
                param.studyProgramId = query;
            else{
                res.json({
                    error: "Object ID is not valid"
                });
                return;
            }
        }

        //Check NIM
        query = req.query.nim; 
        if(query != null && query != undefined && query != '')
            param.nim = new RegExp(query, 'i');

        //Check Email
        query = req.query.email; 
        if(query != null && query != undefined && query != '')
            param.email = new RegExp(query, 'i');

        //Check isVerified Verified
        query = req.query.isVerified; 
        if(query != null && query != undefined && query != '')
            param.isVerified = Boolean(parseInt(query));

        query = req.query.isAdmin; 
        if(query != null && query != undefined && query != '')
            param.isAdmin = Boolean(parseInt(query));

        var skip = (pageOptions.page-1)*pageOptions.limit;
        var total = 0;
        mongoose.model('User').find(param).count({}, function(err , count){
            total = count;
        });
        mongoose.model('User')
            .find(
                param
            )
            .select('-password')
            .skip(skip)
            .limit(pageOptions.limit)
            .sort({
                created: -1
            })
            .populate('studyProgramId',{ name: 1 })
            .lean()
            .exec(function(err, Users) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    res.json({
                        results: Users,
                        page: pageOptions.page,
                        limit: pageOptions.limit,
                        total: total
                    });      
                }
            })
    })

    //POST a new User
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
            fullName = req.body.fullName,
            gender = req.body.gender,
            batch = req.body.batch,
            dateOfBirth = req.body.dateOfBirth,
            nim = req.body.nim,
            email = req.body.email,
            studyProgramId = req.body.studyProgramId,
            isVerified = req.body.isVerified,
            userType = req.body.userType,
            isAdmin = false;
        //call the create function for our database
        mongoose.model('User').create({
            password: password,
            plainPassword: req.body.password,
            fullName: fullName,
            gender: gender,
            batch: batch,
            dateOfBirth: dateOfBirth,
            nim: nim,
            email: email,
            studyProgramId: studyProgramId,
            isVerified:isVerified,
            isAdmin:isAdmin,
            userType: userType,
            created: new Date()
        }, function(err, User) {
            if (err) {
                res.json({
                    message: 'There was a problem adding the information to the database: '+ err,
                    isSuccess: false
                });
            } else {
                var options = {
                    path: 'studyProgramId',
                    model: 'StudyProgram',
                    select: 'name'
                };
                mongoose.model('User').populate(User, options, function (err, User) {
                    res.json({
                        message: 'Insert successfull',
                        item: User,
                        isSuccess: true
                    }); 
                });
                from_email = new helper.Email("info@ipb-connect.com");
                to_email = new helper.Email(User.email);
                subject = "IPB-Connect - Thanks for register";
                content = new helper.Content("text/plain", "Thank you for register, Your account is not verified now. Wait for your friend or admin to verify your account.");
                mail = new helper.Mail(from_email, subject, to_email, content);
                var sg = require('sendgrid')('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');
                var request = sg.emptyRequest({
                    method: 'POST',
                    path: '/v3/mail/send',
                    body: mail.toJSON()
                });

                sg.API(request, function(error, response) {
                    console.log(response.statusCode);
                    console.log(response.body);
                    console.log(response.headers);
                }); 
            }
        })
    });

router.route('/count-batch')
    //GET all users
    .get(passport.authenticate('jwt', { session: false }), function(req, res, next) {
        mongoose.model('User')
        .aggregate([
            { $match: { isVerified: true } },
            { $group: { _id: {batch: '$batch'}, count: { $sum: 1 } } }
        ]).exec(function(err, result) {
            if (err) {
                res.status(500).json(err); return;
            } else {
                res.json({
                    results: result,
                });      
            }
        })
    })

router.route('/count')
    //GET all users
    .get(passport.authenticate('jwt', { session: false }),function(req, res, next) {
        var param = {};
        
        //Check study program Param
        var query = req.query.studyProgramId; 
        if(query != null && query != undefined && query != ''){
            if(mongoose.Types.ObjectId.isValid(query))
                param.studyProgramId = query;
            else{
                res.json({
                    error: "Object ID is not valid"
                });
                return;
            }
        }

        param.isVerified = true;
        
        var total = 0;
        mongoose.model('User').find(param).count({}, function(err , count){
            total = count;
        });
        mongoose.model('User')
            .find(
                param
            )
            .lean()
            .exec(function(err, users) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    var genderL,genderP,alumni,mahasiswa;
                    genderL = genderP = alumni = mahasiswa = 0;
                    for (var i = 0; i < users.length; i++) {
                        if(users[i].gender == 'L')
                            ++genderL;
                        else if(users[i].gender == 'P')
                            ++genderP;
                        
                        if(users[i].userType == 'Alumni')
                            ++alumni;
                        else if(users[i].userType == 'Mahasiswa')
                            ++mahasiswa;
                    }
                    var gender = {
                        l: genderL,
                        p: genderP
                    };
                    var userType = {
                        alumni: alumni,
                        mahasiswa: mahasiswa
                    };
                    var countDetail = {
                        gender: gender,
                        userType: userType
                    };
                    res.json({
                        results: countDetail,
                        total: total
                    });      
                }
            })
    })

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('User').findById(id, function (err, User) {
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
        mongoose.model('User')
            .findById(req.id)
            .select('-password')
            .populate('studyProgramId',{ name: 1 })
            .exec(function(err, user) {
                if (err) {
                    console.log('GET Error: There was a problem retrieving: ' + err);
                } else {
                    res.json(user);
                }
            });
    })
    
    //DELETE a User by ID
    .delete(passport.authenticate('jwt', { session: false }),function(req, res) {
        //find User by ID
        mongoose.model('User').findById(req.id, function(err, User) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                User.remove(function(err, User) {
                    if (err) {
                        res.json({
                            message: 'There was a problem updating the information to the database: ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: User,
                            isSuccess: true
                        });
                    }
                });
            }
        });
    });

router.route('/academic/:id')
    //PUT to update a User by ID
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var fullName = req.body.fullName,
            gender = req.body.gender,
            batch = req.body.batch,
            dateOfBirth = req.body.dateOfBirth,
            nim = req.body.nim,
            studyProgramId = req.body.studyProgramId,
            userType = req.body.userType;
        //find the document by ID
        mongoose.model('User').findById(req.id, function(err, User) {
            //update it
            User.update({
                fullName: fullName,
                gender: gender,
                batch: batch,
                dateOfBirth: dateOfBirth,
                nim: nim,
                studyProgramId: studyProgramId,
                userType: userType,
                modified: new Date()
            }, function(err, user) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Update successfull',
                        item: User,
                        isSuccess: true
                    });
                }
            })
        });
    })

router.route('/verified/:id')
    //PUT to update a User by ID
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('User').findById(req.id, function(err, User) {
            if(User==null){
                res.json({
                    message: 'User not found'
                });
                return;
            }
            //update it
            User.update({
                isVerified: true
            }, function(err, UserID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    from_email = new helper.Email("info@ipb-connect.com");
                    to_email = new helper.Email(User.email);
                    subject = "IPB-Connect Account verified now";
                    content = new helper.Content("text/plain", "Your Account is verified. Now, you can login in www.ipb-connect.com or m.ipb-connect.com");
                    mail = new helper.Mail(from_email, subject, to_email, content);
                    var sg = require('sendgrid')('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');
                    var request = sg.emptyRequest({
                      method: 'POST',
                      path: '/v3/mail/send',
                      body: mail.toJSON()
                    });

                    sg.API(request, function(error, response) {
                      console.log(response.statusCode);
                      console.log(response.body);
                      console.log(response.headers);
                    });

                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Verified user successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/unverified/:id')
    //PUT to update a User by ID
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('User').findById(req.id, function(err, User) {
            if(User==null){
                res.json({
                    message: 'User not found'
                });
                return;
            }
            //update it
            User.update({
                isVerified: false
            }, function(err, UserID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    from_email = new helper.Email("info@ipb-connect.com");
                    to_email = new helper.Email(User.email);
                    subject = "IPB-Connect Account not verified";
                    content = new helper.Content("text/plain", "Your account is not verified. Please Contact Your Friend for verifying your account.");
                    mail = new helper.Mail(from_email, subject, to_email, content);
                    console.log(process.env.SENDGRID_API_KEY);
                    var sg = require('sendgrid')('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');
                    var request = sg.emptyRequest({
                      method: 'POST',
                      path: '/v3/mail/send',
                      body: mail.toJSON()
                    });

                    sg.API(request, function(error, response) {
                      console.log(response.statusCode);
                      console.log(response.body);
                      console.log(response.headers);
                    });

                    res.json({
                        message: 'Unverified user successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/change-password/:id')
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var oldPass = req.body.oldPass,
            newPass = req.body.newPass;
        
        mongoose.model('User')
            .findById(req.id)
            .exec(function(err, User) {
                if (User == null){
                    res.json({
                        isSuccess: false,
                        message: 'User not found',
                        errorCode : 1
                    });
                    return;
                }

                if (bcrypt.compareSync(oldPass, User.password)){
                    User.update({
                        password: bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null),
                        modified: new Date()
                    }, function(err, user) {
                        if (err) {
                            res.send("There was a problem updating the information to the database: " + err);
                        } else {
                            //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                            res.json({
                                isSuccess: true,
                                message: 'Change password successfull'
                            });
                        }
                    })
                }else{
                    res.json({
                        isSuccess: false,
                        message: 'Old Password is wrong',
                        errorCode : 2
                    });
                }
            });
    });

router.route('/change-password/:id/admin')
    .put(passport.authenticate('jwt', { session: false }),function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var newPass = req.body.newPass;
        
        mongoose.model('User')
            .findById(req.id)
            .exec(function(err, User) {
                if (User == null){
                    res.json({
                        isSuccess: false,
                        message: 'User not found',
                        errorCode : 1
                    });
                    return;
                }
                User.update({
                    password: bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null),
                    modified: new Date()
                }, function(err, user) {
                    if (err) {
                        res.send("There was a problem updating the information to the database: " + err);
                    } else {
                        //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                        res.json({
                            isSuccess: true,
                            message: 'Change password successfull'
                        });
                    }
                })
            });
    });

router.route('/setadmin/:id')
    //PUT to update a User by ID
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('User').findById(req.id, function(err, User) {
            if(User==null){
                res.json({
                    message: 'User not found'
                });
                return;
            }
            //update it
            User.update({
                isAdmin: true
            }, function(err, UserID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    from_email = new helper.Email("info@ipb-connect.com");
                    to_email = new helper.Email(User.email);
                    subject = "IPB-Connect - You are admin of IPB-Connect now";
                    content = new helper.Content("text/plain", "Now you are admin of IPB-Connect. You can access panel.ipb-connect.com");
                    mail = new helper.Mail(from_email, subject, to_email, content);
                    var sg = require('sendgrid')('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');
                    var request = sg.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: mail.toJSON()
                    });
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Set User as Admin successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/unsetadmin/:id')
    //PUT to update a User by ID
    .post(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('User').findById(req.id, function(err, User) {
            if(User==null){
                res.json({
                    message: 'User not found'
                });
                return;
            }
            //update it
            User.update({
                isAdmin: false
            }, function(err, UserID) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    from_email = new helper.Email("info@ipb-connect.com");
                    to_email = new helper.Email(User.email);
                    subject = "IPB-Connect - Your admin access revoked";
                    content = new helper.Content("text/plain", "Your admin access has been revoke. Contact another admin for detail");
                    mail = new helper.Mail(from_email, subject, to_email, content);
                    var sg = require('sendgrid')('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');
                    var request = sg.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: mail.toJSON()
                    });
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Unset User as Admin successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });

router.route('/login')
    //POST a new User
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var password = req.body.password,
            email = req.body.email,
            tempPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

        mongoose.model('User')
            .findOne({ email:  email })
            .populate('studyProgramId',{ name: 1 })
            .exec(function(err, user) {
                if (user == null){
                    res.json({
                        isSuccess: false,
                        message: 'Email not registered',
                        errorCode : 1
                    });
                    return;
                }

                if (! user.isVerified){
                    res.json({
                        isSuccess: false,
                        message: 'User not verified',
                        errorCode : 3
                    });
                    return;
                }
                if (bcrypt.compareSync(password, user.password)){
                    var payload = {id: user.id};
                    //var token = jwt.sign(payload, jwtOptions.secretOrKey, {expiresIn: '10000m'});
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.json({
                        isSuccess: true,
                        message: 'Login successfull',
                        item: user,
                        token: token
                    });
                }else{
                    res.json({
                        isSuccess: false,
                        message: 'Email or Password Incorrect',
                        errorCode : 2
                    });
                }
                
            });
    });


router.route('/forgotpassword')
    .post(function (req, res) {
        var email = req.body.email;
        console.log(email);
        mongoose.model('User')
            .findOne({ email : email })
            .exec(function(err, user){
                if(user == null){
                    res.json({
                        errorCode : 1,
                        message : 'Email is not registered',
                        isSuccess : false
                    });
                } else {
                    chanceString = new chance();
                    var newPass = chanceString.string({length:6});
                    user.update({
                        password : bcrypt.hashSync(newPass, bcrypt.genSaltSync(8), null)
                    }, function(err){
                        if(err){
                            res.json({
                                isSuccess : false,
                                message : 'There was a problem updating the information to the database: ' + err
                            });
                        } else{
                            from_email = new helper.Email("info@ipb-connect.com");
                            to_email = new helper.Email(user.email);
                            subject = "IPB Connect - Forgot Password";
                            content = new helper.Content("text/plain", "This is your new password: " + newPass + ". Please change the password soon!");
                            mail = new helper.Mail(from_email, subject, to_email, content);
                            var sg = require('sendgrid')('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');
                            var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: mail.toJSON()
                            });

                            sg.API(request, function(error, response) {
                                console.log(response.statusCode);
                                console.log(response.body);
                                console.log(response.headers);
                            });
                            res.json({
                                email : user.email,
                                message : 'Please check you inbox/spam for the password',
                                isSuccess : true
                            });
                        }
                    });
                }
            });
    });


router.route('/loginadmin')
    //POST a new User
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var password = req.body.password,
            email = req.body.email;

        mongoose.model('User')
            .findOne({ email:  email })
            .populate('studyProgramId',{ name: 1 })
            .exec(function(err, user) {
                if (user == null){
                    res.json({
                        isSuccess: false,
                        message: 'Email not registered',
                        errorCode : 1
                    });
                    return;
                }

                if (! user.isVerified){
                    res.json({
                        isSuccess: false,
                        message: 'User not verified',
                        errorCode : 3
                    });
                    return;
                }

                if (! user.isAdmin){
                    res.json({
                        isSuccess: false,
                        message: 'User is not admin',
                        errorCode : 3
                    });
                    return;
                }

                if (bcrypt.compareSync(password, user.password)){
                    var payload = {id: user.id};
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.json({
                        isSuccess: true,
                        message: 'Login successfull',
                        item: user,
                        token: token
                    });
                }else{
                    res.json({
                        isSuccess: false,
                        message: 'Email or Password Incorrect',
                        errorCode : 2
                    });
                }
                
            });
    });

//PROFILES
router.route('/profiles/:id')
    .get(passport.authenticate('jwt', { session: false }), function(req, res) {
        var query = mongoose.model('User').findById(req.id).select({ "profile": 1, "_id": 0});
        query.exec(function (err, user) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {                    
                res.json(user.profile);
            }
        });
    })
    //PUT to update a User by ID
    .put(passport.authenticate('jwt', { session: false }), function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var profile = {
            address: req.body.address,
            mobileNumber: req.body.mobileNumber,
            currentJob: req.body.currentJob,
            interest: req.body.interest,
            hobby: req.body.hobby,
            maritalStatus: req.body.maritalStatus,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        };

        //find the document by ID
        mongoose.model('User').findById(req.id, function(err, User) {
            //update 
            if(User.profile.photo != undefined)
                profile.photo = User.profile.photo;
                
            User.update({
                profile: profile
            }, function(err, profile) {
                if (err) {
                    res.json({
                        message: 'There was a problem updating the information to the database: ' + err,
                        isSuccess: false
                    });
                } else {
                    res.json({
                        message: 'Update profile successfull',
                        isSuccess: true
                    });
                }
            })
        });
    });




//PROFILES
router.route('/profiles/upload/:id')
    .post(function (req, res, next) {
        upload(req,res,function(err) {
            var photo = ''; 
            if(req.file != undefined){
                fs.readFile(req.file.path, function (err, data){
                    if(err) {
                        return res.end("Error uploading file.");
                    }
                });
                photo = req.file.filename;
            }
                
            mongoose.model('User').findById(req.id,function (err, user){
                if (err) {
                    console.log('GET Error: There was a problem retrieving: ' + err);
                } else {
                    var profile = user.profile;
                    profile.photo = photo == '' ? user.profile.photo : photo;
                    user.update({
                        profile: profile
                    }, function(err, profile) {
                        if (err) {
                            res.json({
                                message: 'There was a problem updating the information to the database: ' + err,
                                isSuccess: false
                            });
                        } else {
                            res.json({
                                photo: photo,
                                message: 'Change photo successfull',
                                isSuccess: true
                            });
                        }
                    })
                }
            });
        });
    });






module.exports = router;