import type { Currency } from './Currency';
import type { Details } from './Details';
import type { Label } from './Label';
import type { Merchant } from './Merchant';

export interface IsBalanced {
  label: Label;
  value: boolean;
}

export interface Scheme {
  name: Label;
  id: string;
  total_amount: string;
  transaction_count: number;
}

export interface ReconcileReceipt {
  card_acceptor_terminal_id: string;
  currency: Currency;
  date: string;
  details: Details;
  id: string;
  is_balanced: IsBalanced;
  merchant: Merchant;
  pos_software_version_number: string;
  qr_code: string;
  schemes: Scheme[];
  system_trace_audit_number: string;
  time: string;
}

export interface ReconcileModel {
  reconcileReceipt: ReconcileReceipt;
  status: string;
}
