const revolut = require('./revolut.js');
const zaba = require('./zaba.js');

module.exports = {
    revolut: revolut.normalizeData,
    zaba: zaba.normalizeData,
};
