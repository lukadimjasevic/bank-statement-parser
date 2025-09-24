const crypto = require('crypto');

/**
 * Creates a unique transaction hash based on transaction fields.
 * @param {object} transaction - Normalized transaction object
 * @returns {string}
 */
function createTransactionHash(transaction) {
    const hash = crypto.createHash('sha256');
    const hashInput = `
        ${transaction.type}
        ${transaction.startedDate}
        ${transaction.completedDate}
        ${transaction.description}
        ${transaction.amount}
        ${transaction.balance}`;
    hash.update(hashInput);
    return hash.digest('hex');
}

module.exports = { createTransactionHash };
