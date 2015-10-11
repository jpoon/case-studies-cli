var fs = require('fs'),
    path = require('path');

function FileHelper() {}

FileHelper._upOneLevel = function(directory) {
    if (directory === path.resolve('/')) return null;
    return path.dirname(directory);
};

FileHelper._findRecurseHelper = function(directory, name, isFile) {
    if (directory === null) return;

    var filePath = path.join(directory, name);

    try {
        var stats = fs.statSync(filePath);

        if (isFile) {
            if (stats.isFile()) return filePath;
        } else {
            if (stats.isDirectory()) return filePath;
        }
    } catch (err) { }

    return this._findRecurseHelper(this._upOneLevel(directory), name);
};

FileHelper.find = function (name, isFile) {
    if (!name) throw new Error('name is required');
    isFile = typeof isFile !== 'undefined' ? isFile : true;

    return this._findRecurseHelper(process.cwd(), name, isFile);
};

FileHelper.read = function (path) {
    return fs.readFileSync(path, 'utf8');
};

FileHelper.write = function (path, data) {
    fs.writeFile(path, data, 'utf8');
};

FileHelper.createDirectory = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

module.exports = FileHelper;
