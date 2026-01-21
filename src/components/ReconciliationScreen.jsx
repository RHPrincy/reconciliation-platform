import React, { useState, useEffect } from 'react';
import { Filter, Calculator, Save } from 'lucide-react';
import { PAYMENT_TYPES, MOCK_Z_REPORTS } from '../data/mockData';

const ReconciliationScreen = () => {
  const [month, setMonth] = useState('08');
  const [paymentType, setPaymentType] = useState('Espèces');
  const [counts, setCounts] = useState({});
  const [outflows, setOutflows] = useState({});
  const [safeBalance, setSafeBalance] = useState('1500.00');

  // Filter Z reports for selected month and payment type
  const filteredData = MOCK_Z_REPORTS.filter(item => {
    const itemMonth = item.date.split('/')[1];
    return itemMonth === month && item.type === paymentType;
  });

  const handleCountChange = (date, value) => {
    setCounts(prev => ({ ...prev, [date]: value }));
  };

  const handleOutflowChange = (date, value) => {
    setOutflows(prev => ({ ...prev, [date]: value }));
  };

  const calculateVariance = (zValue, actualValue) => {
    if (!actualValue) return 0;
    return parseFloat(actualValue) - zValue;
  };

  return (
    <div className="screen-container">
      <h2 className="section-title">Rapprochement et Écarts</h2>

      <div className="card">
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
          <div className="filter-group">
            <label>Type de règlement :</label>
            <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="excel-table-container" style={{ maxHeight: '500px' }}>
          <table className="excel-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-right">Valeur Z Rapport</th>
                <th className="text-right">Comptage Réel</th>
                <th className="text-right">Écart</th>
                <th className="text-right">Sorties de caisse / Ajustements</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => {
                const count = counts[row.date] || '';
                const variance = calculateVariance(row.credit, count);
                return (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td className="text-right">{row.credit.toFixed(2)} €</td>
                    <td className="input-cell">
                      <input
                        type="number"
                        value={count}
                        placeholder="0.00"
                        onChange={(e) => handleCountChange(row.date, e.target.value)}
                      />
                    </td>
                    <td className={`text-right ${variance < 0 ? 'variance-neg' : variance > 0 ? 'variance-pos' : ''}`}>
                      {variance.toFixed(2)} €
                    </td>
                    <td className="input-cell">
                      <input
                        type="number"
                        value={outflows[row.date] || ''}
                        placeholder="0.00"
                        onChange={(e) => handleOutflowChange(row.date, e.target.value)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 className="section-title">Résumé Mensuel par Type</h3>
          <table className="excel-table">
            <thead>
              <tr>
                <th>Type</th>
                <th className="text-right">Total Z</th>
                <th className="text-right">Total Réel</th>
                <th className="text-right">Écart Cumulé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Espèces</td>
                <td className="text-right">12,450.00 €</td>
                <td className="text-right">12,442.50 €</td>
                <td className="text-right variance-neg">-7.50 €</td>
              </tr>
              <tr>
                <td>Carte Bancaire</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">0.00 €</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ fontWeight: 'bold' }}>Solde Fond de Coffre Fin de Mois :</label>
            <input
              type="number"
              value={safeBalance}
              onChange={(e) => setSafeBalance(e.target.value)}
              style={{ width: '120px', textAlign: 'right', fontWeight: 'bold', color: 'var(--excel-green)' }}
            />
            <button className="nav-link active" style={{ padding: '6px 12px' }}>
              <Save size={16} /> Valider le mois
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Rapprochement Final Mensuel (Z vs Banque)</h3>
          <table className="excel-table">
            <thead>
              <tr>
                <th>Flux</th>
                <th className="text-right">Montant Z</th>
                <th className="text-right">Montant Banque</th>
                <th className="text-right">Différence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ventes CB</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">45,150.00 €</td>
                <td className="text-right">-50.00 €</td>
              </tr>
              <tr>
                <td>Remises Espèces</td>
                <td className="text-right">8,000.00 €</td>
                <td className="text-right">8,000.00 €</td>
                <td className="text-right">0.00 €</td>
              </tr>
              <tr className="total-row">
                <td>TOTAL</td>
                <td className="text-right">53,200.00 €</td>
                <td className="text-right">53,150.00 €</td>
                <td className="text-right variance-neg">-50.00 €</td>
              </tr>
            </tbody>
          </table>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
            * Le calcul intègre les variations de fond de coffre et les règlements en attente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationScreen;
