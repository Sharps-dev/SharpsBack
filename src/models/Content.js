const Mongoose = require("mongoose");
const validUrl = require("valid-url");
const { AppError } = require("../helpers/AppError");
const Schema = Mongoose.Schema;
const schema = new Schema(
  {
    longUrl: {
      type: String,
      require: [true, "url is require field"],
    },
    title: {
      type: String,
      require: [true, "title is require field"],
    },
    des: {
      type: String,
      require: [true, "description is require field"],
    },
    image: {
      type: String,
      require: [true, "image is require field"],
    },
  },
  { timestamps: true }
);

// methods
schema.pre("save", async function (next) {
  try {
    const content = this;
    if (content.isModified("longUrl") && !validUrl.isUri(content.longUrl)) next(new AppError("enter valid url", 400));
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});
schema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  delete obj._id;
  return obj;
};

const model = Mongoose.model("content", schema);
module.exports = model;
