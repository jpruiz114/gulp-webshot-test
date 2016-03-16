var gulp = require('gulp');

var winston = require('winston');

var argv = require('yargs').argv;

var validUrl = require('valid-url');

var screenshot = require('url-to-screenshot');

var fs = require('fs');

var config = require("./config.json");
//console.dir(config);

var screenshotsPath = config["screenshots-path"];
//console.log("screenshotsPath" + " = " + screenshotsPath);

var extension = config["extension"];
//console.log("extension" + " = " + extension);

winston.add(winston.transports.File, {filename: 'custom-log.log'});

/**
 *
 * @param url
 * @param width
 * @param height
 */
function createScreenshot(url, width, height, alias) {
    screenshot(url).width(width).height(height).capture(
        function(err, img) {
            if (err) {
                throw err;
            }

            fs.writeFileSync(__dirname + screenshotsPath + alias + extension, img);
        }
    );
}

gulp.task(
    'default',
    function() {
        //console.dir(argv);

        var url = argv.url;

        if (url === undefined) {
            winston.log('info', 'You must indicate the url');
        } else {
            winston.log('info', 'url' + ' = ' + url);

            if (validUrl.isUri(url)){
                winston.log('info', 'URL is valid');

                var sizeForDesktop = {width: config.resolutions.desktop["width"], height: config.resolutions.desktop["height"]};
                var sizeForTablet = {width: config.resolutions.tablet["width"], height: config.resolutions.tablet["height"]};
                var sizeForMobile = {width: config.resolutions.mobile["width"], height: config.resolutions.mobile["height"]};

                createScreenshot(url, sizeForDesktop.width, sizeForDesktop.height, "desktop");
                createScreenshot(url, sizeForTablet.width, sizeForTablet.height, "tablet");
                createScreenshot(url, sizeForMobile.width, sizeForMobile.height, "mobile");
            } else {
                winston.log('info', 'URL is not valid');
            }
        }
    }
);
