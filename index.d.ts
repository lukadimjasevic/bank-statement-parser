export interface ParserOptions {
    transactionHash?: boolean; // Adds a unique hash to each transaction
    filterColumns?: string[]; // Filters the transaction object to only include specified columns
}

export interface Transaction {
    type: string;
    product: string;
    startedDate: Date | null;
    completedDate: Date | null;
    description: string;
    amount: number;
    fee: number;
    currency: string;
    state: string;
    balance: number;
    transactionHash?: string; // Optional hash if transactionHash option is enabled
}

export declare class Parser {
    constructor(filePath: string, options?: ParserOptions);
    parse(): Transaction[];
}
