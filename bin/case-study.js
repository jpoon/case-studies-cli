#!/usr/bin/env node

var inquirer = require("inquirer"),
    moment = require("moment"),
    path = require("path"),
    colors = require('./../lib/cli-color'),
    FileHelper = require('./../lib/file-helper'),
    Package = require('./../lib/package'),
    Menu = require('./../lib/menu');

var FindPath = function(name, isFile, log) {
    log = typeof log !== 'undefined' ? log : true ;
    var filePath = FileHelper.find(name, isFile);
    if (!filePath && log) {
        console.log(colors.warn("Unable to find the '" + name + "'"));
    }

    return filePath;
};

var current = Package.GetCurrentVersion();
console.log('\n----------------------------------'.silly);
console.log(' Partner Catalyst. Case Study CLI.');
console.log(' v' + current);
console.log('----------------------------------\n'.silly);

Package.GetLatestVersion().then(function(latest) {
    if (latest && latest != current) {
        console.log(colors.warn("Warning: Running outdated CLI (latest: " + latest + ")"));
        console.log(colors.warn("Update using: 'npm install -g case-studies-cli'.\n"));
    }
}).finally(function() {
    inquirer.prompt(Menu.mainMenu, function (resp) {
        switch (resp.action) {
            case "case-study":
                var postsDir = FindPath('_posts', false);
                var postTemplateFile = FindPath('post-template.md');
                var imagesParentDir = FindPath('images', false);

                if (!postsDir || !postTemplateFile || !imagesParentDir) {
                    console.log(colors.error("Are you executing the cli in the case-studies folder?"));
                    return;
                }
                
                inquirer.prompt(Menu.subMenuCaseStudy, function (caseStudy) {
                    var postName = moment(caseStudy.date).format("YYYY-MM-DD") + '-' + caseStudy.title.replace(/ +/g, '-');

                    var newHeader =
                    [
                        '---',
                        'layout: post',
                        'title: ' + caseStudy.title,
                        'author: ' + caseStudy.author,
                        'author-link: ' + caseStudy.authorLink,
                        'author-image: ' + caseStudy.authorImage,
                        'image: ' + caseStudy.image,
                        'date: ' + caseStudy.date,
                        'tags: ' + caseStudy.tags,
                        'color: ' + caseStudy.color,
                        'excerpt: ' + caseStudy.excerpt,
                        'coderesources: ' + caseStudy.codeResources,
                        '---',
                        '\n'
                    ].join('\n');

                    console.log("\nValidating...");

                    // author image 
                    var authorImageFileName = caseStudy.authorImage.split("/").pop(); 
                    var authorImageFile = FindPath(authorImageFileName, true, false);
                    if (!authorImageFile) {
                        console.log(colors.warn("  Author image not found. Save an image to " + caseStudy.authorImage));

                        newHeader += 
                        [
                            '<!--',
                            '   To Do ',
                            '   * Save author image to ' + caseStudy.authorImage,
                            '-->',
                            '\n'
                        ].join('\n');
                    }

                    console.log("Creating...");

                    // create images folder
                    var imageFolder = path.join(imagesParentDir, postName);
                    FileHelper.createDirectory(imageFolder);

                    var imagePath = imageFolder.split(path.sep);

                    newHeader +=
                    [
                        '<!--',
                        '   Images',
                        '   * upload images to ' + imageFolder,
                        '     and reference them in the markdown like so:',
                        '           ![Picture]({{site.baseurl}}/' + imagePath.splice(-2).join('/') + '/example-picture.png',
                        '-->',
                        '\n'
                    ].join('\n');

                    console.log(colors.verbose("  Image Folder: ") + imageFolder);

                    // create post
                    var postContent = FileHelper.read(postTemplateFile);
                    var postPath = path.join(postsDir, postName + ".md");

                    FileHelper.write(postPath, postContent.replace(/---([\s\S]*)---/gmi, newHeader));
                    console.log(colors.verbose("  Post: ") + colors.italic(postPath));

                    console.log(colors.info("Done"));
                });
                break;

            default:
                console.log("Unsupported method.".error);
                break;
        }
    });
});
