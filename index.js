const { spawn } = require('child_process'), path = require('path');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
	unhandledRejections.set(promise, reason);
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('rejectionHandled', (promise) => {
	unhandledRejections.delete(promise);
});
process.on('Something went wrong', function (err) {
	console.log('Caught exception: ', err);
});

function start() {
	let args = [path.join(__dirname, './client.js'), ...process.argv.slice(2)];
	let p = spawn(process.argv[0], args, {
			stdio: ['inherit', 'inherit', 'inherit', 'ipc']
		})
		.on('message', data => {
			if (data == 'reset') {
				p.kill();
			}
		})
		.on('exit', code => {
			start();
		});
}

start();
