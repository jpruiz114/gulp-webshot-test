var gulp = require('gulp');

var winston = require('winston');

var argv = require('yargs').argv;

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

gulp.task(
	'test-log-input',
	function() {
		//console.dir(argv);

		var url = argv.url;

		if (url === undefined) {
			console.log("You must indicate the url");
		} else {
			console.log("url" + " = " + url);
		}
	}
);
