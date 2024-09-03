import type { Label } from './Label';
export interface Details {
    refund: AmountDetail;
    refund_reversal: AmountDetail;
    purchase_reversal: AmountDetail;
    purchase: AmountDetail;
    total: AmountDetail;
}
export interface AmountDetail {
    label: Label;
    value: string;
}
//# sourceMappingURL=Details.d.ts.map