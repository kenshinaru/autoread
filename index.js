import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
			if (data === 'reset') {
				p.kill();
			}
		})
		.on('exit', () => {
			start();
		});
}

function checkServer() {
    const healthService = http.createServer((request, response) => {
        if (request.method === 'GET' && request.url === '/health') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ status: 'OK' }));
        } else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Not Found' }));
        }
    });

    const PORT = 8000;
    healthService.listen(PORT, () => {
        console.log(`Health check server is running on port ${PORT}`);
    });
}

start();
checkServer()
