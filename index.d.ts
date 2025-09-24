export interface StatementParserOptions {
    bank: string;
    setHash?: boolean; // Adds a unique hash to each transaction
    includeColumns?: string[]; // Filters the transaction object to only include specified columns
}

export interface Transaction {
    type: string;
    product: string;
    startedDate: Date;
    completedDate: Date;
    description: string;
    amount: number;
    fee: number;
    currency: string;
    state: string;
    balance: number;
    hash?: string; // Optional hash if setHash option is enabled
}

export declare class StatementParser {
    constructor(filePath: string, options?: StatementParserOptions);
    parse(): Transaction[];
}
