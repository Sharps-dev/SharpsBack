const fs = require("fs");
class Logger {
  constructor() {
    this.date = Date.now();
    this.path = "./" + this.date + ".log";
    this.file = fs.createWriteStream(this.path);
  }
  writeFile(data) {
    data += "\n";
    this.file.write(data);
  }
  offWriter() {
    this.file.end();
  }

  customFunction(cb) {
    return cb(writeFile);
  }
}
module.exports = Logger;
