const mongoose = require("mongoose");
const { dbUrl } = require("../config");

module.exports = async () => {
  const url = dbUrl;
  console.log("Database connected"); // to ", url);
  mongoose.Promise = global.Promise;
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);
  await mongoose.connect(url);
};
