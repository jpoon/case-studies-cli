var gitConfig = require("git-config"),
    moment = require("moment"),
    _ = require("lodash");

function Menu() {

    this.mainMenu = [
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: [
                { name: "Create New Case Study", value: "case-study" },
            ],
        },
    ];

    this.subMenuCaseStudy = [
        {
            type: "input",
            name: "title",
            message: "Title",
            validate: function(val) {
                return !(val === null || val.length === 0);
            },
        },
        {
            type: "input",
            name: "author",
            message: "Author",
            default: function() {
                var done = this.async();
                gitConfig(function(err, config) {
                    var author;
                    if (!err) author = config.user.name;
                    done(author);
                });
            },
        },
        {
            type: "input",
            name: "authorLink",
            message: "Author Website",
            validate: function(val) {
                return !(val === null || val.length === 0);
            },
        },
        {
            type: "input",
            name: "authorImage",
            message: "Author Image",
            default: function() {
                var done = this.async();
                gitConfig(function(err, config) {
                    var author;
                    if (!err) author = config.user.name;
                    if (author) author = '/images/authors/' + _.camelCase(author) + ".png";
                    done(author);
                });
            },
        },
        {
            type: "input",
            name: "image",
            message: "Cover Image",
        },
        {
            type: "input",
            name: "date",
            message: "Date",
            default: function() { return moment().format("YYYY-MM-DD hh:mm:ss"); },
        },
        {
            type: "input",
            name: "tags",
            message: "Tags",
            validate: function(val) {
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
            validate: function(val) {
                return !(val === null || val.length === 0);
            },
        },
        {
            type: "input",
            name: "codeResources",
            message: "Code Resources",
        },
    ];
}

module.exports = new Menu();
