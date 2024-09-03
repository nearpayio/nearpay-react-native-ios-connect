import type { Currency } from './Currency';
export interface Transaction {
    amount_authorized: number;
    is_approved: boolean;
    uuid: string;
    scheme: string;
    currency: Currency;
    pan: string;
    transaction_type: string;
    start_date: string;
    start_time: string;
    is_reversed: boolean;
}
export interface TransactionList {
    transactions: Transaction[];
    count: number;
}
export interface TransactionListModel {
    transactionList: TransactionList;
}
//# sourceMappingURL=TransactionListModel.d.ts.map