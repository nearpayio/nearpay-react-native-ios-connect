import type { Currency } from './Currency';
import type { Label } from './Label';
import type { Merchant } from './Merchant';

export interface ApprovalCode {
  value: string;
  label: Label;
}

export interface VerificationMethod {
  english: string;
  arabic: string;
}

export interface Amount {
  value: string;
  label: Label;
}

export interface TransactionType {
  name: Label;
  id: string;
}

export interface CardSchemeName {
  english: string;
  arabic: string;
}

export interface CardScheme {
  id: string;
  name: CardSchemeName;
}

export interface ThanksMessage {
  arabic: string;
  english: string;
}

export interface TransactionReceipt {
  terminal_verification_result: string;
  is_approved: boolean;
  transaction_uuid: string;
  application_identifier: string;
  is_refunded: boolean;
  verification_method: VerificationMethod;
  application_cryptogram: string;
  pan: string;
  approval_code?: ApprovalCode;
  card_expiration: string;
  amount_other: Amount;
  receipt_line_one: Record<string, unknown>;
  cardholader_verfication_result: string;
  entry_mode: string;
  pan_suffix: string;
  save_receipt_message: Label;
  action_code: string;
  transaction_state_information: string;
  end_date: string;
  tid: string;
  receipt_line_two: Record<string, unknown>;
  start_date: string;
  amount_authorized: Amount;
  end_time: string;
  pos_software_version_number: string;
  updated_at?: string;
  created_at?: string;
  system_trace_audit_number: string;
  card_scheme: CardScheme;
  payment_account_reference: string;
  card_scheme_sponsor: string;
  kernel_id: string;
  start_time: string;
  currency: Currency;
  is_reversed: boolean;
  retrieval_reference_number: string;
  qr_code: string;
  thanks_message: ThanksMessage;
  transaction_type: TransactionType;
  status_message: Label;
  merchant: Merchant;
  cryptogram_information_data: string;
}

export interface TransactionModel {
  isNewTransaction?: boolean;
  transactionReceipts: TransactionReceipt[];
  status: string;
}

export interface TransactionReceiptModel {
    transactionReceipts: TransactionReceipt[];
  }