var gulp         = require('gulp'),
    config       = require('../config'),
    webshot      = require('webshot'),
    validUrl     = require('valid-url'),
    argv         = require('yargs').argv,
    gulpSequence = require('gulp-sequence'),
    winston      = require('winston'),
    fs           = require('fs');

var respStatus = {
    ok:{
        code:0,
        message:config.tasks.webshot.successMessage
    },
    error:{
        code:1,
        message:config.tasks.webshot.errorMessage
    },
    urlError:{
        code:2,
        message:config.tasks.webshot.invalidUrlMessage
    }
}

winston.add(winston.transports.File, {filename: config.tasks.webshot.destPathRoot + 'custom-log.log'});

var optionsObj = function(viewportType){
    return {
        url : argv.url,
        imageName: config.tasks.webshot.destPathRoot + viewportType + '-' + config.tasks.webshot.viewports[viewportType].width + 'x' + config.tasks.webshot.viewports[viewportType].height + '.png',
        opt: {
            defaultWhiteBackground: true,
            screenSize: {
                width: config.tasks.webshot.viewports[viewportType].width,
                height: config.tasks.webshot.viewports[viewportType].height
            },
            shotSize: {
                width: 'window',
                height: 'all'
            }
        }
    }
}
var isValidUrl = function(url){
    return url && validUrl.isUri(url);
}
var takeScreenShot = function(type, callback) {
    var options = optionsObj(type);

    if (isValidUrl(options.url)) {
        webshot(
            options.url,
            options.imageName,
            options.opt,
            function(err) {
                /*if (err){
                    return winston.log('info', respStatus.error);;
                }
                return winston.log('info', respStatus.ok);*/

                if (callback) {
                    callback(err);
                }
            }
        );
    }
    else {
        //return winston.log('info', respStatus.urlError);

        if (callback) {
            callback();
        }
    }
}

/*gulp.task('phoneScreenShot', function() {
    takeScreenShot('phone');
})
gulp.task('tabletScreenShot', function() {
    takeScreenShot('tablet');
});
gulp.task('desktopScreenShot', function() {
     takeScreenShot('desktop');
});*/

gulp.task('default', function(cb){
    //gulpSequence('phoneScreenShot', 'tabletScreenShot', 'desktopScreenShot')(cb);

    generatePhoneScreenshot();
});

function generatePhoneScreenshot() {
    //winston.log('info', "generatePhoneScreenshot");

    takeScreenShot('phone', generateTabletScreenshot);
}

function generateTabletScreenshot(phoneError) {
    //winston.log('info', "generateTabletScreenshot");

    if (phoneError) {
        //winston.log('info', "phoneError happened");

        return winston.log('info', respStatus.error);
    } else {
        takeScreenShot('tablet', generateDesktopScreenshot);
    }
}

function generateDesktopScreenshot(tabletError) {
    //winston.log('info', "generateDesktopScreenshot");

    if (tabletError) {
        //winston.log('info', "tabletError happened");

        return winston.log('info', respStatus.error);
    } else {
        takeScreenShot('desktop', finalEndpoint);
    }
}

function finalEndpoint(desktopError) {
    //winston.log('info', "finalEndpoint");

    if (desktopError) {
        //winston.log('info', "desktopError happened");

        return winston.log('info', respStatus.error);
    } else {
        //winston.log('info', "all went ok");

        console.log(respStatus.ok);
    }
}
