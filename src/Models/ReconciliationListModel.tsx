import type { Currency } from './Currency';
import type { IsBalanced } from './ReconcileModel';

export interface Reconciliation {
  id: string;
  date: string;
  time: string;
  total: string;
  currency: Currency;
  is_balanced: IsBalanced;
}

export interface ReconciliationList {
  total: number;
  reconciliations: Reconciliation[];
}

export interface ReconciliationListModel {
  reconciliationList: ReconciliationList;
}
