const fs = require('node:fs');
const csv = require('csv-parser');

const userInfo = [];

fs.createReadStream('database.csv')
        .pipe(csv())
        .on('data', (data) => userInfo.push(data))
        .on('end', () => {
            console.log(userInfo);
            lastUser = userInfo[userInfo.length - 1];
            console.log(`The user ${lastUser['nickname']} has "${lastUser['consent to mailing']}" consent status for sending emails`);
        });
