module.exports = app => {
    const banks = require("../controllers/bank.controllers.js");
    
    // Retrieve all Customers
    app.get("/banks", banks.findAll);
    app.get("/banks/:kode", banks.findByKode);
    app.post("/banks/findByKodePagination", banks.findByKodePagination);

};