const http = require('http');
const webServerConfig = require('./app/config/webserver.js');
const express = require("express");
const app = express();

const db = require('./app/services/db.js');
const dbConfig = require('./app/config/db.js');

const defaultThreadPoolSize = 4;

process.env.UV_THREADPOOL_SIZE = dbConfig.hotfix.poolMax + defaultThreadPoolSize;

let httpServer;
async function startup() {
    console.log('Starting application');
    try {
        console.log('Initializing database module');
        await db.initialize();
    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }

    try {
        console.log('Initializing web server module');
        httpServer = http.createServer(app);
        app.use(express.json());
        app.use(
            express.urlencoded({
                extended: true,
            })
        );

        app.get("/", (request, response) => {
            response.json({ "message": "welcome to Bezkoder Application" })
        });

        const bankRoute = require("./app/routes/bank.routes")(app);

        httpServer.listen(webServerConfig.port)
            .on('listening', () => {
                console.log(`Web server listening on localhost:${webServerConfig.port}`);
            })
            .on('error', err => {
            });

    } catch (err) {
        console.error(err);
        process.exit(1); // Non-zero failure code
    }
}
startup();

async function shutdown(e) {
    let err = e;
    console.log('Shutting down application');
    try {
        console.log('Closing web server module');
        await closeHttpServer();
    } catch (e) {
        console.error(e);
        err = err || e;
    }

    try {
        console.log('Closing database module');
        await db.close();
    } catch (e) {
        console.error(e);
        err = err || e;
    }

    console.log('Exiting process');
    if (err) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

function closeHttpServer() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

process.once('SIGTERM', () => {
    console.log('Received SIGTERM');
    shutdown();
});

process.once('SIGINT', () => {
    console.log('Received SIGINT');
    shutdown();
});

process.once('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);
    shutdown(err);
});

