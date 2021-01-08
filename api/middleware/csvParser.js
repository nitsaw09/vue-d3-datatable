const csv = require('csv-parser');
const fs = require('fs');

module.exports =  csvFile =>  { 
    return (req, res, next) => {
        try {
            const data = [];
            fs.createReadStream(csvFile)
            .on('error', () => {
                return res.status(500).json({ error: "CSV file failed to process" });
            })
            .pipe(csv())
            .on('data', (row) => {
                const rowData = {};
                for (let key in row) {
                    const value = row[key]
                    key = key.replace(/\"/g, "").trim();
                    rowData[key] = value;
                } 
                data.push(rowData);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                req.shipmentData = data;
                next();
            });
        } catch (err) {
            return res.status(500).json({ error: err });
        }
    }
}
