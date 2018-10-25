//Created By Unggul Arlin Wiryanto
//email: arlinunggul@gmail.com

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
    var fileSize = require("file-size");
    const getPageCount = require('docx-pdf-pagecount');


//Copy and pasted from method-override
router.use(bodyParser.urlencoded({
    extended: true
}));

/*router.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));*/

router.route('/')
.get(passport.authenticate('jwt',{session: false}), function(req, res){

    var pageOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 6
    }
    var skip;
    var total = 0;
    mongoose.model('KnowledgeSharing').count({},function(err, result){
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing')
            .find()
            .select('createdBy title cover totalLike created likers bookmarks fileSize totalSlide')
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'likers',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .sort({created: 'desc'})
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                var len = results.length;
                var counter = 0;
                for(counter; counter<len; counter++){
                    results[counter].created = moment(results[counter].created).fromNow();
                }
                res.json({
                    total: total,
                    page: pageOptions.page,
                    items: results
                });
            });
        }
    });
})
.post(passport.authenticate('jwt', {session: false}), upload.fields([{
    name: 'file'
}, {
    name: 'cover'
}]), function(req, res){
    var pptFile = req.files.file;
    var converter = require('office-converter')();
    var pdfPath = '';
    var coverFile = '';
    var totalSlide = 0;

    //ppt->pdf
    converter.generatePdf('./public/uploads/knowledgesharing/'+pptFile[0].filename, function(err, result) {
        // Process result if no error
        if (result.status === 0) {
            pdfPath = result.outputFile;
            console.log('Output File located at ' + result.outputFile);

            //filesize
            const file = fs.statSync('./public/uploads/knowledgesharing/'+pptFile[0].filename);

            //totalSlide
            getPageCount(pdfPath)
            .then(pages => {
                //console.log(pages);
                totalSlide = pages;
                console.log('totalSlide: ' + totalSlide);

                //pdf->png
                var PDFImage = require("pdf-image").PDFImage;
                var pdfImage = new PDFImage(pdfPath);
                console.log('path konversi: ' + pdfPath);
                pdfImage.convertPage(0).then(function (imagePath) {
                    console.log('imagePath: ' + imagePath);
                    coverFile = pptFile[0].filename.substr(0, pptFile[0].filename.indexOf('.')) + '-0.png';
                    //fs.unlink(pdfPath);
                    mongoose.model('KnowledgeSharing').create({
                        title: req.body.title,
                        description: req.body.description,
                        category: req.body.category,      
                        file: pptFile[0].filename,
                        fileSize: fileSize(file.size).human('jedec'),
                        totalSlide: totalSlide,
                        cover: coverFile,
                        createdBy: req.body.createdBy,
                        created: new Date(),
                        totalLike: 0,
                        totalComment:  0
                    }, function(err, knowledgesharing){
                        //console.log(fs.statSync("pptFile[0].filename").size);
                        if(err){
                            res.json({
                                message: 'There was a problem adding the information to the database ' + err,
                                isSuccess: false
                            });
                        } else{
                            res.json({
                                message: 'Insert successfull',
                                item: knowledgesharing,
                                isSuccess: true
                            });
                        }
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });        
});

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

router.route('/popular')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').count({},function(err, result){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing').find()
            .sort({totalLike: 'desc'})
            .select('createdBy title cover totalLike created likers bookmarks fileSize totalSlide')
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'likers',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                var len = results.length;
                var counter = 0;
                for(counter; counter<len; counter++){
                    results[counter].created = moment(results[counter].created).fromNow();
                    if(counter==len-1){
                        res.json({
                            total: total,
                            page: pageOptions.page,
                            items: results
                        });
                    }
                }
            });
        }    
    });
});


router.route('/search')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').count({
        title: {$regex: new RegExp('.*' + req.query.q.toLowerCase(), 'i')}
    }, function(err, result){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing')
            .find({'title': {$regex: new RegExp('.*' + req.query.q.toLowerCase(), 'i')}})
            .select('createdBy title cover totalLike created category fileSize totalSlide')
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'category',
                select: 'name'
            })
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                for(var i = 0; i < results.length; i++){
                    results[i].created = moment(results[i].created).fromNow();
                }
                res.json({
                    total: total,
                    page: pageOptions.page,
                    items: results
                });
            });
        }
    });
});

router.route('/:id')
.get(passport.authenticate('jwt', { session: false }),function(req, res) {
    mongoose.model('KnowledgeSharing').findById(req.id)
    .populate({
        path: 'category',
        select: 'name'
    })
    .populate({
        path: 'createdBy',
        select: 'fullName batch studyProgramId profile.photo profile.currentJob',
        populate:{
            path: 'studyProgramId',
            select: 'name'
        }
    })
    .populate({
        path: 'bookmarks',
        populate: {
            path: 'createdBy',
            select: 'fullName'
        }
    })
    .populate({
        path: 'comments',
        populate: {
            path: 'createdBy replies',
            select: 'fullName profile.photo',
            populate: {
                path: 'createdBy',
                select: 'fullName profile.photo'
            }
        }
    })
    .populate({
        path: 'likers',
        populate: {
            path: 'createdBy',
            select: 'fullName'
        }
    })
    .lean()
    .exec(function(err, knowledgesharing) {
        if (knowledgesharing == undefined) {
            res.json({
                message: 'GET Error: There was a problem retrieving: ' + err,
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing').count({
                createdBy: knowledgesharing.createdBy
            },function(err, result){
                knowledgesharing.createdBy.uploadedKnowledgeSharing = result;
                mongoose.model('KnowledgeSharing').find({category: knowledgesharing.category._id})
                .sort({totalLike: 'desc'})
                .select('title cover totalLike createdBy')
                .populate({
                    path: 'createdBy',
                    select: 'fullName profile.photo'
                })
                .exec(function(err, recommendeds){
                    knowledgesharing.comments.sort(function(m1, m2){
                        return m1.created - m2.created
                    });
                    knowledgesharing.recommendedContent = recommendeds;
                    knowledgesharing.created = moment(knowledgesharing.created).fromNow();
                    for(var i = 0; i<knowledgesharing.comments.length; i++){
                        knowledgesharing.comments[i].created = moment(knowledgesharing.comments[i].created).fromNow();
                        if(knowledgesharing.comments[i].replies.length > 0){
                            knowledgesharing.comments[i].replies.sort(function(n1, n2){
                                return n1.created - n2.created;
                            });
                            for(var j = 0; j < knowledgesharing.comments[i].replies.length; j++){
                                knowledgesharing.comments[i].replies[j].created = moment(knowledgesharing.comments[i].replies[j].created).fromNow();
                            }
                        }
                    }
                    res.json(knowledgesharing);
                })
            });
        }
    });
})
.put(passport.authenticate('jwt', {session: false}), upload.fields(
    [{
        name: 'file'
    }, {
        name: 'cover'
    }]
    ), function(req, res){
    console.log(req.files.file);
    var pptFile = '',
    coverFile = '';

    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{

            if(req.files.file != undefined){
                var converter = require('office-converter')();
                var pdfPath = '',
                pngPath = '';
                pptFile = req.files.file[0].filename;
                converter.generatePdf('./public/uploads/knowledgesharing/'+pptFile, function(err, result) {
                    // Process result if no error
                    if (result.status === 0) {
                        pdfPath = result.outputFile;
                        console.log('Output File located at ' + result.outputFile);
                    }

                    //pdf->png
                    var PDFImage = require("pdf-image").PDFImage;
                    var pdfImage = new PDFImage(pdfPath);
                    console.log('path konversi: ' + pdfPath);
                    pdfImage.convertPage(0).then(function (imagePath) {
                        // 0-th page (first page) of the slide.pdf is available as slide-0.png 
                        fs.existsSync("./public/uploads/knowledgesharing/"+ pngPath); // => true 
                    });
                    coverFile = pptFile.substr(0, pptFile.indexOf('.')) + '-0.png';
                    fs.unlink(pdfPath);

                    knowledgesharing.update({
                        title: req.body.title,
                        description: req.body.description,
                        category: req.body.category,      
                        cover: coverFile == ''? knowledgesharing.cover : coverFile,
                        file: pptFile == ''? knowledgesharing.file : pptFile,
                        createdBy: req.body.createdBy,
                    }, function(err, knowledgesharing){
                        if(err){
                            res.json({
                                message: 'There was a problem updating the information to the database: ' + err,
                                isSuccess: false
                            });
                        } else{
                            res.json({
                                message: 'Update successfull',
                                isSuccess: true
                            });
                        }
                    });
                });
            } else{
                knowledgesharing.update({
                    title: req.body.title,
                    description: req.body.description,
                    category: req.body.category,      
                    cover: coverFile == ''? knowledgesharing.cover : coverFile,
                    file: pptFile == ''? knowledgesharing.file : pptFile,
                    createdBy: req.body.createdBy,
                }, function(err, knowledgesharing){
                    if(err){
                        res.json({
                            message: 'There was a problem updating the information to the database: ' + err,
                            isSuccess: false
                        });
                    } else{
                        res.json({
                            message: 'Update successfull',
                            isSuccess: true
                        });
                    }
                });
            }


        }

    });
})
.delete(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            knowledgesharing.remove(function(err, KnowledgeSharing){
                if(err){
                    res.json({
                        message: 'error ' + err,
                        isSuccess: false
                    })
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

router.route('/category/:id')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').find({category: req.id}).count(function(err, result){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing')
            .find({category: req.id})
            .select('createdBy title cover totalLike created likers bookmarks fileSize totalSlide')
            .sort({created: 'desc'})
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'likers',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                if(err){
                    res.json({
                        message: 'error ' + err
                    });
                } else{
                    var len = results.length;
                    var counter = 0;
                    for(counter; counter<len; counter++){
                        results[counter].created = moment(results[counter].created).fromNow();
                        if(counter==len-1){
                            res.json({
                                total: total,
                                page: pageOptions.page,
                                items: results
                            });
                        }
                    }
                }
            });
        }
    });
});

router.route('/likers/:id')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing')
    .findById(req.id)
    .populate({
        path: 'likers',
        populate: {
            path: 'createdBy',
            select: 'fullName profile.photo'
        }
    })
    .exec(function(err, results){
        if(results == undefined){
            res.json({
                message: 'null',
                isSuccess: false
            });
        } else{
            res.json(results.likers);
        }
    });
});

router.route('/like/:id')
.post(passport.authenticate('jwt', {session: false}), function(req, res){
    var createdBy = req.body.createdBy;
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var likers = knowledgesharing.likers;
            var totalLike = ++knowledgesharing.totalLike;
            likers.push({
                createdBy: createdBy,
                created: new Date()
            });
            knowledgesharing.update({
                totalLike: totalLike,
                likers: likers
            }, function(err){
                if(err){
                    res.json({
                        message: 'error ' + err 
                    })
                } else{
                    res.json({
                        message: 'Like successfull',
                        isSuccess: true
                    });
                }

            });
        }
    })
});

router.route('/unlike/:id')
.post(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var likers = knowledgesharing.likers;
            var totalLike = --knowledgesharing.totalLike;

            var likers = likers.filter(function(obj){
                return obj.createdBy != req.body.createdBy;
            });

            knowledgesharing.update({
                likers: likers,
                totalLike: totalLike
            }, function(err){
                if(err){
                    res.json({
                        message: 'error ' + err
                    })
                } else{
                    res.json({
                        message: 'Unlike successfull',
                        isSuccess: true
                    });
                }
            })
        }
    });
});

router.route('/comment/:id')
.get(passport.authenticate('jwt', {session: false}), function(req, res){
    var pageOptions = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 6
    }
    var skip;
    var total = 0;
    mongoose.model('KnowledgeSharing').findById(req.id).
    populate({
        path: 'comments',
        populate: {
            path: 'createdBy replies',
            select: 'fullName profile.photo',
            populate: {
                path: 'createdBy',
                select: 'fullName profile.photo'
            }
        }
    })
    .populate({
        path: 'createdBy',
        select: 'fullName profile.photo'
    })
    .lean()
    .exec(function(err, knowledgesharing){
        total = knowledgesharing.comments.length;
        console.log(knowledgesharing.comments.length);
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
            if(skip >= total){
                res.json({
                    message: 'No more content in page ' + pageOptions.page + '!',
                    isSuccess: false
                });
            } else {
                knowledgesharing.comments = knowledgesharing.comments.slice(skip, skip+pageOptions.limit);
                knowledgesharing.comments.sort(function(m1, m2){
                    return m1.created - m2.created;
                });
                for(i = 0; i<knowledgesharing.comments.length; i++){
                    knowledgesharing.comments[i].created = moment(knowledgesharing.comments[i].created).fromNow();
                    if(knowledgesharing.comments[i].replies.length > 0){
                        knowledgesharing.comments[i].replies.sort(function(n1, n2){
                            return n1.created - n2.created;
                        });
                        for(var j = 0; j < knowledgesharing.comments[i].replies.length; j++){
                            knowledgesharing.comments[i].replies[j].created = moment(knowledgesharing.comments[i].replies[j].created).fromNow();
                        }
                    }
                }
                res.json({
                    title: knowledgesharing.title,
                    createdBy: knowledgesharing.createdBy,
                    created: moment(knowledgesharing.created).fromNow(),
                    totalComment: knowledgesharing.totalComment,
                    comments: knowledgesharing.comments
                });
            }
            
        }
    });
})
.post(passport.authenticate('jwt', {session: false}), function(req,res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var comments = knowledgesharing.comments;
            var comment = {
                value: req.body.comment,
                createdBy: req.body.createdBy,
                created: new Date(),
                totalReply: 0
            }
            comments.push(comment);
            knowledgesharing.update({
                comments: comments,
                totalComment: ++knowledgesharing.totalComment
            }, function(err){
                if(err){
                    res.json({
                        message: 'error ' + err
                    })
                } else{
                    res.json({
                        message: 'Add Comment Success',
                        isSuccess: true
                    });
                }
            });
        }
    })
})
.delete(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else {

            var comments = knowledgesharing.comments.filter(function(obj){
                return obj._id != req.body.commentID;
            });
            knowledgesharing.update({
                comments: comments,
                totalComment: --knowledgesharing.totalComment
            }, function(err){
                if(err){
                    res.json({
                        message: 'error ' + err
                    })
                } else{
                    res.json({
                        message: 'Delete comment success',
                        isSuccess: true
                    });
                }
            })   
        }
    });
});

router.route('/comment/reply/:id')
.post(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var createdBy = req.body.createdBy,
            commentId = req.body.commentId,
            replyValue = req.body.comment,
            comments = knowledgesharing.comments;

            var comment = comments.filter(function(obj){
                return obj._id == commentId
            })[0];
            if(comment == undefined){
                res.json({
                    message: 'comment null',
                    isSuccess: false
                });
            } else{
                ++comment.totalReply;
                comment.replies.push({
                    value: replyValue,
                    createdBy: createdBy,
                    created: new Date()
                });
                
                knowledgesharing.update({
                    comments: comments,
                }, function(err){
                    if(!err){
                        res.json({
                            message: 'Reply successfull!',
                            isSuccess: true
                        });
                    } 
                });
            }

        }
    });
});

router.route('/uploaded')
.post(passport.authenticate('jwt', {session: false}), function(req, res){
    mongoose.model('KnowledgeSharing').find({
        createdBy: req.body.creator
    })
    .count(function(err, result){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing')
            .find({
                createdBy: req.body.creator
            })
            .sort({created: 'desc'})
            .select('createdBy title cover totalLike created likers bookmarks description fileSize totalSlide')
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .populate({
                path: 'likers',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                if(err){
                    res.json({
                        message: 'error ' + err
                    });
                } else{
                    var len = results.length;
                    var counter = 0;
                    for(counter; counter<len; counter++){
                        results[counter].created = moment(results[counter].created).fromNow();
                        if(counter==len-1){
                            res.json({
                                total: total,
                                page: pageOptions.page,
                                items: results
                            });
                        }
                    }
                }
            });
        }
    });
});

router.route('/bookmark')
.post(passport.authenticate('jwt', {session: false}), function(req, res){
    var createdBy = req.body.user;
    mongoose.model('KnowledgeSharing').find({"bookmarks.createdBy": createdBy})
    .count(function(err, result){
        var pageOptions = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 6
        }
        var skip;
        var total = 0;
        total = result;
        pageOptions.page == 1 ? skip = 0 : skip = (pageOptions.page-1)*pageOptions.limit;
        if(skip >= total){
            res.json({
                message: 'No more content in page ' + pageOptions.page + '!',
                isSuccess: false
            });
        } else {
            mongoose.model('KnowledgeSharing')
            .find({
                "bookmarks.createdBy": createdBy
            })
            .select('createdBy title cover totalLike created likers bookmarks fileSize totalSlide')
            .populate({
                path: 'createdBy',
                select: 'fullName profile.photo'
            })
            .populate({
                path: 'likers',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .populate({
                path: 'bookmarks',
                populate: {
                    path: 'createdBy',
                    select: 'fullName'
                }
            })
            .limit(pageOptions.limit)
            .skip(skip)
            .lean()
            .exec(function(err, results){
                if(err){
                    res.json({
                        message: 'error ' + err
                    });
                } else{
                    var len = results.length;
                    var counter = 0;
                    for(counter; counter<len; counter++){
                        for(var i = 0; i<results[counter].bookmarks.length; i++){
                            if(results[counter].bookmarks[i].createdBy._id == createdBy){
                                results[counter].bookmarkDate = results[counter].bookmarks[i].created;
                            }
                        }
                        results[counter].created = moment(results[counter].created).fromNow();
                    }

                    results.sort(function(n1, n2){
                        return n2.bookmarkDate - n1.bookmarkDate;
                    });

                    for(var i = 0; i < results.length; i++){
                        results[i].bookmarkDate = moment(results[i].bookmarkDate).fromNow();
                    }

                    res.json({
                        total: total,
                        page: pageOptions.page,
                        items: results
                    });
                }
            });
        }
    })
});

router.route('/bookmark/:id')
.post(passport.authenticate('jwt', {session: false}), function(req,res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var createdBy = req.body.createdBy;
            var bookmarks = knowledgesharing.bookmarks;
            bookmarks.push({
                createdBy: createdBy,
                created: new Date()
            });
            knowledgesharing.update({
                bookmarks: bookmarks
            }, function(err){
                if(err){
                    res.json({
                        message: 'error: ' + err,
                        isSuccess: false
                    });
                } else{
                    res.json({
                        message: 'Bookmark successfull',
                        isSuccess: true
                    });
                }
            })
        }
    })
});

router.route('/unbookmark/:id')
.post(passport.authenticate('jwt', {session: false}), function(req,res){
    mongoose.model('KnowledgeSharing').findById(req.id, function(err, knowledgesharing){
        if(knowledgesharing == undefined){
            res.json({
                message: 'error: '+ err,
                isSuccess: false
            });
        } else{
            var createdBy = req.body.createdBy;
            var bookmarks = knowledgesharing.bookmarks;
            bookmarks = bookmarks.filter(function(obj){
                return obj.createdBy != req.body.createdBy;
            });
            knowledgesharing.update({
                bookmarks: bookmarks
            }, function(err){
                if(err){
                    res.json({
                        message: 'error: ' + err,
                        isSuccess: false
                    });
                } else{
                    res.json({
                        message: 'Unbookmark successfull',
                        isSuccess: true
                    });
                }
            });
        }
    })
});



module.exports = router;
