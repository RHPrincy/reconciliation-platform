import React, { useState } from 'react';
import ImportScreen from './components/ImportScreen';
import ReconciliationScreen from './components/ReconciliationScreen';
import { LayoutDashboard, ReceiptText, BarChart3 } from 'lucide-react';
import { ScreenType } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('import');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-gray)] text-[var(--text-main)]">
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b-2 border-[var(--excel-green)] flex items-center px-8 z-50 shadow-sm">
        <div className="flex items-center gap-2.5 font-bold text-lg text-[var(--excel-green)] mr-12">
          <LayoutDashboard size={24} />
          <span>RestoCompta Pro</span>
        </div>
        <div className="flex gap-2.5">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm ${
              currentScreen === 'import'
                ? 'bg-[var(--excel-green-light)] text-[var(--excel-green)] font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-gray)] hover:text-[var(--text-main)]'
            }`}
            onClick={() => setCurrentScreen('import')}
          >
            <ReceiptText size={18} />
            Import Z et Banque
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded transition-all cursor-pointer text-sm ${
              currentScreen === 'reconciliation'
                ? 'bg-[var(--excel-green-light)] text-[var(--excel-green)] font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-gray)] hover:text-[var(--text-main)]'
            }`}
            onClick={() => setCurrentScreen('reconciliation')}
          >
            <BarChart3 size={18} />
            Rapprochement et Écarts
          </button>
        </div>
      </nav>

      <main className="mt-[60px] p-8 flex-1">
        {currentScreen === 'import' ? <ImportScreen /> : <ReconciliationScreen />}
      </main>
    </div>
  );
}

export default App;
