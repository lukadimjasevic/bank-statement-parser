const reader = require('xlsx');
const crypto = require('crypto');


const REQUIRED_COLUMNS = {
    'Type': 'type',
    'Product': 'product',
    'Started Date': 'startedDate',
    'Completed Date': 'completedDate',
    'Description': 'description',
    'Amount': 'amount',
    'Fee': 'fee',
    'Currency': 'currency',
    'State': 'state',
    'Balance': 'balance',
};

class Parser {
    #filePath;
    #workbook;
    #sheetName;
    #worksheet;
    #transactionHash;
    #filterColumns;
    constructor(filePath, options = {}) {
        this.#filePath = filePath;
        this.#workbook = reader.readFile(filePath);
        this.#sheetName = this.#workbook.SheetNames[0]; // Assuming we want the first sheet
        this.#worksheet = this.#workbook.Sheets[this.#sheetName];
        this.#transactionHash = options.transactionHash || false;
        this.#filterColumns = options.filterColumns || false;
    }

    parse() {
        const jsonData = reader.utils.sheet_to_json(this.#worksheet, { defval: false });
        for (const row of jsonData) {
            for (const rowKey of Object.keys(row)) {
                if (!Object.keys(REQUIRED_COLUMNS).includes(rowKey)) {
                    delete row[rowKey]; // Remove any extraneous columns
                }
            }

            for (const [key, newKey] of Object.entries(REQUIRED_COLUMNS)) {
                if (!(key in row)) {
                    throw new Error(`Missing required column: ${key}`);
                }
                if (newKey !== key) {
                    row[newKey] = row[key];
                    delete row[key];
                }
            }

            // Convert Excel date serial numbers to JS Date objects
            if (typeof row.startedDate === 'number') {
                row.startedDate = this.#excelDateToJSDate(row.startedDate);
            } else if (row.startedDate instanceof Date) {
                row.startedDate = new Date(row.startedDate);
            } else {
                row.startedDate = null;
            }

            if (typeof row.completedDate === 'number') {
                row.completedDate = this.#excelDateToJSDate(row.completedDate);
            } else if (row.completedDate instanceof Date) {
                row.completedDate = new Date(row.completedDate);
            } else {
                row.completedDate = null;
            }

            if (this.#transactionHash) {
                row.transactionHash = this.#generateTransactionHash(row);
            }
        }
        if (this.#filterColumns) {
            for (let i = 0; i < jsonData.length; i++) {
                jsonData[i] = this.#filterTransactionColumns(jsonData[i]);
            }
        }
        return jsonData;
    }

    #excelDateToJSDate(serial) {
        const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts at 1900-01-00
        const days = Math.floor(serial);
        const msInDay = 24 * 60 * 60 * 1000;
        const fractionalDay = serial - days;
        return new Date(excelEpoch.getTime() + days * msInDay + fractionalDay * msInDay);
    }

    #generateTransactionHash(transaction) {
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

    #filterTransactionColumns(transaction) {
        const filteredTransaction = {};
        if (!Array.isArray(this.#filterColumns)) {
            throw new Error('filterColumns option must be an array of column names');
        }
        for (const column of this.#filterColumns) {
            if (Object.keys(transaction).includes(column)) {
                filteredTransaction[column] = transaction[column];
            }
        }
        return filteredTransaction;
    }
}


module.exports = Parser;
