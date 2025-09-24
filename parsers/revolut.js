const helpers = require('../helpers');

const REQUIRED_COLUMNS = [
    'Type',
    'Product',
    'Started Date',
    'Completed Date',
    'Description',
    'Amount',
    'Fee',
    'Currency',
    'State',
    'Balance',
];

/**
 * Maps raw transaction objects to a standardized JSON format.
 * Throws an error if any required column is missing.
 *
 * @param {Array<Object>} data - Array of transaction objects.
 * @returns {Array<Object>} Normalized transactions with standard keys.
 */
function normalizeData(data) {
    const normalizedData = [];

    for (const transaction of data) {
        // Check required columns
        const transactionColumns = Object.keys(transaction);
        for (const requiredColumn of REQUIRED_COLUMNS) {
            if (!transactionColumns.includes(requiredColumn)) {
                throw new Error(`Missing required column: ${requiredColumn}`);
            }
        }

        const normalized = {
            type: transaction['Type'],
            product: transaction['Product'],
            startedDate: transaction['Started Date'],
            completedDate: transaction['Completed Date'],
            description: transaction['Description'],
            amount: transaction['Amount'],
            fee: transaction['Fee'],
            currency: transaction['Currency'],
            state: transaction['State'],
            balance: transaction['Balance'],
        };

        if (typeof normalized.startedDate === 'number') {
            normalized.startedDate = helpers.date.excelSerialToDate(normalized.startedDate);
        }
        if (typeof normalized.completedDate === 'number') {
            normalized.completedDate = helpers.date.excelSerialToDate(normalized.completedDate);
        }

        normalizedData.push(normalized);
    }

    return normalizedData;
}

module.exports = { normalizeData };
