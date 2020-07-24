var mongoose = require('mongoose');
var bcryptjs = require('bcryptjs');

var Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isSuperUser: {
            type: Boolean,
            default: false
        }
    }
);

userSchema.pre("save", async function(next) {
    try {
        const user = this;
        if(!this.isModified("password")) {
            next();
        }
        let password = await bcryptjs.hash(user.password, 10);
        user.password = password;

        next();
    } catch(errors) {
        return next(errors);
    }
});

userSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this.username;
    });

module.exports = mongoose.model('User', userSchema);