import React, { useState } from 'react';
import { Upload, Filter, Maximize } from 'lucide-react';
import { MOCK_BANK_TRANSACTIONS } from '../data/mockData';

const BankImportScreen = () => {
  const [bankFilter, setBankFilter] = useState('TOUT');
  const [expandedTable, setExpandedTable] = useState(null);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('08');
  const [ticketRestoData, setTicketRestoData] = useState({}); // to store processed data for ticket resto

  const getBankColumns = (filter) => {
    const baseColumns = [
      { key: 'date', label: 'Date' },
      { key: 'jnl', label: 'Jnl', value: 'BQ3' },
      { key: 'libelle', label: 'Libellé' }
    ];

    if (filter === 'TOUT') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => val.toFixed(2) + ' €' },
        { key: 'credit', label: 'Crédit', format: (val) => val.toFixed(2) + ' €' },
        { key: 'solde', label: 'Solde cumulé', format: (val) => val.toFixed(2) + ' €' }
      ];
    } else if (['Espece', 'CV', 'CB', 'Cheque'].includes(filter)) {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => val.toFixed(2) + ' €' }
      ];
    } else if (filter === 'Virement') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => val.toFixed(2) + ' €' },
        { key: 'note', label: 'Note' },
        { key: 'exercice', label: 'Exercice' }
      ];
    } else if (filter === 'Ticket Resto') {
      return [
        ...baseColumns,
        { key: 'debit', label: 'Débit', format: (val) => val.toFixed(2) + ' €' },
        { key: 'brutCB', label: 'BRUT CB', format: (val) => val.toFixed(2) + ' €' },
        { key: 'trpBrut', label: 'TRP BRUT', format: (val) => val.toFixed(2) + ' €' },
        { key: 'frais', label: 'FRAIS', format: (val) => val.toFixed(2) + ' €' },
        { key: 'tvaFrais', label: 'TVA FRAIS', format: (val) => val.toFixed(2) + ' €' }
      ];
    }
  };

  const filteredBankTransactions = MOCK_BANK_TRANSACTIONS.filter(row => {
    const [day, mon, yr] = row.date.split('/');
    return yr === year && mon === month && (bankFilter === 'TOUT' || row.type === bankFilter);
  });
  const totalBank = filteredBankTransactions.reduce((acc, curr) => acc + curr.montant, 0);

  const filteredBank = filteredBankTransactions.filter(row => 
    Object.values(row).some(val => val && val.toString().toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="screen-container">
      <h2 className="section-title">Importation des extraits bancaires</h2>

      <div className="upload-grid">
        <div className="upload-area">
          <Upload size={32} className="icon-excel" style={{ margin: '0 auto' }} />
          <h3>Import Relevé Bancaire</h3>
          <p>Glissez-déposez votre fichier Excel de la banque ici (.xlsx, .csv)</p>
        </div>
      </div>

      <div className="card">
        <div className="filters-bar">
          <div className="filter-group">
            <Filter size={18} />
            <label>Année :</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Mois :</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
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
          <div className="filter-group">
            <label>Filtre Banque :</label>
            <select value={bankFilter} onChange={(e) => setBankFilter(e.target.value)}>
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
          <h4 style={{ marginBottom: '10px' }}>Journal de Banque - {month}/{year} 
            <Maximize size={16} onClick={() => setExpandedTable('bank')} style={{ cursor: 'pointer', float: 'right' }} /></h4>
          <div className="excel-table-container">
            <table className="excel-table">
              <thead>
                <tr>
                  {getBankColumns(bankFilter).map(col => (
                    <th key={col.key} className={(col.key === 'debit' || col.key === 'credit' || col.key === 'solde' || col.key === 'brutCB' || col.key === 'trpBrut' || col.key === 'frais' || col.key === 'tvaFrais') ? 'text-right' : ''}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBankTransactions.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    {getBankColumns(bankFilter).map(col => {
                      let value = col.value || row[col.key];
                      if (['brutCB', 'trpBrut', 'frais', 'tvaFrais'].includes(col.key) && ticketRestoData[`${month}/${year}`]) {
                        value = ticketRestoData[`${month}/${year}`][col.key] || '';
                      }
                      if (col.format && value !== '') value = col.format(value);
                      return <td key={col.key} className={(col.key === 'debit' || col.key === 'credit' || col.key === 'solde' || col.key === 'brutCB' || col.key === 'trpBrut' || col.key === 'frais' || col.key === 'tvaFrais') ? 'text-right' : ''}>{value}</td>;
                    })}
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={getBankColumns(bankFilter).length - 1}>TOTAL</td>
                  <td className="text-right total-value">{totalBank.toLocaleString()} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {bankFilter === 'Ticket Resto' && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3 className="section-title">Traitement des factures Ticket Resto</h3>
          <p>Importez les factures PDF pour extraire automatiquement les données BRUT CB, TRP BRUT, FRAIS, TVA FRAIS via OCR.</p>
          <div style={{ marginBottom: '20px' }}>
            <input type="file" accept=".pdf" multiple style={{ marginRight: '10px' }} />
            <button 
              style={{ padding: '10px 20px', backgroundColor: '#097e23', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => {
                // Mock OCR processing
                setTicketRestoData({
                  '08/2024': { brutCB: 320.00, trpBrut: 300.00, frais: 20.00, tvaFrais: 4.00 }
                });
                alert('Données extraites via OCR simulé.');
              }}
            >
              Traiter les PDFs (OCR)
            </button>
          </div>
          {ticketRestoData[`${month}/${year}`] && (
            <div>
              <h4>Données extraites pour {month}/{year} :</h4>
              <p>BRUT CB: {ticketRestoData[`${month}/${year}`].brutCB} €</p>
              <p>TRP BRUT: {ticketRestoData[`${month}/${year}`].trpBrut} €</p>
              <p>FRAIS: {ticketRestoData[`${month}/${year}`].frais} €</p>
              <p>TVA FRAIS: {ticketRestoData[`${month}/${year}`].tvaFrais} €</p>
            </div>
          )}
        </div>
      )}

      {expandedTable && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 40px' }}>
            <h3>Journal de Banque - {month}/{year}</h3>
            <button onClick={() => setExpandedTable(null)} style={{ padding: '10px 20px', fontSize: '16px' }}>Fermer</button>
          </div>
          <div style={{ marginBottom: '20px', padding: '0 40px' }}>
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '16px' }} />
          </div>
          <div style={{ padding: '10px 40px' }}>
            <table className="excel-table">
              <thead>
                <tr>
                  {getBankColumns(bankFilter).map(col => (
                    <th key={col.key} className={(col.key === 'debit' || col.key === 'credit' || col.key === 'solde' || col.key === 'brutCB' || col.key === 'trpBrut' || col.key === 'frais' || col.key === 'tvaFrais') ? 'text-right' : ''}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBank.map((row, idx) => (
                  <tr key={idx}>
                    {getBankColumns(bankFilter).map(col => {
                      let value = col.value || row[col.key];
                      if (col.format) value = col.format(value);
                      return <td key={col.key} className={(col.key === 'debit' || col.key === 'credit' || col.key === 'solde' || col.key === 'brutCB' || col.key === 'trpBrut' || col.key === 'frais' || col.key === 'tvaFrais') ? 'text-right' : ''}>{value}</td>;
                    })}
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={getBankColumns(bankFilter).length - 1}>TOTAL</td>
                  <td className="text-right total-value">{totalBank.toLocaleString()} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default BankImportScreen;