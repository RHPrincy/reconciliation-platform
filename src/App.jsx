import React, { useState } from 'react';
import ImportScreen from './components/ImportScreen';
import BankImportScreen from './components/BankImportScreen';
import ReconciliationScreen from './components/ReconciliationScreen';
import FinalReconciliationScreen from './components/FinalReconciliationScreen';
import { LayoutDashboard, ReceiptText, Landmark, BarChart3, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('z-import'); // 'z-import', 'bank-import', 'reconciliation', 'final-reconciliation'

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <LayoutDashboard size={24} className="icon-excel" />
        </div>
        <div className="navbar-links">
          <button
            className={`nav-link ${currentScreen === 'z-import' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('z-import')}
          >
            <ReceiptText size={18} />
            Import Z de caisse
          </button>
          <button
            className={`nav-link ${currentScreen === 'bank-import' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('bank-import')}
          >
            <Landmark size={18} />
            Import Banque
          </button>
          <button
            className={`nav-link ${currentScreen === 'reconciliation' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('reconciliation')}
          >
            <BarChart3 size={18} />
            Rapprochement
          </button>
          <button
            className={`nav-link ${currentScreen === 'final-reconciliation' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('final-reconciliation')}
          >
            <TrendingUp size={18} />
            Rapprochement Final
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentScreen === 'z-import' ? <ImportScreen /> :
         currentScreen === 'bank-import' ? <BankImportScreen /> :
         currentScreen === 'reconciliation' ? <ReconciliationScreen /> :
         <FinalReconciliationScreen />}
      </main>
    </div>
  );
}

export default App;
