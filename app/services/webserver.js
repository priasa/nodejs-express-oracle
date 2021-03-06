'use strict';
const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../app/config/webserver.js');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    // Combines logging info from request and response
    app.use(morgan('combined'));

    app.use(express.json());
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    app.get("/", (request, response) => {
      response.json({ "message": "Welcome to Nodejs Express Oracle Application" })
    });

    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

function close() {
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

module.exports.close = close;
