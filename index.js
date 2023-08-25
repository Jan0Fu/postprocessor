const fs = require('node:fs');
const csv = require('csv-parser');

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
            userInfo.push(cleanedRow);
        })
        .on('end', () => {
            console.log(userInfo);
            lastUser = userInfo[userInfo.length - 1];
            console.log(`The user ${lastUser['nickname']} has "${lastUser['consent to mailing']}" consent status for sending emails`);
        });
