const Mongoose = require("mongoose");
const { AppError } = require("../helpers/AppError");
const Schema = Mongoose.Schema;
const schema = new Schema(
  {
    domain: {
      type: String,
      required: [true, "url is require field"],
    },
    path: {
      type: String,
      required: [true, "url is require field"],
    },
    title: {
      type: String,
      required: [true, "title is require field"],
    },
    des: {
      type: String,
      required: [true, "description is require field"],
    },
    image: {
      type: String,
      required: [true, "image is require field"],
    },
  },
  { timestamps: true }
);

// methods

schema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.__v;
  delete obj._id;
  delete obj.path;
  delete obj.domain;
  obj.url = obj.domain + obj.path;
  return obj;
};

const model = Mongoose.model("content", schema);
module.exports = model;
