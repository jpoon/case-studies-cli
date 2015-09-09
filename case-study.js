#!/usr/bin/env node

var inquirer = require("inquirer");
var moment = require("moment");
var path = require("path");
var gitConfig = require("git-config");
var FileHelper = require('./lib/file-helper');
var colors = require('./lib/cli-color');

var menu = [
    {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
            { name: "Create New Case Study", value: "case-study" },
        ],
    },
];

var caseStudyMenu = [
  {
      type: "input",
      name: "title",
      message: "Title",
      validate: function (val) {
          return !(val === null || val.length === 0);
      },
  },
  {
      type: "input",
      name: "author",
      message: "Author",
      default: function () {
          var done = this.async();
          gitConfig(function (err, config) {
              var author;
              if (!err) author = config.user.name;
              done(author);
          });
      },
  },
  {
      type: "input",
      name: "authorLink",
      message: "Author Link",
      default: "n/a",
  },
  {
      type: "input",
      name: "date",
      message: "Date",
      default: function () { return moment().format("YYYY-MM-DD hh:mm:ss"); },
  },
  {
      type: "input",
      name: "categories",
      message: "Categories",
      validate: function (val) {
          return !(val === null || val.length === 0);
      },
  },
  {
      type: "list",
      name: "color",
      message: "Color",
      choices: [
          { name: "blue" },
      ]
  },
  {
      type: "input",
      name: "excerpt",
      message: "Excerpt/Description",
      validate: function (val) {
          return !(val === null || val.length === 0);
      },
  },
];


console.log('\n----------------------------------'.silly);
console.log(' Partner Catalyst. Case Study CLI.');
console.log('----------------------------------\n'.silly);

inquirer.prompt(menu, function (resp) {
    switch (resp.action) {
        case "case-study":
            var postsDir = FileHelper.find('_posts', false);
            if (!postsDir) {
                console.log("\nUnable to find the '_posts' directory.".error);
                console.log("Are you executing the cli in the case-studies folder?".error);
                return;
            }
            
            var postTemplateFile = FileHelper.find('post-template.md');
            if (!postTemplateFile) {
                console.log("\nUnable to find the 'post-template.md' file.".error);
                console.log("Are you executing the cli in the case-studies folder?".error);
                return;
            }
            
            inquirer.prompt(caseStudyMenu, function (caseStudy) {
                var postTitle = moment(caseStudy.date).format("YYYY-MM-DD") + '-' + caseStudy.title.replace(/ +/g, '-') + '.md';

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

                var postContent = FileHelper.read(postTemplateFile);
                var postPath = path.join(postsDir, postTitle);
                FileHelper.write(postPath, postContent.replace(/---([\s\S]*)---/gmi, newHeader));

                console.log("\nCreated " + postPath.green);
            });
            break;

        default:
            console.log("Unsupported method.".error);
            break;
    }
});