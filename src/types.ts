export type PaymentType =
  | "Espèces"
  | "Carte Bancaire"
  | "Titres Restaurant"
  | "Chèques"
  | "TR Dématérialisés"
  | "Chèques Vacances"
  | "Avoirs";

export interface ZReportEntry {
  date: string;
  compte: string;
  journal: string;
  libelle: string;
  debit: number;
  credit: number;
  type: PaymentType;
}

export interface BankTransaction {
  date: string;
  libelle: string;
  montant: number;
}

export interface ReconciliationItem {
  type: PaymentType;
  expected: number;
  actual: number;
  variance: number;
  comment: string;
}

export type ScreenType = 'import' | 'reconciliation';
