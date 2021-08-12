'use strict';

const oracledb = require('oracledb');
const dbConfig = require('../config/db.js');

if (process.platform === 'win32') {
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_19_11' });
} else if (process.platform === 'darwin') {
    oracledb.initOracleClient({ libDir: process.env.HOME + '/Downloads/instantclient_19_8' });
} else {
    oracledb.initOracleClient({ libDir: '/home/priasa/Documents/apps/instantclient_21_1' });
}

async function initialize() {
    await oracledb.createPool(dbConfig.hotfix);
    console.log('Connection was successful!');
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close(0);
}

module.exports.close = close;

async function simpleExecute(statement, binds = [], opts = {}) {
    let conn;
    let result = [];
    opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
    try {
        conn = await oracledb.getConnection();
        result = await conn.execute(statement, binds, opts);
        return (result.rows);
    } catch (err) {
        console.error(err);
        throw (err);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports.simpleExecute = simpleExecute;