const fs = require('node:fs');
const csv = require('csv-parser');
const crypto = require('crypto');

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
