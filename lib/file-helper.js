var fs = require('fs'),
    path = require('path');

function file() {}

file.find = function (name, isFile) {
    if (!name) throw new Error('name is required');

    isFile = typeof isFile !== 'undefined' ? isFile : true;

    function upOneLevel(directory) {
        if (directory === path.resolve('/')) return null;
        return path.dirname(directory);
    }

    function findRecurseHelper(directory, name, isFile) {
        if (directory === null) return;

        var filePath = path.join(directory, name);

        try {
            var stats = fs.statSync(filePath);

            if (isFile) {
                if (stats.isFile()) return filePath;
            } else {
                if (stats.isDirectory()) return filePath;
            }
        } catch (err) {}

        return findRecurseHelper(upOneLevel(directory), name);
    }

    return findRecurseHelper(process.cwd(), name, isFile);
};

file.read = function(path) {
    return fs.readFileSync(path, 'utf8');
};

file.write = function(path, data) {
    fs.writeFile(path, data, 'utf8');
};

module.exports = file;