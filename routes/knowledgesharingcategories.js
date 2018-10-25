//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com

var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST


var passport = require("passport");

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
		mongoose.model('KnowledgeSharingCategory')
			.find()
	        .populate({
	            path: 'createdBy',
	            select: 'fullName batch studyProgramId profile'
	        })
	        .lean()
	        .exec(function(err, news){
	            res.json(news);
	        });
	})
	.post(passport.authenticate('jwt', {session: false}), function(req, res){
		var name = req.body.name,
			createdBy = req.body.createdBy;

		mongoose.model('KnowledgeSharingCategory').create({
			name: name,
			createdBy: createdBy,
			created: new Date()
		}, function(err, KnowledgeSharingCategory){
			if(err){
				res.json({
					message: 'There was a problem adding the information to the database ' + err,
                    isSuccess: false
				});
			} else{
				res.json({
                    message: 'Insert successfull',
                    item: KnowledgeSharingCategory,
                    isSuccess : true
                });
			}
		});
	});


//middleware buat validasi :id
router.param('id', function(req, res, next, id){
	mongoose.model('KnowledgeSharingCategory').findById(id, function(err, KnowledgeSharingCategory){
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
    .get(passport.authenticate('jwt', { session: false }),function(req, res) {
        mongoose.model('KnowledgeSharingCategory').findById(req.id, function(err, KnowledgeSharingCategory) {
            if (err) {
                res.json('GET Error: There was a problem retrieving: ' + err);
            } else {
                res.json(KnowledgeSharingCategory);
            }
        });
    })
    .put(passport.authenticate('jwt', {session: false}), function(req, res){
    	var name = req.body.name,
    		createdBy = req.body.createdBy;

    	mongoose.model('KnowledgeSharingCategory').findById(req.id, function(err, KnowledgeSharingCategory) {
            if (err) {
                res.json('GET Error: There was a problem retrieving: ' + err);
            } else {
                KnowledgeSharingCategory.update({
                	name: name,
                	createdBy: createdBy
                }, function(err, knowledgeSharingCategory){
                	if(err){
                		res.json({
                			messages: 'error ' + err,
                			isSuccess: false
                		});
                	} else{
                		res.json({
                			isSuccess: true,
                			item: KnowledgeSharingCategory
                		});
                	}
                });
            }
        });
    })
    .delete(passport.authenticate('jwt', {session: false}), function(req, res){
    	mongoose.model('KnowledgeSharingCategory').findById(req.id, function(err, KnowledgeSharingCategory) {
            if (KnowledgeSharingCategory == undefined) {
                res.json({
                    message: 'error: ' + err
                });
            } else {
                KnowledgeSharingCategory.remove(function(err, knowledgeSharingCategory){
                	if(err){
                		res.json({
                			message: 'error ' + err,
                			isSuccess: false
                		});
                	} else{
                		res.json({
                			message: 'Delete successfull',
                			isSuccess: true,
                			item: KnowledgeSharingCategory
                		});
                	}
                });
            }
        });
    });

module.exports = router;