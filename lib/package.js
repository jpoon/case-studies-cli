var childProcess = require('child_process'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    Package;

Package = function() {};

Package.GetCurrentVersion = function() {
    return _.trim(require('./../package.json').version);
};

Package.GetLatestVersion = function() {
    var exec = Promise.promisify(childProcess.exec);
    return exec('npm show case-studies-cli version').then(function(latest) {
        return _.trim(latest[0]);
    }).catch(function(e) {
        //console.error(e);
    });
};

module.exports = Package;
