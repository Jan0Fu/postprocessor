const fs = require('node:fs');
const csv = require('csv-parser');
const crypto = require('node:crypto');

const userInfo = [];

fs.createReadStream('database.csv')
        .pipe(csv())
        .on('data', (row) => {
            const cleanedRow = {};
            for (const key in row) {
                if (Object.hasOwnProperty.call(row, key)) {
                    const cleanedKey = key.trim();
                    const cleanedValue = row[key].trim();
                    cleanedRow[cleanedKey] = cleanedValue;
                }
            }
            if (cleanedRow['password']) {
                const hashedPassword = crypto
                  .createHash('sha256')
                  .update(cleanedRow['password'], 'utf-8')
                  .digest('hex');
                cleanedRow['password'] = hashedPassword;
            }

            userInfo.push(cleanedRow);
        })
        .on('end', () => {
            const formattedData = userInfo.map((row) => Object.values(row).join(', ')).join('\n');
            fs.appendFile('hash_database.csv', formattedData, (err) => {
                if (err) {
                  console.error('Error appending data:', err);
                } else {
                  console.log('Hashed data appended to hash_database.csv');
                }
            });
        });

const fileData = fs.readFileSync('hash_database.csv', 'utf-8');

const lines = fileData.split('\n');
let newId = 1;
const filteredLines = [lines[0]];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const columns = line.split(',');

    if (!columns.some(column => column.trim() === '-')) {
        columns[0] = newId++;
        filteredLines.push(columns.join(','));
    }
}

const filteredData = filteredLines.join('\n');
fs.writeFileSync('filtered_database.csv', filteredData, 'utf-8');