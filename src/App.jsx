import React, { useState } from 'react';
import ImportScreen from './components/ImportScreen';
import ReconciliationScreen from './components/ReconciliationScreen';
import { LayoutDashboard, ReceiptText, Landmark, BarChart3 } from 'lucide-react';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('import'); // 'import' or 'reconciliation'

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <LayoutDashboard size={24} className="icon-excel" />
          <span>RestoCompta Pro</span>
        </div>
        <div className="navbar-links">
          <button
            className={`nav-link ${currentScreen === 'import' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('import')}
          >
            <ReceiptText size={18} />
            Import Z et Banque
          </button>
          <button
            className={`nav-link ${currentScreen === 'reconciliation' ? 'active' : ''}`}
            onClick={() => setCurrentScreen('reconciliation')}
          >
            <BarChart3 size={18} />
            Rapprochement et Écarts
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentScreen === 'import' ? <ImportScreen /> : <ReconciliationScreen />}
      </main>
    </div>
  );
}

export default App;
