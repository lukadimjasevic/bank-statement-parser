/**
 * Converts Excel serial date to JavaScript Date object.
 * @param {number} serial - Excel serial date
 * @returns {Date}
 */
function excelSerialToDate(serial) {
    const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts at 1900-01-00
    const days = Math.floor(serial);
    const msInDay = 24 * 60 * 60 * 1000;
    const fractionalDay = serial - days;
    return new Date(excelEpoch.getTime() + days * msInDay + fractionalDay * msInDay);
}

module.exports = { excelSerialToDate };
