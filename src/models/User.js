const uniqueValidator = require("mongoose-unique-validator");
const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = Mongoose.Schema;
const newToken = require('../utils/jwt/newToken.js');

const schema = new Schema(
    {
        firstname: {
            type: String,
            trim: true
        },
        lastname: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [e => validator.isEmail(e), 'ایمیل نامعتبر است']
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null,
            validate: [i => i == null || validator.isBase64(i), "invalid base64 {PATH}"]
        },
        tokens: [
            {
                type: String,
                required: true
            }
        ],
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);
schema.plugin(uniqueValidator, { message: 'تکراری است {PATH}' });

// methods
schema.pre("save", async function (next) {
    try {
        const user = this;
        if (user.isModified("password")) {
            const hashPassword = await bcrypt.hash(user.password, 8);
            user.password = hashPassword;
        }
        next();
    } catch (e) {
        console.error(e);
        return next(e);
    }
});
schema.methods.checkPassword = async function (password) {
    try {
        const user = this;
        return await bcrypt.compare(password, user.password);
    } catch (e) {
        console.error(e);
        return next(e);
    }
};
schema.methods.generateToken = function (options) {
    const TOKEN_COUNT_LIMIT = 10;
    let saveToken = true;
    let expiresIn;
    if (options) {
        saveToken = options.saveToken;
        expiresIn = options.expiresIn;
    }
    const user = this;

    const token = newToken(user, expiresIn);

    if (saveToken) {
        user.tokens.push(token);
        if (user.tokens.length > TOKEN_COUNT_LIMIT)
            user.tokens.shift();
        user.save();
    }
    
    return token;
}
schema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    delete obj._id;
    delete obj.tokens;
    delete obj.isVerified;
    return obj;
};

const model = Mongoose.model("user", schema);
module.exports = model;
