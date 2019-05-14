const moment = require('moment');

const generateEmergency = (from, text)=> {
    return{
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const generateMessage = (from, text) => {
    return{
        from,
        text,
        createdAt: moment().valueOf()
    }
}

const generateLocationMessage = (from, latitude, longitude) => {
    return{
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = { generateMessage, generateLocationMessage, generateEmergency };