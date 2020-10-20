const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.resolve(__dirname, './../.data');

lib.create = function(dir, file, data, callback) {
  const targetPath = `${lib.baseDir}/${dir}/${file}.json`;

  const stringData = JSON.stringify(data);

  fs.writeFile(targetPath, stringData, {flag: 'wx'}, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error writing to file');
    }
  })
}

lib.read = function(dir, file, callback) {
  const targetPath = `${lib.baseDir}/${dir}/${file}.json`;

  fs.readFile(targetPath, 'utf8', function(err, data) {
    callback(err, data);
  })
}

lib.update = function(dir, file, data, callback) {
  const targetPath = `${lib.baseDir}/${dir}/${file}.json`;

  const stringData = JSON.stringify(data);

  fs.writeFile(targetPath, stringData, {flag: 'r+'}, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error updating file');
    }
  })
}

lib.delete = function(dir, file, callback) {
  const targetPath = `${lib.baseDir}/${dir}/${file}.json`;

  fs.unlink(targetPath, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  })
}

module.exports = lib;
