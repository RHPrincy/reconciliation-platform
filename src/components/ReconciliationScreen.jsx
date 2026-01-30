import React, { useState, useEffect } from 'react';
import { Filter, Calculator, Save, Maximize } from 'lucide-react';
import { PAYMENT_TYPES, MOCK_Z_REPORTS } from '../data/mockData';

const ReconciliationScreen = () => {
  const [month, setMonth] = useState('08');
  const [paymentType, setPaymentType] = useState('Espèces');
  const [counts, setCounts] = useState({});
  const [outflows, setOutflows] = useState({});
  const [retraits, setRetraits] = useState({});
  const [balances, setBalances] = useState({
    '07': { 'Espèce': '1200.00', 'Ticket resto': '0.00', 'CHQ': '0.00', 'CV': '0.00' },
    '08': { 'Espèce': '1500.00', 'Ticket resto': '0.00', 'CHQ': '0.00', 'CV': '0.00' }
  }); // balances per month per type
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('LGTF');

  const monthNames = {
    '07': 'Juillet 2024',
    '08': 'Août 2024',
    '09': 'Septembre 2024',
    '10': 'Octobre 2024'
  };

  // Filter Z reports for selected month and payment type
  const baseFilteredData = MOCK_Z_REPORTS.filter(item => {
    const itemMonth = item.date.split('/')[1];
    return itemMonth === month && item.type === paymentType && item.company === selectedCompany;
  });

  const filteredData = expanded ? baseFilteredData.filter(row => 
    Object.values(row).some(val => val.toString().toLowerCase().includes(search.toLowerCase()))
  ) : baseFilteredData;

  const handleCountChange = (date, value) => {
    setCounts(prev => ({ ...prev, [date]: value }));
  };

  const handleOutflowChange = (date, value) => {
    setOutflows(prev => ({ ...prev, [date]: value }));
  };

  const handleRetraitChange = (date, value) => {
    setRetraits(prev => ({ ...prev, [date]: value }));
  };

  const calculateVariance = (zValue, actualValue) => {
    if (!actualValue) return 0;
    return parseFloat(actualValue) - zValue;
  };

  const summaryData = PAYMENT_TYPES.map(type => {
    const typeData = MOCK_Z_REPORTS.filter(row => {
      const itemMonth = row.date.split('/')[1];
      return itemMonth === month && row.type === type;
    });
    const totalZ = typeData.reduce((sum, row) => sum + row.credit, 0);
    const totalReal = typeData.reduce((sum, row) => {
      const count = parseFloat(counts[row.date] || 0);
      return sum + count;
    }, 0);
    const ecart = totalReal - totalZ;
    return { type, totalZ, totalReal, ecart };
  });

  const previousMonth = (parseInt(month) - 1).toString().padStart(2, '0');

  return (
    <div className="screen-container">
      <div className="global-filter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        <label style={{ marginRight: '15px' }}>Société :</label>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} style={{ padding: '10px 15px', fontSize: '18px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="LGTF">LGTF</option>
          <option value="TOIT">TOIT</option>
          <option value="SDM">SDM</option>
        </select>
      </div>

      <div className="card">
        <h2 className="section-title">Rapprochement et Écarts pour {selectedCompany} <Maximize size={16} onClick={() => setExpanded(true)} style={{ cursor: 'pointer', float: 'right' }} /></h2>

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
              <option value="Espèces">Espèces</option>
              <option value="Carte Bancaire">CB</option>
              <option value="TR">TR</option>
              <option value="TR-CB">TR CB</option>
              <option value="Chèques">CHQ</option>
            </select>
          </div>
        </div>

        <div className="excel-table-container" style={{ maxHeight: '500px', overflowX: 'hidden' }}>
          <table className="excel-table">
            <thead>
              <tr>
                <th>Date</th>
                <th className="text-right">Valeur Z Rapport</th>
                <th className="text-right">Comptage Réel</th>
                <th className="text-right">Écart</th>
                <th className="text-right">Retrait</th>
                <th className="text-right">Sorties de caisse</th>
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
                        value={retraits[row.date] || ''}
                        placeholder="0.00"
                        onChange={(e) => handleRetraitChange(row.date, e.target.value)}
                      />
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
        {!expanded && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#097e23', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }} 
            onClick={() => setShowModal(true)}
          >
            Sauvegarder
          </button>
        </div>
      )}
      </div>

      <div className="card">
        <h3 className="section-title">Gestion du Fond de Caisse</h3>
        <table className="excel-table">
          <thead>
            <tr>
              <th>Type</th>
              <th className="text-right">Fond Initial ({monthNames[previousMonth] || previousMonth})</th>
              <th className="text-right">Fond Final ({monthNames[month]})</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {['Espèce', 'Ticket resto', 'CHQ', 'CV'].map(type => {
              const initial = balances[previousMonth]?.[type] || '0.00';
              const final = balances[month]?.[type] || '0.00';
              return (
                <tr key={type}>
                  <td>{type}</td>
                  <td className="text-right">{initial} €</td>
                  <td className="input-cell">
                    <input
                      type="number"
                      value={final}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBalances(prev => ({
                          ...prev,
                          [month]: { ...prev[month], [type]: val }
                        }));
                      }}
                      style={{color: 'var(--excel-green)'}}
                    />
                  </td>
                  <td>
                    <button 
                      className="nav-link active" 
                      style={{ margin: 'auto', padding: '4px 8px', fontSize: '12px', borderRadius: '4px', backgroundColor: '#097e23', color: 'white', border: 'none', cursor: 'pointer' }} 
                      onClick={() => {
                        // Validation action if needed
                      }}
                    >
                      <Save size={12} /> Valider
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <p>Confirmer la sauvegarde des données ?</p>
            <div style={{ marginTop: '20px' }}>
              <button onClick={() => { console.log("Donnee enregistrer"); setShowModal(false); }} style={{ marginRight: '10px', padding: '8px 16px' }}>Oui</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px' }}>Non</button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, background: 'white', zIndex: 999, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 40px' }}>
            <h3>Rapprochement et Écarts pour {selectedCompany}</h3>
            <button onClick={() => setExpanded(false)} style={{ padding: '10px 20px', fontSize: '16px' }}>Fermer</button>
          </div>
          <div style={{ padding: '10px 40px', overflowX: 'hidden' }}>
            <table className="excel-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Valeur Z Rapport</th>
                  <th className="text-right">Comptage Réel</th>
                  <th className="text-right">Écart</th>
                  <th className="text-right">Sorties de caisse</th>
                  <th className="text-right">Retrait</th>
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
                      <td className="input-cell">
                        <input
                          type="number"
                          value={retraits[row.date] || ''}
                          placeholder="0.00"
                          onChange={(e) => handleRetraitChange(row.date, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }} 
                onClick={() => setShowModal(true)}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReconciliationScreen;
