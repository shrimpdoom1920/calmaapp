const moment = require('moment');

const sometimeStamp = moment.valueOf();

const createdAt = 1000;
const date = moment(createdAt);
console.log(date.format('h:mm a'));