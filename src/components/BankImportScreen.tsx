import { useState } from 'react';
import { Upload, Filter, Maximize, X, FileText } from 'lucide-react';
import { MOCK_BANK_TRANSACTIONS, BankTransaction } from '../data/mockData';

interface Column {
  key: keyof BankTransaction | 'jnl';
  label: string;
  value?: string;
  format?: (val: any) => string;
}

const BankImportScreen = () => {
  const [bankFilter, setBankFilter] = useState('TOUT');
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('08');
  const [ticketRestoData, setTicketRestoData] = useState<Record<string, Partial<BankTransaction>>>({});

  const getBankColumns = (filter: string): Column[] => {
    const baseColumns: Column[] = [
      { key: 'date', label: 'Date' },
      { key: 'jnl', label: 'Jnl', value: 'BQ3' },
      { key: 'libelle', label: 'Libellé' }
    ];

    if (filter === 'TOUT') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'credit', label: 'Crédit', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'solde', label: 'Solde cumulé', format: (val) => (val || 0).toFixed(2) + ' €' }
      ];
    } else if (['Espece', 'CV', 'CB', 'Cheque'].includes(filter)) {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => (val || 0).toFixed(2) + ' €' }
      ];
    } else if (filter === 'Virement') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'note', label: 'Note' },
        { key: 'exercice', label: 'Exercice' }
      ];
    } else if (filter === 'Ticket Resto') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'brutCB', label: 'BRUT CB', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'trpBrut', label: 'TRP BRUT', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'frais', label: 'FRAIS', format: (val) => (val || 0).toFixed(2) + ' €' },
        { key: 'tvaFrais', label: 'TVA FRAIS', format: (val) => (val || 0).toFixed(2) + ' €' }
      ];
    }
    return baseColumns;
  };

  const isNumericCol = (key: string) =>
    ['debit', 'credit', 'solde', 'brutCB', 'trpBrut', 'frais', 'tvaFrais', 'montant'].includes(key);

  const filteredBankTransactions = MOCK_BANK_TRANSACTIONS.filter(row => {
    const [, mon, yr] = row.date.split('/');
    return yr === year && mon === month && (bankFilter === 'TOUT' || row.type === bankFilter);
  });
  const totalBank = filteredBankTransactions.reduce((acc, curr) => acc + curr.montant, 0);

  const filteredBank = filteredBankTransactions.filter(row =>
    Object.values(row).some(val => val && val.toString().toLowerCase().includes(search.toLowerCase()))
  );

  const monthKey = `${month}/${year}`;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="excel-section-title">Importation des extraits bancaires</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div className="border-2 border-dashed border-excel-border p-8 text-center rounded-lg bg-white/50 hover:border-excel-green transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
          <Upload size={32} className="text-excel-green" />
          <h3 className="font-semibold text-text-main">Import Relevé Bancaire</h3>
          <p className="text-sm text-text-secondary text-balance">Glissez-déposez votre fichier Excel de la banque ici (.xlsx, .csv)</p>
        </div>
      </div>

      <div className="excel-card">
        <div className="flex flex-wrap gap-5 mb-6 items-center">
          <div className="flex items-center gap-2.5">
            <Filter size={18} className="text-text-secondary" />
            <label className="text-sm font-semibold">Année :</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="excel-input text-sm">
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Mois :</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="excel-input text-sm">
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Août</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Filtre Banque :</label>
            <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)} className="excel-input text-sm">
              <option value="TOUT">TOUT</option>
              <option value="Virement">Virement</option>
              <option value="Espece">Espece</option>
              <option value="Ticket Resto">Ticket Resto</option>
              <option value="CV">CV</option>
              <option value="Cheque">Cheque</option>
              <option value="CB">CB</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-bold flex items-center gap-2">
              Journal de Banque - {month}/{year}
              <Maximize
                size={16}
                onClick={() => setExpandedTable('bank')}
                className="cursor-pointer text-text-secondary hover:text-excel-green"
              />
            </h4>
          </div>
          <div className="excel-table-container">
            <table className="excel-table">
              <thead>
                <tr>
                  {getBankColumns(bankFilter).map(col => (
                    <th key={col.key} className={isNumericCol(col.key) ? 'text-right' : ''}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBankTransactions.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {getBankColumns(bankFilter).map(col => {
                      let value = col.value || (row as any)[col.key];
                      if (['brutCB', 'trpBrut', 'frais', 'tvaFrais'].includes(col.key) && ticketRestoData[monthKey]) {
                        value = (ticketRestoData[monthKey] as any)[col.key] || '';
                      }
                      if (col.format && value !== '') value = col.format(value);
                      return (
                        <td key={col.key} className={isNumericCol(col.key) ? 'text-right' : ''}>
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-[#f8f9fa] font-bold">
                  <td colSpan={getBankColumns(bankFilter).length - 1}>TOTAL</td>
                  <td className="text-right text-excel-green">{totalBank.toLocaleString()} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bankFilter === 'Ticket Resto' && (
        <div className="excel-card border-t-4 border-t-excel-green">
          <h3 className="excel-section-title">Traitement des factures Ticket Resto</h3>
          <p className="text-sm text-text-secondary mb-6">
            Importez les factures PDF pour extraire automatiquement les données via OCR.
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px] border border-excel-border rounded-sm p-3 bg-bg-gray/50 flex items-center gap-3">
              <FileText className="text-text-secondary" size={24} />
              <input type="file" accept=".pdf" multiple className="text-sm" />
            </div>
            <button
              className="excel-button-primary flex items-center gap-2"
              onClick={() => {
                setTicketRestoData({
                  [monthKey]: { brutCB: 320.00, trpBrut: 300.00, frais: 20.00, tvaFrais: 4.00 }
                });
                alert('Données extraites via OCR simulé.');
              }}
            >
              Traiter les PDFs (OCR)
            </button>
          </div>
          {ticketRestoData[monthKey] && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-excel-green-light/30 border border-excel-green-light rounded-sm">
              <div>
                <span className="block text-xs text-text-secondary uppercase font-bold">BRUT CB</span>
                <span className="text-lg font-bold text-excel-green">{ticketRestoData[monthKey].brutCB} €</span>
              </div>
              <div>
                <span className="block text-xs text-text-secondary uppercase font-bold">TRP BRUT</span>
                <span className="text-lg font-bold text-excel-green">{ticketRestoData[monthKey].trpBrut} €</span>
              </div>
              <div>
                <span className="block text-xs text-text-secondary uppercase font-bold">FRAIS</span>
                <span className="text-lg font-bold text-excel-green">{ticketRestoData[monthKey].frais} €</span>
              </div>
              <div>
                <span className="block text-xs text-text-secondary uppercase font-bold">TVA FRAIS</span>
                <span className="text-lg font-bold text-excel-green">{ticketRestoData[monthKey].tvaFrais} €</span>
              </div>
            </div>
          )}
        </div>
      )}

      {expandedTable && (
        <div className="fixed inset-0 bg-white z-[2000] overflow-auto flex flex-col">
          <div className="flex justify-between items-center p-8 border-b border-excel-border">
            <h3 className="text-2xl font-bold text-excel-green">Journal de Banque - {month}/{year}</h3>
            <button
              onClick={() => setExpandedTable(null)}
              className="excel-button-secondary flex items-center gap-2"
            >
              <X size={18} /> Fermer
            </button>
          </div>
          <div className="p-8 flex-1">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="excel-input w-full text-lg p-3"
              />
            </div>
            <div className="excel-table-container max-h-[calc(100vh-250px)]">
              <table className="excel-table">
                <thead>
                  <tr>
                    {getBankColumns(bankFilter).map(col => (
                      <th key={col.key} className={isNumericCol(col.key) ? 'text-right' : ''}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBank.map((row, idx) => (
                    <tr key={idx}>
                      {getBankColumns(bankFilter).map(col => {
                        let value = col.value || (row as any)[col.key];
                        if (col.format) value = col.format(value);
                        return <td key={col.key} className={isNumericCol(col.key) ? 'text-right' : ''}>{value}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 bg-white z-20">
                  <tr className="bg-[#f8f9fa] font-bold">
                    <td colSpan={getBankColumns(bankFilter).length - 1}>TOTAL</td>
                    <td className="text-right text-excel-green">{totalBank.toLocaleString()} €</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BankImportScreen;
