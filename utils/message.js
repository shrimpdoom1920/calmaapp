//Library for getting formatted time
const moment = require('moment');

// function for referencing message
const generateMessage = (from, text) => {
    return{
        from,
        text,
        createdAt: moment().valueOf()
    }
}

/// function for referencing Emergency message
const generateEmergency = (from, text, yes, no)=> {
    return{
        from,
        text,
        createdAt: moment().valueOf(),
        yes,
        no
    }
}

// function for referencing the geolocation
const generateLocationMessage = (from, latitude, longitude) => {
    return{
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }
}

module.exports = { generateMessage, generateLocationMessage, generateEmergency };