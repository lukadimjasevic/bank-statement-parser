const reader = require('xlsx');
const normalizers = require('../parsers');
const helpers = require('../helpers');

const SUPPORTED_BANKS = Object.keys(normalizers);


class StatementParser {
    constructor(filePath, options = {}) {
        this.filePath = filePath;
        this.options = options;
        this.bank = options.bank || false;

        if (!SUPPORTED_BANKS.includes(this.bank)) {
            throw new Error(`Bank not supported: ${this.bank}`);
        }
    }

    parse() {
        const workbook = reader.readFile(this.filePath);
        const sheetName = workbook.SheetNames[0]; // Assuming we want the first sheet
        const worksheet = workbook.Sheets[sheetName];
        const range = this.bank === 'zaba' ? 4 : 0;
        const data = reader.utils.sheet_to_json(worksheet, { defval: false, range });

        let normalized = this.#normalizeData(data);
        this.#convertDates(normalized);

        if (this.options.setHash) {
            this.#applyTransactionHash(normalized);
        }

        if (this.options.includeColumns) {
            normalized = this.#filterByColumns(normalized);
        }

        return normalized;
    }

    #normalizeData(data) {
        return normalizers[this.bank](data);
    }

    #convertDates(transactions) {
        return transactions.map(tx => {
            if (typeof tx.startedDate === 'number') tx.startedDate = helpers.date.excelSerialToDate(tx.startedDate);
            if (typeof tx.completedDate === 'number') tx.completedDate = helpers.date.excelSerialToDate(tx.completedDate);
            return tx;
        });
    }

    #applyTransactionHash(transactions) {
        for (const transaction of transactions) {
            transaction.hash = helpers.hash.createTransactionHash(transaction);
        }
    }

    #filterByColumns(transactions) {
        const filtered = [];
        if (!Array.isArray(this.options.includeColumns)) {
            throw new Error('Option "includeColumns" must be an array of column names');
        }
        for (const transaction of transactions) {
            const filteredTransaction = {};
            for (const column of this.options.includeColumns) {
                if (Object.keys(transaction).includes(column)) {
                    filteredTransaction[column] = transaction[column];
                }
            }
            filtered.push(filteredTransaction);
        }
        return filtered;
    }
}

module.exports = StatementParser;
