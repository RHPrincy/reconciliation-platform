export type PaymentCategory =
  | "Espèces"
  | "Carte Bancaire"
  | "Titres Restaurant"
  | "Chèques"
  | "TR Dématérialisés"
  | "Chèques Vacances"
  | "Avoirs";

export interface ZReport {
  date: string;
  compte: string;
  journal: string;
  libelle: string;
  debit: number;
  credit: number;
  type: PaymentCategory;
  company: string;
}

export interface BankTransaction {
  date: string;
  libelle: string;
  montant: number;
  type: string;
  debit: number;
  credit: number;
  solde: number;
  note?: string;
  exercice?: string;
  brutCB?: number;
  trpBrut?: number;
  frais?: number;
  tvaFrais?: number;
}

export const PAYMENT_CATEGORIES: PaymentCategory[] = [
  "Espèces",
  "Carte Bancaire",
  "Titres Restaurant",
  "Chèques",
  "TR Dématérialisés",
  "Chèques Vacances",
  "Avoirs"
];

export const MOCK_Z_REPORTS: ZReport[] = [
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 450.50,
    type: "Espèces",
    company: "LGTF"
  },
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1250.20,
    type: "Carte Bancaire",
    company: "LGTF"
  },
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Titres Resto",
    debit: 0,
    credit: 320.00,
    type: "Titres Restaurant",
    company: "TOIT"
  },
  {
    date: "02/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 380.00,
    type: "Espèces",
    company: "TOIT"
  },
  {
    date: "02/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1100.00,
    type: "Carte Bancaire",
    company: "SDM"
  },
  {
    date: "03/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 600.00,
    type: "Espèces",
    company: "SDM"
  },
  {
    date: "03/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1500.00,
    type: "Carte Bancaire",
    company: "LGTF"
  }
];

// Fill the month of August
for (let i = 4; i <= 31; i++) {
  const day = i < 10 ? `0${i}` : i;
  const companies = ['LGTF', 'TOIT', 'SDM'];
  const randomCompany = companies[Math.floor(Math.random() * companies.length)];

  MOCK_Z_REPORTS.push({
    date: `${day}/08/2024`,
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: Math.floor(Math.random() * 500) + 200,
    type: "Espèces",
    company: randomCompany
  });

  MOCK_Z_REPORTS.push({
    date: `${day}/08/2024`,
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: Math.floor(Math.random() * 1000) + 800,
    type: "Carte Bancaire",
    company: randomCompany
  });
}

export const MOCK_BANK_TRANSACTIONS: BankTransaction[] = [
  {
    date: "02/08/2024",
    libelle: "REMISE CB 01/08",
    montant: 1250.20,
    type: "CB",
    debit: 0,
    credit: 1250.20,
    solde: 1250.20
  },
  {
    date: "03/08/2024",
    libelle: "REMISE CB 02/08",
    montant: 1100.00,
    type: "CB",
    debit: 0,
    credit: 1100.00,
    solde: 2350.20
  },
  {
    date: "04/08/2024",
    libelle: "REMISE CB 03/08",
    montant: 1500.00,
    type: "CB",
    debit: 0,
    credit: 1500.00,
    solde: 3850.20
  },
  {
    date: "05/08/2024",
    libelle: "VERSEMENT ESPECES",
    montant: 400.00,
    type: "Espece",
    debit: 0,
    credit: 400.00,
    solde: 4250.20
  },
  {
    date: "06/08/2024",
    libelle: "CHEQUE N°12345",
    montant: 500.00,
    type: "Cheque",
    debit: 0,
    credit: 500.00,
    solde: 4750.20
  },
  {
    date: "07/08/2024",
    libelle: "VIREMENT SALAIRE",
    montant: 2000.00,
    type: "Virement",
    debit: 0,
    credit: 2000.00,
    solde: 6750.20,
    note: "Salaire mensuel",
    exercice: "2024-2025"
  },
  {
    date: "08/08/2024",
    libelle: "TICKET RESTO",
    montant: 300.00,
    type: "Ticket Resto",
    debit: 0,
    credit: 300.00,
    solde: 7050.20,
    brutCB: 320.00,
    trpBrut: 300.00,
    frais: 20.00,
    tvaFrais: 4.00
  },
  {
    date: "09/08/2024",
    libelle: "CHEQUES VACANCES",
    montant: 600.00,
    type: "CV",
    debit: 0,
    credit: 600.00,
    solde: 7650.20
  }
];

let currentSolde = 7650.20;
for (let i = 10; i <= 31; i++) {
  const day = i < 10 ? `0${i}` : i;
  const types = ["CB", "Espece", "Cheque", "Virement", "Ticket Resto", "CV"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  let montant = Math.floor(Math.random() * 1000) + 200;
  let libelle = "";
  let additionalFields: Partial<BankTransaction> = {};

  switch (randomType) {
    case "CB":
      libelle = `REMISE CB ${i-1}/08`;
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant };
      break;
    case "Espece":
      libelle = "VERSEMENT ESPECES";
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant };
      break;
    case "Cheque":
      libelle = `CHEQUE N°${Math.floor(Math.random() * 10000)}`;
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant };
      break;
    case "Virement":
      libelle = "VIREMENT DIVERS";
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant, note: "Virement divers", exercice: "2024-2025" };
      break;
    case "Ticket Resto":
      libelle = "TICKET RESTO";
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant, brutCB: montant + 20, trpBrut: montant, frais: 20, tvaFrais: 4 };
      break;
    case "CV":
      libelle = "CHEQUES VACANCES";
      additionalFields = { debit: 0, credit: montant, solde: currentSolde + montant };
      break;
  }

  MOCK_BANK_TRANSACTIONS.push({
    date: `${day}/08/2024`,
    libelle,
    montant,
    type: randomType,
    debit: additionalFields.debit ?? 0,
    credit: additionalFields.credit ?? 0,
    solde: additionalFields.solde ?? currentSolde + montant,
    ...additionalFields
  });
  currentSolde += montant;
}
