import { useState } from 'react';
import { Filter, Save, Maximize, X, CheckCircle } from 'lucide-react';
import { PAYMENT_CATEGORIES, MOCK_Z_REPORTS, PaymentCategory } from '../data/mockData';

const ReconciliationScreen = () => {
  const [month, setMonth] = useState('08');
  const [paymentType, setPaymentType] = useState<PaymentCategory>('Espèces');
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [outflows, setOutflows] = useState<Record<string, string>>({});
  const [retraits, setRetraits] = useState<Record<string, string>>({});
  const [balances, setBalances] = useState<Record<string, Record<string, string>>>({
    '07': { 'Espèces': '1200.00', 'Titres Restaurant': '0.00', 'Chèques': '0.00', 'Chèques Vacances': '0.00' },
    '08': { 'Espèces': '1500.00', 'Titres Restaurant': '0.00', 'Chèques': '0.00', 'Chèques Vacances': '0.00' }
  });
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('LGTF');

  const monthNames: Record<string, string> = {
    '07': 'Juillet 2024',
    '08': 'Août 2024',
    '09': 'Septembre 2024',
    '10': 'Octobre 2024'
  };

  const filteredData = MOCK_Z_REPORTS.filter(item => {
    const itemMonth = item.date.split('/')[1];
    return itemMonth === month && item.type === paymentType && item.company === selectedCompany;
  });

  const handleCountChange = (date: string, value: string) => {
    setCounts(prev => ({ ...prev, [date]: value }));
  };

  const handleOutflowChange = (date: string, value: string) => {
    setOutflows(prev => ({ ...prev, [date]: value }));
  };

  const handleRetraitChange = (date: string, value: string) => {
    setRetraits(prev => ({ ...prev, [date]: value }));
  };

  const calculateVariance = (zValue: number, actualValue: string) => {
    if (!actualValue) return 0;
    return parseFloat(actualValue) - zValue;
  };

  const previousMonth = (parseInt(month) - 1).toString().padStart(2, '0');

  const TableContent = () => (
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
              <td className="p-0">
                <input
                  type="number"
                  value={count}
                  placeholder="0.00"
                  onChange={(e) => handleCountChange(row.date, e.target.value)}
                  className="w-full h-full p-2 text-right border-none outline-none focus:bg-excel-green-light"
                />
              </td>
              <td className={`text-right font-bold ${
                variance < 0 ? 'text-red-600 bg-red-50' :
                variance > 0 ? 'text-green-600 bg-green-50' : ''
              }`}>
                {variance.toFixed(2)} €
              </td>
              <td className="p-0">
                <input
                  type="number"
                  value={retraits[row.date] || ''}
                  placeholder="0.00"
                  onChange={(e) => handleRetraitChange(row.date, e.target.value)}
                  className="w-full h-full p-2 text-right border-none outline-none focus:bg-excel-green-light"
                />
              </td>
              <td className="p-0">
                <input
                  type="number"
                  value={outflows[row.date] || ''}
                  placeholder="0.00"
                  onChange={(e) => handleOutflowChange(row.date, e.target.value)}
                  className="w-full h-full p-2 text-right border-none outline-none focus:bg-excel-green-light"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center p-5 bg-white border border-excel-border rounded-sm gap-4 text-lg font-bold">
        <label>Société :</label>
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="excel-input text-lg py-2"
        >
          <option value="LGTF">LGTF</option>
          <option value="TOIT">TOIT</option>
          <option value="SDM">SDM</option>
        </select>
      </div>

      <div className="excel-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-text-main border-l-4 border-excel-green pl-3">
            Rapprochement et Écarts - {selectedCompany}
          </h2>
          <Maximize
            size={18}
            onClick={() => setExpanded(true)}
            className="cursor-pointer text-text-secondary hover:text-excel-green transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-5 mb-6 items-center">
          <div className="flex items-center gap-2.5">
            <Filter size={18} className="text-text-secondary" />
            <label className="text-sm font-semibold">Mois :</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="excel-input text-sm">
              <option value="08">Août 2024</option>
              <option value="09">Septembre 2024</option>
              <option value="10">Octobre 2024</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Type de règlement :</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as PaymentCategory)}
              className="excel-input text-sm"
            >
              {PAYMENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="excel-table-container max-h-[500px]">
          <TableContent />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            className="excel-button-primary flex items-center gap-2 shadow-md"
            onClick={() => setShowModal(true)}
          >
            <Save size={18} /> Sauvegarder les saisies
          </button>
        </div>
      </div>

      <div className="excel-card">
        <h3 className="excel-section-title">Gestion du Fond de Caisse</h3>
        <div className="excel-table-container max-h-none">
          <table className="excel-table">
            <thead>
              <tr>
                <th>Type</th>
                <th className="text-right">Fond Initial ({monthNames[previousMonth] || previousMonth})</th>
                <th className="text-right">Fond Final ({monthNames[month]})</th>
                <th className="w-40 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {['Espèces', 'Titres Restaurant', 'Chèques', 'Chèques Vacances'].map(type => {
                const initial = balances[previousMonth]?.[type] || '0.00';
                const final = balances[month]?.[type] || '0.00';
                return (
                  <tr key={type}>
                    <td className="font-medium">{type}</td>
                    <td className="text-right">{initial} €</td>
                    <td className="p-0">
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
                        className="w-full h-full p-2 text-right border-none outline-none focus:bg-excel-green-light text-excel-green font-bold"
                      />
                    </td>
                    <td className="text-center">
                      <button
                        className="bg-excel-green text-white p-1.5 px-3 rounded text-xs flex items-center gap-1.5 mx-auto hover:bg-[#1a5c38] transition-colors"
                        onClick={() => {}}
                      >
                        <CheckCircle size={14} /> Valider
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded shadow-xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-excel-green-light text-excel-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Save size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Confirmer la sauvegarde</h3>
            <p className="text-text-secondary mb-6 text-sm">Voulez-vous enregistrer les modifications pour {monthNames[month]} ?</p>
            <div className="flex gap-3">
              <button
                onClick={() => { console.log("Donnée enregistrée"); setShowModal(false); }}
                className="flex-1 excel-button-primary"
              >
                Oui, sauvegarder
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 excel-button-secondary border-excel-border text-text-secondary hover:bg-bg-gray"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="fixed inset-0 bg-white z-[2000] overflow-auto flex flex-col">
          <div className="flex justify-between items-center p-8 border-b border-excel-border">
            <h3 className="text-2xl font-bold text-excel-green">Détail Rapprochement - {selectedCompany}</h3>
            <button
              onClick={() => setExpanded(false)}
              className="excel-button-secondary flex items-center gap-2"
            >
              <X size={18} /> Fermer
            </button>
          </div>
          <div className="p-8 flex-1">
            <div className="excel-table-container max-h-[calc(100vh-200px)]">
              <TableContent />
            </div>
            <div className="mt-8 flex justify-center">
              <button
                className="excel-button-primary px-12 py-3 text-lg"
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
