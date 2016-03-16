var gulp = require('gulp');

var winston = require('winston');

var argv = require('yargs').argv;

var validUrl = require('valid-url');

var screenshot = require('url-to-screenshot');

var fs = require('fs');

winston.add(winston.transports.File, {filename: 'custom-log.log'});
//winston.remove(winston.transports.Console);

gulp.task(
	'default',
	function() {
		console.log('default task');
	}
);

gulp.task(
	'hello',
	function() {
		console.log('Hello from gulp');
	}
);

gulp.task(
	'test-log',
	function() {
		winston.log('info', 'This is a test log');
	}
);

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

			fs.writeFileSync(__dirname + '/shots/' + alias + '.png', img);
		}
	);
}

gulp.task(
	'test-log-input',
	function() {
		//console.dir(argv);

		var url = argv.url;

		if (url === undefined) {
			winston.log('info', 'You must indicate the url');
		} else {
			winston.log('info', 'url' + ' = ' + url);

			if (validUrl.isUri(url)){
				winston.log('info', 'URL is valid');

				var sizeForDesktop = {width: 1280, height: 1024};
				var sizeForTablet = {width: 1024, height: 768};
				var sizeForMobile = {width: 480, height: 320};

				createScreenshot(url, sizeForDesktop.width, sizeForDesktop.height, "desktop");
				createScreenshot(url, sizeForTablet.width, sizeForTablet.height, "tablet");
				createScreenshot(url, sizeForMobile.width, sizeForMobile.height, "mobile");
			} else {
				winston.log('info', 'URL is not valid');
			}
		}
	}
);
