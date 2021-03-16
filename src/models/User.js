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
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [e => validator.isEmail(e)]
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: null,
            validate: [i => i == null || validator.isBase64(i)]
        },
        tokens: [
            {
                type: String,
                required: true
            }
        ]
    },
    { timestamps: true }
);
schema.plugin(uniqueValidator);

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
schema.methods.generateToken = function () {
    const TOKEN_COUNT_LIMIT = 10;
    const user = this;

    const token = newToken(user);
    user.tokens.push(token);
    if (user.tokens.length > TOKEN_COUNT_LIMIT)
        user.tokens.shift();

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
    return obj;
};

const model = Mongoose.model("user", schema);
module.exports = model;
