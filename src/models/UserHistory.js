const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const noContentNeeded = ['ENTER', 'EXIT'];
const contentNeeded = ['CLICK', 'LIKE'];
const eventTypes = [...contentNeeded, ...noContentNeeded];

const schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: [true, "{PATH} is required"]
        },
        content: {
            type: Schema.Types.ObjectId,
            ref: 'content',
            required: [function (c) { return contentNeeded.includes(this.eventType); }, 'url is required'],
        },
        eventType: {
            type: String,
            enum: eventTypes,
            required: true
        },
        extra: {
            req: { type: Object }
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
schema.index({ "createdAt": -1 });

schema.pre("save", async function (next) {
    if (this.isNew)
        if (noContentNeeded.includes(this.eventType)) this.content = undefined;
    next();
});

schema.methods.toJSON = function () {
    var obj = this.toObject();
    if (typeof this.content == "object") {
        const contentFields = ['domain', 'tag'];
        contentFields.forEach(field => obj[field] = this.content[field]);
    }
    delete obj.content;
    //delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    delete obj._id;
    delete obj.id;
    delete obj.extra;
    delete obj.user;
    return obj;
};

const model = Mongoose.model("userHistory", schema);
module.exports = model;