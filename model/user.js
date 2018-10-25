var mongoose = require('mongoose');

var Schema = mongoose.Schema.Types,
    ObjectId = Schema.ObjectId; 
var userSchema = new mongoose.Schema({ 
    password: {type: String, required: true}, 
    fullName: {type: String, required: true},
    gender: {type: String, required: true},
    batch: Number,
    dateOfBirth: {type: Date, required: true},
    nim: String,
    email: {
        type: String, 
        required: true
    },
    studyProgramId: { type: ObjectId, ref: 'StudyProgram' ,sparse: true, required: true},
    profile:{
        photo: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        mobileNumber: {
            type: String,
            default: ""
        },
        currentJob: {
            type: String,
            default: ""
        },
        interest: {
            type: String,
            default: ""
        },
        hobby: {
            type: String,
            default: ""
        },
        maritalStatus: {
            type: String,
            default: ""
        },
        latitude: {
            type: String,
            default: ""
        },
        longitude: {
            type: String,
            default: ""
        }
    },
    isVerified: Boolean,
    isAdmin: Boolean,
    userType: {type: String, required: true},
    created: Date,
    modified: Date
}, { versionKey: false });

userSchema.pre("save", true, function(next, done) {
    var self = this;
    mongoose.models["User"].findOne({email: self.email}, function(err, user) {
        if(err) {
            done(err);
        } else if(user) {
            self.invalidate("email", "email must be unique");
            done(new Error("email must be unique"));
        } else {
            done();
        }
    });
    next();
});
mongoose.model('User', userSchema);