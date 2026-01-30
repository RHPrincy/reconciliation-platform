import React, { useState } from 'react';
import { Upload, Filter } from 'lucide-react';
import { MOCK_Z_REPORTS, MOCK_BANK_TRANSACTIONS } from '../data/mockData';

const ImportScreen: React.FC = () => {
  const [year, setYear] = useState<string>('2024-2025');
  const [quarter, setQuarter] = useState<string>('Q1');

  const totalZ = MOCK_Z_REPORTS.reduce((acc, curr) => acc + curr.credit, 0);
  const totalBank = MOCK_BANK_TRANSACTIONS.reduce((acc, curr) => acc + curr.montant, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl mb-6 text-[var(--text-main)] border-l-4 border-[var(--excel-green)] pl-2.5 font-semibold">
        Importation des rapports Z et extraits bancaires
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border-2 border-dashed border-[var(--border-color)] p-8 text-center rounded-lg bg-[#fafafa] cursor-pointer hover:border-[var(--excel-green)] transition-colors">
          <Upload size={32} className="text-[var(--excel-green)] mx-auto mb-2.5" />
          <h3 className="font-semibold text-base mb-1">Import Rapport Z de caisse</h3>
          <p className="text-sm text-[var(--text-secondary)]">Glissez-déposez votre fichier Excel POS ici (.xlsx, .csv)</p>
        </div>
        <div className="border-2 border-dashed border-[var(--border-color)] p-8 text-center rounded-lg bg-[#fafafa] cursor-pointer hover:border-[var(--excel-green)] transition-colors">
          <Upload size={32} className="text-[var(--excel-green)] mx-auto mb-2.5" />
          <h3 className="font-semibold text-base mb-1">Import Relevé Bancaire</h3>
          <p className="text-sm text-[var(--text-secondary)]">Glissez-déposez votre fichier Excel de la banque ici (.xlsx, .csv)</p>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-color)] p-6 mb-8 rounded-sm shadow-xs">
        <div className="flex flex-wrap gap-5 mb-6 items-center">
          <div className="flex items-center gap-2.5">
            <Filter size={18} />
            <label className="text-sm font-semibold">Exercice Comptable :</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--excel-green)]"
            >
              <option value="2024-2025">Août 2024 - Juillet 2025</option>
              <option value="2023-2024">Août 2023 - Juillet 2024</option>
            </select>
          </div>
          <div className="flex items-center gap-2.5">
            <label className="text-sm font-semibold">Trimestre :</label>
            <select
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              className="px-3 py-1.5 border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--excel-green)]"
            >
              <option value="Q1">Q1 (Août - Oct)</option>
              <option value="Q2">Q2 (Nov - Jan)</option>
              <option value="Q3">Q3 (Fév - Avr)</option>
              <option value="Q4">Q4 (Mai - Jui)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-2.5">Journal de Caisse (Z)</h4>
            <div className="excel-table-container max-h-[400px]">
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
                    <tr key={idx} className="hover:bg-[#f1f1f1]">
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
                    <td className="text-right text-[var(--excel-green)]">{totalZ.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2.5">Journal de Banque</h4>
            <div className="excel-table-container max-h-[400px]">
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
                    <tr key={idx} className="hover:bg-[#f1f1f1]">
                      <td>{row.date}</td>
                      <td>{row.libelle}</td>
                      <td className="text-right">{row.montant.toFixed(2)} €</td>
                    </tr>
                  ))}
                  <tr className="bg-[#f8f9fa] font-bold">
                    <td colSpan={2}>TOTAL</td>
                    <td className="text-right text-[var(--excel-green)]">{totalBank.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-color)] p-6 mb-8 rounded-sm shadow-xs">
        <h3 className="text-xl mb-6 text-[var(--text-main)] border-l-4 border-[var(--excel-green)] pl-2.5 font-semibold">
          Récapitulatif Z par Type de Règlement
        </h3>
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
            <tr className="hover:bg-[#f1f1f1]">
              <td>Espèces</td>
              <td className="text-right">12,450.00 €</td>
              <td className="text-right">11,200.00 €</td>
              <td className="text-right">13,100.00 €</td>
              <td className="text-right font-bold text-[var(--excel-green)]">36,750.00 €</td>
            </tr>
            <tr className="hover:bg-[#f1f1f1]">
              <td>Carte Bancaire</td>
              <td className="text-right">45,200.00 €</td>
              <td className="text-right">42,800.00 €</td>
              <td className="text-right">46,500.00 €</td>
              <td className="text-right font-bold text-[var(--excel-green)]">134,500.00 €</td>
            </tr>
            <tr className="hover:bg-[#f1f1f1]">
              <td>Titres Restaurant</td>
              <td className="text-right">5,400.00 €</td>
              <td className="text-right">4,900.00 €</td>
              <td className="text-right">5,100.00 €</td>
              <td className="text-right font-bold text-[var(--excel-green)]">15,400.00 €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-[#f8f9fa] font-bold">
              <td>TOTAL MENSUEL</td>
              <td className="text-right">63,050.00 €</td>
              <td className="text-right">58,900.00 €</td>
              <td className="text-right">64,700.00 €</td>
              <td className="text-right text-[var(--excel-green)]">186,650.00 €</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ImportScreen;
