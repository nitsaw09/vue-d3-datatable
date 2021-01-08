const express = require("express");
const router = express.Router();
const csvParser = require("../middleware/csvParser");
const csvFile = "api/data/bar-chart.csv";

router.get("/", csvParser(csvFile), (req, res) => {
    res.status(200).send(req.shipmentData);
});

module.exports = router;
