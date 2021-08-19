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
    let result1 = [];
    let totalPageNumber = 0;
    let totalRecord = 0;
    try {
        connection = await oracledb.getConnection();
        result1 = await connection.execute(
            ' SELECT o.* FROM ADM_R_BANK o WHERE KODE LIKE :kode ' + 
            ' ORDER BY kode ASC OFFSET (:pagenumber -1) * :pagesize rows fetch next :pagesize rows only ',
            [kode, pageNumber, pageSize],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const result2 = await connection.execute(
            ' SELECT DISTINCT  ceil(count(*) over () / :pagesize) total_page, count(*) over () total_record ' +
            ' FROM   ADM_R_BANK o ' +
            ' WHERE  KODE LIKE :kode ',
            [pageSize, kode],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        console.log(result2.rows)
        if (result2.rows) {
            totalPageNumber = result2.rows[0].TOTAL_PAGE;
            totalRecord = result2.rows[0].TOTAL_RECORD;
        }
        var result0 = {
            pageNumber: pageNumber,
            totalPageNumber: totalPageNumber,
            pageSize: pageSize,
            totalRecord: totalRecord,
            data: result1.rows
        }
        res.status(200).json(result0);
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