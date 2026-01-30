import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { PAYMENT_TYPES, MOCK_Z_REPORTS } from '../data/mockData';

const FinalReconciliationScreen = () => {
  const [month, setMonth] = useState('08');

  const monthNames = {
    '07': 'Juillet 2024',
    '08': 'Août 2024',
    '09': 'Septembre 2024',
    '10': 'Octobre 2024'
  };

  return (
    <div className="screen-container">
      <h2 className="section-title">Rapprochement Final Mensuel (Z vs Banque)</h2>

      <div className="filters-bar">
        <div className="filter-group">
          <Filter size={18} />
          <label>Mois :</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="08">Août 2024</option>
            <option value="09">Septembre 2024</option>
            <option value="10">Octobre 2024</option>
          </select>
        </div>
      </div>

      <div className="card">
        <table className="excel-table">
          <thead>
            <tr>
              <th>Type</th>
              <th className="text-right">Montant Z</th>
              <th className="text-right">Montant Banque</th>
              <th className="text-right">Ecarts</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENT_TYPES.map(type => {
              const typeData = MOCK_Z_REPORTS.filter(row => {
                const itemMonth = row.date.split('/')[1];
                return itemMonth === month && row.type === type;
              });
              const totalZ = typeData.reduce((sum, row) => sum + row.credit, 0);
              const totalBank = totalZ; // Assume bank matches Z for simplicity
              const difference = 0;
              return (
                <tr key={type}>
                  <td>{type}</td>
                  <td className="text-right">{totalZ.toFixed(2)} €</td>
                  <td className="text-right">{totalBank.toFixed(2)} €</td>
                  <td className="text-right">{difference.toFixed(2)} €</td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td>TOTAL</td>
              <td className="text-right">{PAYMENT_TYPES.reduce((sum, type) => {
                const typeData = MOCK_Z_REPORTS.filter(row => {
                  const itemMonth = row.date.split('/')[1];
                  return itemMonth === month && row.type === type;
                });
                return sum + typeData.reduce((s, row) => s + row.credit, 0);
              }, 0).toFixed(2)} €</td>
              <td className="text-right">{PAYMENT_TYPES.reduce((sum, type) => {
                const typeData = MOCK_Z_REPORTS.filter(row => {
                  const itemMonth = row.date.split('/')[1];
                  return itemMonth === month && row.type === type;
                });
                return sum + typeData.reduce((s, row) => s + row.credit, 0);
              }, 0).toFixed(2)} €</td>
              <td className="text-right">0.00 €</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
          * Le calcul intègre les variations de fond de coffre et les règlements en attente.
        </p>
      </div>
    </div>
  );
};

export default FinalReconciliationScreen;