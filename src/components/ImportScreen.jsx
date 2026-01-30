import React, { useState } from 'react';
import { Upload, Filter, Maximize } from 'lucide-react';
import { MOCK_Z_REPORTS, PAYMENT_TYPES } from '../data/mockData';

const ImportScreen = () => {
  const [year, setYear] = useState('2024-2025');
  const [quarter, setQuarter] = useState('Q1');
  const [selectedMonth, setSelectedMonth] = useState('Août');
  const [caMonthly, setCaMonthly] = useState({});
  const [expandedTable, setExpandedTable] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('LGTF');

  const getMonthsForQuarter = (quarter) => {
    const monthsMap = {
      Q1: ['Août', 'Septembre', 'Octobre'],
      Q2: ['Novembre', 'Décembre', 'Janvier'],
      Q3: ['Février', 'Mars', 'Avril'],
      Q4: ['Mai', 'Juin', 'Juillet']
    };
    return monthsMap[quarter] || [];
  };

  const getMonthsWithYears = (year, quarter) => {
    const [startYear] = year.split('-').map(Number);
    const quarters = {
      Q1: [
        { month: 'Août', year: startYear },
        { month: 'Septembre', year: startYear },
        { month: 'Octobre', year: startYear }
      ],
      Q2: [
        { month: 'Novembre', year: startYear },
        { month: 'Décembre', year: startYear },
        { month: 'Janvier', year: startYear + 1 }
      ],
      Q3: [
        { month: 'Février', year: startYear + 1 },
        { month: 'Mars', year: startYear + 1 },
        { month: 'Avril', year: startYear + 1 }
      ],
      Q4: [
        { month: 'Mai', year: startYear + 1 },
        { month: 'Juin', year: startYear + 1 },
        { month: 'Juillet', year: startYear + 1 }
      ]
    };
    return quarters[quarter] || [];
  };

  const parseDate = (dateStr) => {
    const [, month, year] = dateStr.split('/').map(Number);
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return { month: monthNames[month - 1], year };
  };

  const monthsToDisplay = getMonthsWithYears(year, quarter);

  const filteredData = MOCK_Z_REPORTS.filter(row => {
    const { month, year: rowYear } = parseDate(row.date);
    return monthsToDisplay.some(m => m.month === month && m.year === rowYear) && row.company === selectedCompany;
  });

  const summary = {};
  PAYMENT_TYPES.forEach(type => {
    summary[type] = {};
    monthsToDisplay.forEach(m => {
      summary[type][m.month] = 0;
    });
    summary[type].total = 0;
  });

  filteredData.forEach(row => {
    const { month } = parseDate(row.date);
    if (summary[row.type]) {
      summary[row.type][month] += row.credit;
      summary[row.type].total += row.credit;
    }
  });

  const totalZ = filteredData.reduce((acc, curr) => acc + curr.credit, 0);

  const filteredZ = MOCK_Z_REPORTS.filter(row => 
    Object.values(row).some(val => val.toString().toLowerCase().includes(search.toLowerCase())) && row.company === selectedCompany
  );

  return (
    <div className="screen-container">
      <h2 className="section-title">Importation des rapports Z de caisse</h2>

      <div className="global-filter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        <label style={{ marginRight: '15px' }}>Société :</label>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} style={{ padding: '10px 15px', fontSize: '18px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="LGTF">LGTF</option>
          <option value="TOIT">TOIT</option>
          <option value="SDM">SDM</option>
        </select>
      </div>

      <div className="upload-grid">
        <div className="upload-area">
          <Upload size={32} className="icon-excel" style={{ margin: '0 auto' }} />
          <h3>Import Rapport Z de caisse pour {selectedCompany}</h3>
          <p>Glissez-déposez votre fichier Excel POS ici (.xlsx, .csv)</p>
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
              <option value="Q1">T1 (Août - Oct)</option>
              <option value="Q2">T2 (Nov - Jan)</option>
              <option value="Q3">T3 (Fév - Avr)</option>
              <option value="Q4">T4 (Mai - Jui)</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Mois :</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {getMonthsForQuarter(quarter).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ marginBottom: '10px' }}>Journal de Caisse (Z) <Maximize size={16} onClick={() => setExpandedTable('z')} style={{ cursor: 'pointer', float: 'right' }} /></h4>
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
                  {filteredData.slice(0, 15).map((row, idx) => (
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
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Récapitulatif</h3>
        <table className="excel-table">
          <thead>
            <tr>
              <th>Type de Règlement</th>
              {monthsToDisplay.map(m => (
                <th key={m.month} className="text-right">{m.month} {m.year}</th>
              ))}
              <th className="text-right">Total Trimestre</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENT_TYPES.map(type => (
              <tr key={type}>
                <td>{type}</td>
                {monthsToDisplay.map(m => (
                  <td key={m.month} className="text-right">{summary[type][m.month].toLocaleString()} €</td>
                ))}
                <td className="text-right total-value">{summary[type].total.toLocaleString()} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td>TOTAL MENSUEL (Encaissement)</td>
              {monthsToDisplay.map(m => {
                const totalMonth = PAYMENT_TYPES.reduce((sum, t) => sum + summary[t][m.month], 0);
                return <td key={m.month} className="text-right">{totalMonth.toLocaleString()} €</td>;
              })}
              <td className="text-right total-value">{PAYMENT_TYPES.reduce((sum, t) => sum + summary[t].total, 0).toLocaleString()} €</td>
            </tr>
            <tr>
              <td>CA</td>
              {monthsToDisplay.map(m => (
                <td key={m.month} className="text-right">
                  <input type="number" value={caMonthly[m.month] ?? ''} onChange={(e) => {

                    const val = e.target.value === '' ? undefined : Number(e.target.value);

                    setCaMonthly({...caMonthly, [m.month]: val});

                  }} style={{ width: '100%', textAlign: 'right', border: 'none', background: 'transparent', outline: 'none' }} />
                </td>
              ))}
              <td className="text-right total-value">{Object.values(caMonthly).reduce((sum, val) => sum + (val ?? 0), 0).toLocaleString()} €</td>
            </tr>
            <tr className="total-row">
              <td>Ecart (solde client theorique)</td>
              {monthsToDisplay.map(m => {
                const totalMonth = PAYMENT_TYPES.reduce((sum, t) => sum + summary[t][m.month], 0);
                const caMonth = caMonthly[m.month] ?? 0;
                return <td key={m.month} className="text-right">{(caMonth - totalMonth).toLocaleString()} €</td>;
              })}
              <td className="text-right total-value">{(Object.values(caMonthly).reduce((sum, val) => sum + (val ?? 0), 0) - PAYMENT_TYPES.reduce((sum, t) => sum + summary[t].total, 0)).toLocaleString()} €</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {expandedTable && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 40px' }}>
            <h3>Journal de Caisse (Z)</h3>
            <button onClick={() => setExpandedTable(null)} style={{ padding: '10px 20px', fontSize: '16px' }}>Fermer</button>
          </div>
          <div style={{ marginBottom: '20px', padding: '0 40px' }}>
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '10px', fontSize: '16px' }} />
          </div>
          <div style={{ padding: '10px 40px' }}>
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
                {filteredZ.map((row, idx) => (
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
      )}

    </div>
  );
};

export default ImportScreen;
