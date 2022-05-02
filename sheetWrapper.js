'use strict'

const HEADER_ROW = 3;
const FIRST_DATA_ROW = 4;
const MAX_DATA_ROW = 54;
const FIRST_COLUMN = 0;
const LAST_COLUMN = 42;
const readXlsxFile = require('read-excel-file/node')

function extractData(data, header) {
    let rows = [];
    for (let rowNum = FIRST_DATA_ROW; rowNum < MAX_DATA_ROW; rowNum++) {
        let row = {};
        for (let colNum = FIRST_COLUMN; colNum < LAST_COLUMN; colNum++) {
            let value = data[rowNum][colNum] || '';
            row[header[colNum]] = value;
        }
        rows.push(row);
    }
    return rows;
}

function extractColumnHeaders(){
    return readXlsxFile('data/UK_Top 50_202141_100K Chart.xlsx').then((data) => {

        let header = data[HEADER_ROW];
        return header;
    
    }).catch(err => console.log(err));
}



function parse(){
    return readXlsxFile('data/UK_Top 50_202141_100K Chart.xlsx').then((data) => {

        let header = data[HEADER_ROW];
        return extractData(data, header);
    
    }).catch(err => console.log(err));
}


module.exports = {
    parse : parse,
    extractColumnHeaders : extractColumnHeaders
}


