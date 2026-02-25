const fs = require('fs');
const path = require('path');

const readData = (fileName) => {
    const filePath = path.join(__dirname, '../data', fileName);
    
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeData = (fileName, data) => {
    const filePath = path.join(__dirname, '../data', fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };