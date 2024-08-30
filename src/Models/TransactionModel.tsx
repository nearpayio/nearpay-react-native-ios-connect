export interface StatusMessage {
  arabic: string;
  english: string;
}

export interface Label {
  english: string;
  arabic: string;
}

export interface ApprovalCode {
  value: string;
  label: Label;
}

export interface MerchantName {
  arabic: string;
  english: string;
}

export interface MerchantAddress {
  arabic: string;
  english: string;
}

export interface Merchant {
  category_code: string;
  name: MerchantName;
  id: string;
  address: MerchantAddress;
}

export interface VerificationMethod {
  english: string;
  arabic: string;
}

export interface AmountAuthorized {
  value: string;
  label: Label;
}

export interface Currency {
  arabic: string;
  english: string;
}

export interface TransactionType {
  name: MerchantName;
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

export interface AmountOther {
  label: Label;
  value: string;
}

export interface SaveReceiptMessage {
  english: string;
  arabic: string;
}

export interface TransactionReceipt {
  status_message: StatusMessage;
  approval_code: ApprovalCode;
  system_trace_audit_number: string;
  is_reversed: boolean;
  merchant: Merchant;
  verification_method: VerificationMethod;
  start_time: string;
  application_identifier: string;
  kernel_id: string;
  amount_authorized: AmountAuthorized;
  is_refunded: boolean;
  currency: Currency;
  pan_suffix: string;
  transaction_type: TransactionType;
  pan: string;
  action_code: string;
  card_scheme: CardScheme;
  terminal_verification_result: string;
  tid: string;
  cryptogram_information_data: string;
  receipt_line_two: Record<string, unknown>;
  entry_mode: string;
  end_time: string;
  thanks_message: ThanksMessage;
  transaction_state_information: string;
  payment_account_reference: string;
  retrieval_reference_number: string;
  transaction_uuid: string;
  start_date: string;
  cardholader_verfication_result: string;
  amount_other: AmountOther;
  card_expiration: string;
  end_date: string;
  save_receipt_message: SaveReceiptMessage;
  qr_code: string;
  is_approved: boolean;
  card_scheme_sponsor: string;
  application_cryptogram: string;
  receipt_line_one: Record<string, unknown>;
  pos_software_version_number: string;
}

export interface TransactionModel {
  isNewTransaction: boolean;
  transactionReceipts: TransactionReceipt[];
  status: string;
}
