export interface Label {
    arabic: string;
    english: string;
}
export interface AmountDetail {
    label: Label;
    total: string;
    count: number;
}
export interface Details {
    refund: AmountDetail;
    refund_reversal: AmountDetail;
    purchase_reversal: AmountDetail;
    purchase: AmountDetail;
    total: AmountDetail;
}
export interface HostPosDetails {
    debit: AmountDetail;
    credit: AmountDetail;
    total: AmountDetail;
}
export interface Scheme {
    host: HostPosDetails;
    pos: HostPosDetails;
    name: {
        label: Label;
        value: string;
    };
}
export interface Merchant {
    address: Label;
    name: Label;
    id: string;
    category_code: string;
}
export interface Currency {
    arabic: string;
    english: string;
}
export interface IsBalanced {
    label: Label;
    value: boolean;
}
export interface Receipt {
    date: string;
    qr_code: string;
    time: string;
    details: Details;
    card_acceptor_terminal_id: string;
    schemes: Scheme[];
    pos_software_version_number: string;
    merchant: Merchant;
    id: string;
    system_trace_audit_number: string;
    currency: Currency;
    is_balanced: IsBalanced;
}
export interface ReceiptModel {
    receipt: Receipt;
}
//# sourceMappingURL=ReconciliationModel.d.ts.map