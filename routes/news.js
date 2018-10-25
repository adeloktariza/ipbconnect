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
            callback(null, './public/uploads/news/');
        },
        filename: function (req, file, callback) {
            var ext = file.originalname.split('.').pop();
            callback(null, 'news-' + Date.now()+ chanceString.string({length: 5, pool: 'abcdefghijklmn'}) + '.' + ext);
        }
    }),
    upload = multer({ storage : storage}).array('photos',30),
    fs = require('fs'),
    moment = require('moment');

var chanceString = new chance();
var passport = require("passport");


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
      mongoose.model('News').count({},function(err, result){
          total = result;
          pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
          if(skip >= total){
              res.json({
                  message: 'No more content in page ' + pageOptions.page + '!',
                  isSuccess: false
              });
          } else {
              mongoose.model('News')
              .find()
              .populate({
                  path: 'createdBy',
                  select: 'fullName profile.photo',
              })
              .sort({created: 'desc'})
              .limit(pageOptions.limit)
              .skip(skip)
              .lean()
              .exec(function(err, news){
                  for(var i = 0; i<news.length; i++){
                      news[i].created = moment(news[i].created).fromNow();
                  }
                  res.json({
                      total: total,
                      page: pageOptions.page,
                      items: news
                  });
              });
          }      
      });
  })
  .post(passport.authenticate('jwt', {session: false}), function(req, res){
      upload(req,res,function(err) {
        var title = req.body.title,
            photos = [],
            createdBy = req.body.createdBy,
            content = req.body.content;
        if(req.files != undefined){
            for(var i = 0; i<req.files.length; i++){
                photos.push(req.files[i].filename);
            }
        }
        if(req.files.length == 0){
            res.json({
                message: 'Photo is Required',
                isSuccess: false
            });
        } else{
            mongoose.model('News').create({
                title : title,
                photos : photos,
                createdBy : createdBy,
                created: new Date(),
                content: content,
                totalComment: 0
            }, function(err, news){
                if(err){
                    res.json({
                              message: 'There was a problem adding the information to the database ' + err,
                              isSuccess: false
                          });  
                } else{
                    res.json({ 
                          message: 'Insert successfull',
                          item: news,
                          isSuccess : true
                      });
                }
            });
        }
        
    });
});

router.param('id', function(req, res, next, id){
    mongoose.model('News').findById(id, function(err, news){
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
        mongoose.model('News').findById(req.id)
        .lean()
        .populate({
            path: 'createdBy',
            select: 'fullName profile.photo'
        })
        .populate({
            path: 'comments',
            populate: {
                path: 'createdBy',
                select: 'fullName profile.photo'
            }
        })
        .lean()
        .exec(function(err, result){
            result.created = moment(result.created).fromNow();
            result.comments.sort(function(n1, n2){
                return n1.created - n2.created;
            });
            for(var i = 0; i < result.comments.length; i++){
                result.comments[i].created = moment(result.comments[i].created).fromNow();
            }
            res.json(result);
        })
    })
    .put(passport.authenticate('jwt', {session: false}), function(req, res){
        upload(req, res, function(err){
            var photos = [];
          //var j = req.files.length;
          if(req.files != undefined){
              for(var i = 0; i < req.files.length; i++){
                  photos.push(req.files[i].filename);
              }
          }
            mongoose.model('News').findById(req.id, function(err, result){
                if(result == undefined){
                    res.json({
                        message: 'id error!'
                    })
                } else {
                    result.update({
                        title: req.body.title,
                        content: req.body.content,
                        photos: photos.length == 0 ? result.photos : photos,
                        createdBy: req.body.createdBy
                    }, function(err){
                        if(err){
                            res.json({
                                message: 'error ' + err,
                                isSuccess: false
                            });
                        } else{
                            res.json({
                                message: 'Update successfull!',
                                isSuccess: true,
                            });
                        }
                    })
                }
            });
        })

    })
    .delete(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('News').findById(req.id, function(err, result){
            if(result == undefined){
                res.json({
                    message: 'id null!',
                    isSuccess: false
                });
            } else{
                result.remove(function(err){
                    if(err){
                        res.json({
                            isSuccess: false,
                            message: 'error ' + err
                        });
                    } else{
                        res.json({
                            message: 'Delete successfull',
                            isSuccess: true
                        });
                    }
                });
            }
        });
    });

router.route('/comment/:id')
    .post(passport.authenticate('jwt', {session: false}), function(req, res){
        mongoose.model('News').findById(req.id, function(err, result){
            if(err){
                res.json({
                    message: 'error ' + err,
                    isSuccess: false
                });
            } else{
                var comments = [];
                comments = result.comments;
                comments.push({
                    value: req.body.comment,
                    createdBy: req.body.createdBy,
                    created: new Date()
                });
                result.update({
                    totalComment: ++result.totalComment,
                    comments: comments
                }, function(err){
                    if(err){
                        res.json({
                            message: 'error ' + err,
                            isSuccess: false
                        });
                    } else {
                        res.json({
                            message: 'Add coment successfull',
                            isSuccess: true
                        });
                    }
                });
            }
        });
    });
module.exports = router;