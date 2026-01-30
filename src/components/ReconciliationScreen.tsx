import React, { useState } from 'react';
import { Filter, Save } from 'lucide-react';
import { PAYMENT_TYPES, MOCK_Z_REPORTS } from '../data/mockData';
import { PaymentType } from '../types';

const ReconciliationScreen: React.FC = () => {
  const [month, setMonth] = useState<string>('08');
  const [paymentType, setPaymentType] = useState<PaymentType>('Espèces');
  const [counts, setCounts] = useState<Record<string, string>>({});
  const [outflows, setOutflows] = useState<Record<string, string>>({});
  const [safeBalance, setSafeBalance] = useState<string>('1500.00');

  // Filter Z reports for selected month and payment type
  const filteredData = MOCK_Z_REPORTS.filter(item => {
    const itemMonth = item.date.split('/')[1];
    return itemMonth === month && item.type === paymentType;
  });

  const handleCountChange = (date: string, value: string) => {
    setCounts(prev => ({ ...prev, [date]: value }));
  };

  const handleOutflowChange = (date: string, value: string) => {
    setOutflows(prev => ({ ...prev, [date]: value }));
  };

  const calculateVariance = (zValue: number, actualValue: string) => {
    if (!actualValue) return 0;
    return parseFloat(actualValue) - zValue;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl mb-6 text-[var(--text-main)] border-l-4 border-[var(--excel-green)] pl-2.5 font-semibold">
        Rapprochement et Écarts
      </h2>

      <div className="bg-white border border-[var(--border-color)] p-6 mb-8 rounded-sm shadow-xs">
        <div className="flex flex-wrap gap-5 mb-6 items-center">
          <div className="flex items-center gap-2.5">
            <Filter size={18} />
            <label className="text-sm font-semibold">Mois :</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--excel-green)]"
            >
              <option value="08">Août 2024</option>
              <option value="09">Septembre 2024</option>
              <option value="10">Octobre 2024</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Type de règlement :</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as PaymentType)}
              className="px-3 py-1.5 border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--excel-green)]"
            >
              {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="excel-table-container max-h-[500px]">
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
                  <tr key={idx} className="hover:bg-[#f1f1f1]">
                    <td>{row.date}</td>
                    <td className="text-right">{row.credit.toFixed(2)} €</td>
                    <td className="p-0!">
                      <input
                        type="number"
                        value={count}
                        placeholder="0.00"
                        onChange={(e) => handleCountChange(row.date, e.target.value)}
                        className="w-full h-full border-none px-2 py-1.5 text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--excel-green)] focus:bg-white"
                      />
                    </td>
                    <td className={`text-right ${variance < 0 ? 'text-[#d93025] bg-[#fce8e6]' : variance > 0 ? 'text-[#188038] bg-[#e6f4ea]' : ''}`}>
                      {variance.toFixed(2)} €
                    </td>
                    <td className="p-0!">
                      <input
                        type="number"
                        value={outflows[row.date] || ''}
                        placeholder="0.00"
                        onChange={(e) => handleOutflowChange(row.date, e.target.value)}
                        className="w-full h-full border-none px-2 py-1.5 text-right bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--excel-green)] focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-[var(--border-color)] p-6 mb-8 rounded-sm shadow-xs">
          <h3 className="text-xl mb-6 text-[var(--text-main)] border-l-4 border-[var(--excel-green)] pl-2.5 font-semibold">Résumé Mensuel par Type</h3>
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
              <tr className="hover:bg-[#f1f1f1]">
                <td>Espèces</td>
                <td className="text-right">12,450.00 €</td>
                <td className="text-right">12,442.50 €</td>
                <td className="text-right text-[#d93025] bg-[#fce8e6]">-7.50 €</td>
              </tr>
              <tr className="hover:bg-[#f1f1f1]">
                <td>Carte Bancaire</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">0.00 €</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="font-bold text-sm">Solde Fond de Coffre Fin de Mois :</label>
            <input
              type="number"
              value={safeBalance}
              onChange={(e) => setSafeBalance(e.target.value)}
              className="w-[120px] text-right font-bold text-[var(--excel-green)] px-3 py-1.5 border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--excel-green)]"
            />
            <button className="flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm bg-[var(--excel-green-light)] text-[var(--excel-green)] font-semibold border border-transparent hover:border-[var(--excel-green)]">
              <Save size={16} /> Valider le mois
            </button>
          </div>
        </div>

        <div className="bg-white border border-[var(--border-color)] p-6 mb-8 rounded-sm shadow-xs">
          <h3 className="text-xl mb-6 text-[var(--text-main)] border-l-4 border-[var(--excel-green)] pl-2.5 font-semibold">Rapprochement Final Mensuel (Z vs Banque)</h3>
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
              <tr className="hover:bg-[#f1f1f1]">
                <td>Ventes CB</td>
                <td className="text-right">45,200.00 €</td>
                <td className="text-right">45,150.00 €</td>
                <td className="text-right text-[#d93025] bg-[#fce8e6]">-50.00 €</td>
              </tr>
              <tr className="hover:bg-[#f1f1f1]">
                <td>Remises Espèces</td>
                <td className="text-right">8,000.00 €</td>
                <td className="text-right">8,000.00 €</td>
                <td className="text-right">0.00 €</td>
              </tr>
              <tr className="bg-[#f8f9fa] font-bold">
                <td>TOTAL</td>
                <td className="text-right">53,200.00 €</td>
                <td className="text-right">53,150.00 €</td>
                <td className="text-right text-[#d93025] bg-[#fce8e6]">-50.00 €</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-[var(--text-secondary)] mt-2.5 italic">
            * Le calcul intègre les variations de fond de coffre et les règlements en attente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationScreen;
