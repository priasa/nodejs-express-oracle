const oracledb = require('oracledb');


exports.findAll = async (req, res) => {
    let connection;
    let result = [];
    try {
        connection = await oracledb.getConnection();
        result = await connection.execute(
            'SELECT * FROM ADM_R_BANK',
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving banks.",
          });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

exports.findByKode = async (req, res) => {
    const kode = req.params.kode;
    let connection;
    let result = [];
    try {
        connection = await oracledb.getConnection();
        result = await connection.execute(
            'SELECT * FROM ADM_R_BANK WHERE KODE = :kode',
            [kode],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving bank by kode [" + kode + "]",
          });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

exports.findByKodePagination = async (req, res) => {
    const kode = (req.body.kode).toString() + "%";
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;

    let connection;
    let result = [];
    try {
        connection = await oracledb.getConnection();
        result = await connection.execute(
            ' SELECT * FROM ' +
            ' ( ' +
            '   SELECT a.*, rownum r__ ' +
            '   FROM ' +
            '   ( ' +
            '       SELECT * FROM ADM_R_BANK WHERE kode LIKE :kode order by kode' +
            '   ) a ' +
            '   WHERE rownum < ((:pageNumber * :pageSize) + 1 ) ' +
            ' ) ' +
            ' WHERE r__ >= (((:pageNumber - 1) * :pageSize) + 1)',
            [kode, pageNumber, pageSize],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving bank by kode [" + kode + "]",
          });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}