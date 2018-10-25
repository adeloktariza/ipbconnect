var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

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

//build the REST operations at the base for Profiles
//this will be accessible from http://127.0.0.1:3000/profiles if the default route for / is left unchanged
router.route('/')
    //GET all profiles
    .get(function(req, res, next) {
        //retrieve all profiles from Mongo
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        }
        
        var param = {
            address: null
        }
        
        //Check Param
        var query = req.query.address; 
        if(query != null && query != undefined)
            param.address = new RegExp(query, 'i');
        else
            delete param.address;
        
        
        var skip = (pageOptions.page-1)*pageOptions.limit;
        var total = 0;
        mongoose.model('Profile').find(param).count({}, function(err , count){
            total = count;
        });
        mongoose.model('Profile')
            .find(
                param
            )
            .skip(skip)
            .limit(pageOptions.limit)
            .sort({
                created: -1
            })
            .lean()
            .exec(function(err, profiles) {
                if (err) {
                    res.status(500).json(err); return;
                } else {
                    res.json({
                        results: profiles,
                        page: pageOptions.page,
                        limit: pageOptions.limit,
                        total: total
                    });      
                }
        })
    })
    //POST a new Profile
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var profileId = req.body.profileId,
            photo = req.body.photo,
            address = req.body.address,
            mobileNumber = req.body.mobileNumber,
            currentJob = req.body.currentJob,
            interest = req.body.interest,
            hobby = req.body.hobby,
            maritalStatus = req.body.maritalStatus,
            location = req.body.location,
            latitude = req.body.latitude,
            longitude = req.body.longitude;
        //call the create function for our database
        mongoose.model('Profile').create({
            profileId : profileId,
            photo : photo,
            address : address,
            mobileNumber : mobileNumber,
            currentJob : currentJob,
            interest : interest,
            hobby : hobby,
            maritalStatus : maritalStatus,
            location : location,
            latitude : latitude,
            longitude : longitude,
            modified : new Date()
        }, function(err, profile) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                res.json({
                    message: 'Insert successfull',
                    item: profile
                });
            }
        })
    });

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Profile').findById(id, function (err, Profile) {
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
    .get(function(req, res) {
        console.log(req.id);
        mongoose.model('Profile').findById(req.id, function(err, profile) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                res.json(profile);
            }
        });
    })
    //PUT to update a Profile by ID
    .put(function(req, res) {
        // Get our REST or form values. These rely on the "name" attributes
        var profileId = req.body.profileId,
            photo = req.body.photo,
            address = req.body.address,
            mobileNumber = req.body.mobileNumber,
            currentJob = req.body.currentJob,
            interest = req.body.interest,
            hobby = req.body.hobby,
            maritalStatus = req.body.maritalStatus,
            location = req.body.location,
            latitude = req.body.latitude,
            longitude = req.body.longitude;
        //find the document by ID
        mongoose.model('Profile').findById(req.id, function(err, profile) {
            //update it
            profile.update({
                profileId : profileId,
                photo : photo,
                address : address,
                mobileNumber : mobileNumber,
                currentJob : currentJob,
                interest : interest,
                hobby : hobby,
                maritalStatus : maritalStatus,
                location : location,
                latitude : latitude,
                longitude : longitude,
                modified : new Date()
            }, function(err, profile) {
                if (err) {
                    res.send("There was a problem updating the information to the database: " + err);
                } else {
                    //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                    res.json({
                        message: 'Update successfull',
                        item: profile
                    });
                }
            })
        });
    })
    //DELETE a Profile by ID
    .delete(function(req, res) {
        //find Profile by ID
        mongoose.model('Profile').findById(req.id, function(err, profile) {
            if (err) {
                return console.error(err);
            } else {
                //remove it from Mongo
                Profile.remove(function(err, Profile) {
                    if (err) {
                        return console.error(err);
                    } else {
                        res.json({
                            message: 'Delete successfull',
                            item: profile
                        });
                    }
                });
            }
        });
    });
    
module.exports = router;