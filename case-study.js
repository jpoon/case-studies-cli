#!/usr/bin/env node

var inquirer = require("inquirer"),
    moment = require("moment"),
    path = require("path"),
    colors = require('./lib/cli-color'),
    FileHelper = require('./lib/file-helper'),
    Menu = require('./lib/menu');

var FindPath = function(name, isFile) {
    var filePath = FileHelper.find(name, isFile);
    if (!filePath) {
        console.log(colors.warn("Unable to find the '" + name + "'"));
    }

    return filePath;
};

console.log('\n----------------------------------'.silly);
console.log(' Partner Catalyst. Case Study CLI.');
console.log('----------------------------------\n'.silly);


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
                    'date: ' + caseStudy.date,
                    'categories: ' + caseStudy.categories,
                    'color: ' + caseStudy.color,
                    'excerpt: ' + caseStudy.excerpt,
                    '---'
                ].join('\n');

                console.log("\nCreating...");

                // create images folder
                var imageFolder = path.join(imagesParentDir, postName);
                FileHelper.createDirectory(imageFolder);
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