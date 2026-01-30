import { useState } from 'react';
import { Filter } from 'lucide-react';
import { PAYMENT_CATEGORIES, MOCK_Z_REPORTS } from '../data/mockData';

const FinalReconciliationScreen = () => {
  const [month, setMonth] = useState('08');

  const monthNames: Record<string, string> = {
    '07': 'Juillet 2024',
    '08': 'Août 2024',
    '09': 'Septembre 2024',
    '10': 'Octobre 2024'
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="excel-section-title">Rapprochement Final Mensuel (Z vs Banque)</h2>

      <div className="excel-card">
        <div className="flex items-center gap-5 mb-6">
          <div className="flex items-center gap-2.5">
            <Filter size={18} className="text-text-secondary" />
            <label className="text-sm font-semibold">Mois :</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="excel-input text-sm">
              <option value="08">{monthNames['08']}</option>
              <option value="09">{monthNames['09']}</option>
              <option value="10">{monthNames['10']}</option>
            </select>
          </div>
        </div>

        <div className="excel-table-container max-h-none">
          <table className="excel-table">
            <thead>
              <tr>
                <th>Type</th>
                <th className="text-right">Montant Z</th>
                <th className="text-right">Montant Banque</th>
                <th className="text-right">Écarts</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENT_CATEGORIES.map(type => {
                const typeData = MOCK_Z_REPORTS.filter(row => {
                  const itemMonth = row.date.split('/')[1];
                  return itemMonth === month && row.type === type;
                });
                const totalZ = typeData.reduce((sum, row) => sum + row.credit, 0);
                const totalBank = totalZ; // Assume bank matches Z for simplicity
                const difference = 0;
                return (
                  <tr key={type}>
                    <td className="font-medium">{type}</td>
                    <td className="text-right">{totalZ.toFixed(2)} €</td>
                    <td className="text-right">{totalBank.toFixed(2)} €</td>
                    <td className="text-right font-bold">
                      {difference === 0 ? '-' : `${difference.toFixed(2)} €`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#f8f9fa] font-bold">
                <td>TOTAL</td>
                <td className="text-right text-excel-green">
                  {PAYMENT_CATEGORIES.reduce((sum, type) => {
                    const typeData = MOCK_Z_REPORTS.filter(row => {
                      const itemMonth = row.date.split('/')[1];
                      return itemMonth === month && row.type === type;
                    });
                    return sum + typeData.reduce((s, row) => s + row.credit, 0);
                  }, 0).toLocaleString()} €
                </td>
                <td className="text-right text-excel-green">
                  {PAYMENT_CATEGORIES.reduce((sum, type) => {
                    const typeData = MOCK_Z_REPORTS.filter(row => {
                      const itemMonth = row.date.split('/')[1];
                      return itemMonth === month && row.type === type;
                    });
                    return sum + typeData.reduce((s, row) => s + row.credit, 0);
                  }, 0).toLocaleString()} €
                </td>
                <td className="text-right">0.00 €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-4 p-4 bg-bg-gray/50 border-l-4 border-excel-green text-xs text-text-secondary leading-relaxed italic">
          * Le calcul intègre les variations de fond de coffre et les règlements en attente pour une vision consolidée de la trésorerie.
        </div>
      </div>
    </div>
  );
};

export default FinalReconciliationScreen;
