const REQUIRED_COLUMNS = [
    'Datum',
    'Referencija',
    'Opis',
    'Uplata',
    'Isplata',
    'Saldo',
    'Valuta',
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
            type: transaction['Uplata'] ? 'Deposit' : 'Withdrawal',
            product: 'Current',
            startedDate: transaction['Datum'],
            completedDate: transaction['Datum'],
            description: transaction['Opis'],
            amount: transaction['Uplata'] ? transaction['Uplata'] : transaction['Isplata'],
            fee: 0,
            currency: transaction['Valuta'],
            balance: transaction['Saldo'],
        };

        normalizedData.push(normalized);
    }

    return normalizedData;
}

module.exports = { normalizeData };
