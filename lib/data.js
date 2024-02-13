// Dependencies

const fs = require("fs");
const path = require("path");

const dataLib = {};

dataLib.baseDir = path.join(__dirname, "../.data");

// write data to fi

dataLib.create = (file, data, callBack) => {
  fs.open(`${dataLib.baseDir}/${file}.json`, "wx", (err, fileDescripter) => {
    if (!err && fileDescripter) {
      const jsonDa5a = JSON.stringify(data);
      fs.writeFile(fileDescripter, jsonDa5a, (err) => {
        if (!err) {
          fs.close(fileDescripter, (err) => {
            if (!err) {
              callBack(null, { message: "Successfully create the file" });
            } else {
              callBack({ error: "Error closing file" }, nulll);
            }
          });
        } else {
          callBack({ error: "Error happend writting on file" }, null);
        }
      });
    } else {
      callBack({ error: "File may already exist" }, null);
    }
  });
};

dataLib.read = (file, callBack) => {
  const filePath = `${dataLib.baseDir}/${file}.json`;
  fs.readFile(filePath, "utf-8", (err, data) => {
    callBack(err, data);
  });
};

dataLib.update = (file, data, callBack) => {
  const filePath = `${dataLib.baseDir}/${file}.json`;

  fs.open(filePath, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const jsonData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.write(fileDescriptor, jsonData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callBack(null, { message: "File successfully updated" });
                } else {
                  callBack({ error: "Failled to write on file" }, null);
                }
              });
            }
          });
        } else {
          callBack({ error: "Can not trunkate the file" }, null);
        }
      });
    } else {
      callBack({ error: "FIle not exist" }, null);
    }
  });
};

dataLib.deleteFile = (file, callBack) => {
  const filePath = `${dataLib.baseDir}/${file}.json`;
  fs.unlink(filePath, (err) => {
    if (!err) {
      callBack(null, { message: "File successfully edited" });
    } else {
      callBack({ error: "Error deleting the file" }, null);
    }
  });
};

module.exports = dataLib;
