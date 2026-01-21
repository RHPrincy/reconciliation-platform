import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Filter } from 'lucide-react';
import { MOCK_Z_REPORTS, MOCK_BANK_TRANSACTIONS } from '../data/mockData';

const ImportScreen = () => {
  const [year, setYear] = useState('2024-2025');
  const [quarter, setQuarter] = useState('Q1');

  const totalZ = MOCK_Z_REPORTS.reduce((acc, curr) => acc + curr.credit, 0);
  const totalBank = MOCK_BANK_TRANSACTIONS.reduce((acc, curr) => acc + curr.montant, 0);

  return (
    <div className="screen-container">
      <h2 className="section-title">Importation des rapports Z et extraits bancaires</h2>

      <div className="upload-grid">
        <div className="upload-area">
          <Upload size={32} className="icon-excel" style={{ margin: '0 auto' }} />
          <h3>Import Rapport Z de caisse</h3>
          <p>Glissez-déposez votre fichier Excel POS ici (.xlsx, .csv)</p>
        </div>
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
            <label>Exercice Comptable :</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2024-2025">Août 2024 - Juillet 2025</option>
              <option value="2023-2024">Août 2023 - Juillet 2024</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Trimestre :</label>
            <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
              <option value="Q1">Q1 (Août - Oct)</option>
              <option value="Q2">Q2 (Nov - Jan)</option>
              <option value="Q3">Q3 (Fév - Avr)</option>
              <option value="Q4">Q4 (Mai - Jui)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '10px' }}>Journal de Caisse (Z)</h4>
            <div className="excel-table-container">
              <table className="excel-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Compte</th>
                    <th>Journal</th>
                    <th>Description</th>
                    <th className="text-right">Débit</th>
                    <th className="text-right">Crédit</th>
                    <th className="text-right">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_Z_REPORTS.slice(0, 15).map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{row.compte}</td>
                      <td>{row.journal}</td>
                      <td>{row.libelle}</td>
                      <td className="text-right">{row.debit.toFixed(2)} €</td>
                      <td className="text-right">{row.credit.toFixed(2)} €</td>
                      <td className="text-right">{(idx * 100).toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="5">TOTAL</td>
                    <td className="text-right total-value">{totalZ.toLocaleString()} €</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '10px' }}>Journal de Banque</h4>
            <div className="excel-table-container">
              <table className="excel-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Libellé</th>
                    <th className="text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BANK_TRANSACTIONS.slice(0, 10).map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{row.libelle}</td>
                      <td className="text-right">{row.montant.toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="2">TOTAL</td>
                    <td className="text-right total-value">{totalBank.toLocaleString()} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Récapitulatif Z par Type de Règlement</h3>
        <table className="excel-table">
          <thead>
            <tr>
              <th>Type de Règlement</th>
              <th className="text-right">Août 2024</th>
              <th className="text-right">Septembre 2024</th>
              <th className="text-right">Octobre 2024</th>
              <th className="text-right">Total Trimestre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Espèces</td>
              <td className="text-right">12,450.00 €</td>
              <td className="text-right">11,200.00 €</td>
              <td className="text-right">13,100.00 €</td>
              <td className="text-right total-value">36,750.00 €</td>
            </tr>
            <tr>
              <td>Carte Bancaire</td>
              <td className="text-right">45,200.00 €</td>
              <td className="text-right">42,800.00 €</td>
              <td className="text-right">46,500.00 €</td>
              <td className="text-right total-value">134,500.00 €</td>
            </tr>
            <tr>
              <td>Titres Restaurant</td>
              <td className="text-right">5,400.00 €</td>
              <td className="text-right">4,900.00 €</td>
              <td className="text-right">5,100.00 €</td>
              <td className="text-right total-value">15,400.00 €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>TOTAL MENSUEL</td>
              <td className="text-right">63,050.00 €</td>
              <td className="text-right">58,900.00 €</td>
              <td className="text-right">64,700.00 €</td>
              <td className="text-right total-value">186,650.00 €</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ImportScreen;
