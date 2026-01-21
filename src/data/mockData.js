export const PAYMENT_TYPES = [
  "Espèces",
  "Carte Bancaire",
  "Titres Restaurant",
  "Chèques",
  "TR Dématérialisés",
  "Chèques Vacances",
  "Avoirs"
];

export const MOCK_Z_REPORTS = [
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 450.50,
    type: "Espèces"
  },
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1250.20,
    type: "Carte Bancaire"
  },
  {
    date: "01/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Titres Resto",
    debit: 0,
    credit: 320.00,
    type: "Titres Restaurant"
  },
  {
    date: "02/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 380.00,
    type: "Espèces"
  },
  {
    date: "02/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1100.00,
    type: "Carte Bancaire"
  },
  {
    date: "03/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: 600.00,
    type: "Espèces"
  },
  {
    date: "03/08/2024",
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: 1500.00,
    type: "Carte Bancaire"
  }
];

// Add more data to fill the month of August
for (let i = 4; i <= 31; i++) {
  const day = i < 10 ? `0${i}` : i;
  MOCK_Z_REPORTS.push({
    date: `${day}/08/2024`,
    compte: "707100",
    journal: "CA",
    libelle: "Ventes Espèces",
    debit: 0,
    credit: Math.floor(Math.random() * 500) + 200,
    type: "Espèces"
  });
  MOCK_Z_REPORTS.push({
    date: `${day}/08/2024`,
    compte: "707100",
    journal: "CA",
    libelle: "Ventes CB",
    debit: 0,
    credit: Math.floor(Math.random() * 1000) + 800,
    type: "Carte Bancaire"
  });
}

export const MOCK_BANK_TRANSACTIONS = [
  {
    date: "02/08/2024",
    libelle: "REMISE CB 01/08",
    montant: 1250.20
  },
  {
    date: "03/08/2024",
    libelle: "REMISE CB 02/08",
    montant: 1100.00
  },
  {
    date: "04/08/2024",
    libelle: "REMISE CB 03/08",
    montant: 1500.00
  },
  {
    date: "05/08/2024",
    libelle: "VERSEMENT ESPECES",
    montant: 400.00
  }
];

// Add more bank data
for (let i = 5; i <= 31; i++) {
  const day = i < 10 ? `0${i}` : i;
  MOCK_BANK_TRANSACTIONS.push({
    date: `${day}/08/2024`,
    libelle: `REMISE CB ${i-1}/08`,
    montant: Math.floor(Math.random() * 1000) + 800
  });
}
