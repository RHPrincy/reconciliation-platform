import { useState } from 'react';
import { Upload, Filter, Maximize, X } from 'lucide-react';
import { MOCK_Z_REPORTS, PAYMENT_CATEGORIES, PaymentCategory } from '../data/mockData';

const ImportScreen = () => {
  const [year, setYear] = useState('2024-2025');
  const [quarter, setQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q1');
  const [selectedMonth, setSelectedMonth] = useState('Août');
  const [caMonthly, setCaMonthly] = useState<Record<string, number>>({});
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('LGTF');

  const getMonthsForQuarter = (q: 'Q1' | 'Q2' | 'Q3' | 'Q4') => {
    const monthsMap = {
      Q1: ['Août', 'Septembre', 'Octobre'],
      Q2: ['Novembre', 'Décembre', 'Janvier'],
      Q3: ['Février', 'Mars', 'Avril'],
      Q4: ['Mai', 'Juin', 'Juillet']
    };
    return monthsMap[q] || [];
  };

  const getMonthsWithYears = (y: string, q: 'Q1' | 'Q2' | 'Q3' | 'Q4') => {
    const [startYear] = y.split('-').map(Number);
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
    return quarters[q] || [];
  };

  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return { day, month: monthNames[month - 1], year };
  };

  const monthsToDisplay = getMonthsWithYears(year, quarter);

  const filteredData = MOCK_Z_REPORTS.filter(row => {
    const { month, year: rowYear } = parseDate(row.date);
    return monthsToDisplay.some(m => m.month === month && m.year === rowYear) && row.company === selectedCompany;
  });

  const summary: Record<PaymentCategory, Record<string, number> & { total: number }> = {} as any;
  PAYMENT_CATEGORIES.forEach(type => {
    summary[type] = { total: 0 };
    monthsToDisplay.forEach(m => {
      summary[type][m.month] = 0;
    });
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
    <div className="flex flex-col gap-6">
      <h2 className="excel-section-title">Importation des rapports Z de caisse</h2>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div className="border-2 border-dashed border-excel-border p-8 text-center rounded-lg bg-white/50 hover:border-excel-green transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
          <Upload size={32} className="text-excel-green" />
          <h3 className="font-semibold text-text-main">Import Rapport Z de caisse pour {selectedCompany}</h3>
          <p className="text-sm text-text-secondary text-balance">Glissez-déposez votre fichier Excel POS ici (.xlsx, .csv)</p>
        </div>
      </div>

      <div className="excel-card">
        <div className="flex flex-wrap gap-5 mb-6 items-center">
          <div className="flex items-center gap-2.5">
            <Filter size={18} className="text-text-secondary" />
            <label className="text-sm font-semibold">Exercice Comptable :</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="excel-input text-sm">
              <option value="2024-2025">Août 2024 - Juillet 2025</option>
              <option value="2023-2024">Août 2023 - Juillet 2024</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Trimestre :</label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value as any)}
              className="excel-input text-sm"
            >
              <option value="Q1">T1 (Août - Oct)</option>
              <option value="Q2">T2 (Nov - Jan)</option>
              <option value="Q3">T3 (Fév - Avr)</option>
              <option value="Q4">T4 (Mai - Jui)</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Mois :</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="excel-input text-sm">
              {getMonthsForQuarter(quarter).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-bold flex items-center gap-2">
              Journal de Caisse (Z)
              <Maximize
                size={16}
                onClick={() => setExpandedTable('z')}
                className="cursor-pointer text-text-secondary hover:text-excel-green"
              />
            </h4>
          </div>
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
                <tr className="bg-[#f8f9fa] font-bold">
                  <td colSpan={5}>TOTAL</td>
                  <td className="text-right text-excel-green">{totalZ.toLocaleString()} €</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="excel-card">
        <h3 className="excel-section-title">Récapitulatif</h3>
        <div className="excel-table-container max-h-none">
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
              {PAYMENT_CATEGORIES.map(type => (
                <tr key={type}>
                  <td className="font-medium">{type}</td>
                  {monthsToDisplay.map(m => (
                    <td key={m.month} className="text-right">{(summary[type]?.[m.month] ?? 0).toLocaleString()} €</td>
                  ))}
                  <td className="text-right text-excel-green font-bold">{(summary[type]?.total ?? 0).toLocaleString()} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#f8f9fa] font-bold">
                <td>TOTAL MENSUEL (Encaissement)</td>
                {monthsToDisplay.map(m => {
                  const totalMonth = PAYMENT_CATEGORIES.reduce((sum, t) => sum + (summary[t]?.[m.month] ?? 0), 0);
                  return <td key={m.month} className="text-right">{totalMonth.toLocaleString()} €</td>;
                })}
                <td className="text-right text-excel-green">{PAYMENT_CATEGORIES.reduce((sum, t) => sum + (summary[t]?.total ?? 0), 0).toLocaleString()} €</td>
              </tr>
              <tr>
                <td className="font-bold">CA déclarés</td>
                {monthsToDisplay.map(m => (
                  <td key={m.month} className="p-0">
                    <input
                      type="number"
                      value={caMonthly[m.month] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        setCaMonthly({...caMonthly, [m.month]: val});
                      }}
                      className="w-full h-full p-2 text-right border-none outline-none focus:bg-excel-green-light"
                    />
                  </td>
                ))}
                <td className="text-right text-excel-green font-bold">{Object.values(caMonthly).reduce((sum, val) => sum + (val ?? 0), 0).toLocaleString()} €</td>
              </tr>
              <tr className="bg-[#f8f9fa] font-bold">
                <td>Ecart (solde client théorique)</td>
                {monthsToDisplay.map(m => {
                  const totalMonth = PAYMENT_CATEGORIES.reduce((sum, t) => sum + (summary[t]?.[m.month] ?? 0), 0);
                  const caMonth = caMonthly[m.month] ?? 0;
                  return <td key={m.month} className="text-right">{(caMonth - totalMonth).toLocaleString()} €</td>;
                })}
                <td className="text-right text-excel-green">
                  {(Object.values(caMonthly).reduce((sum, val) => sum + (val ?? 0), 0) - PAYMENT_CATEGORIES.reduce((sum, t) => sum + (summary[t]?.total ?? 0), 0)).toLocaleString()} €
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {expandedTable && (
        <div className="fixed inset-0 bg-white z-[2000] overflow-auto flex flex-col">
          <div className="flex justify-between items-center p-8 border-b border-excel-border">
            <h3 className="text-2xl font-bold text-excel-green">Journal de Caisse (Z) - {selectedCompany}</h3>
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
                placeholder="Rechercher dans les données..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="excel-input w-full text-lg p-3"
              />
            </div>
            <div className="excel-table-container max-h-[calc(100vh-250px)]">
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
                </tbody>
                <tfoot className="sticky bottom-0 bg-white z-20">
                  <tr className="bg-[#f8f9fa] font-bold">
                    <td colSpan={5}>TOTAL</td>
                    <td className="text-right text-excel-green">{totalZ.toLocaleString()} €</td>
                    <td></td>
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

export default ImportScreen;
