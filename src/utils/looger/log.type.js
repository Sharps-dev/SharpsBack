const Logger = require("./index");
const looger = Logger();

const checkTypesUser = (input) => {
  data = input.userId + " " + input.type + " " + input.date + " " + input.methodType + "";
  looger.writeFile(data);
};

module.exports = checkTypesUser;
