import { useState } from 'react';
import ImportScreen from './components/ImportScreen';
import BankImportScreen from './components/BankImportScreen';
import ReconciliationScreen from './components/ReconciliationScreen';
import FinalReconciliationScreen from './components/FinalReconciliationScreen';
import { LayoutDashboard, ReceiptText, Landmark, BarChart3, TrendingUp } from 'lucide-react';

type Screen = 'z-import' | 'bank-import' | 'reconciliation' | 'final-reconciliation';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('z-import');

  const navItems = [
    { id: 'z-import', label: 'Import Z de caisse', icon: ReceiptText },
    { id: 'bank-import', label: 'Import Banque', icon: Landmark },
    { id: 'reconciliation', label: 'Rapprochement', icon: BarChart3 },
    { id: 'final-reconciliation', label: 'Rapprochement Final', icon: TrendingUp },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen bg-bg-gray">
      <nav className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b-2 border-excel-green flex items-center px-8 z-[1001] shadow-sm">
        <div className="flex items-center gap-2.5 font-bold text-xl text-excel-green mr-12">
          <LayoutDashboard size={24} />
          <span>Réconciliation App</span>
        </div>
        <div className="flex gap-2.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-2 px-4 py-2 text-[0.95rem] rounded transition-all cursor-pointer ${
                currentScreen === id
                ? 'bg-excel-green-light text-excel-green font-semibold'
                : 'text-text-secondary hover:bg-bg-gray hover:text-text-main'
              }`}
              onClick={() => setCurrentScreen(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mt-[60px] p-8 flex-1">
        {currentScreen === 'z-import' && <ImportScreen />}
        {currentScreen === 'bank-import' && <BankImportScreen />}
        {currentScreen === 'reconciliation' && <ReconciliationScreen />}
        {currentScreen === 'final-reconciliation' && <FinalReconciliationScreen />}
      </main>
    </div>
  );
}

export default App;
