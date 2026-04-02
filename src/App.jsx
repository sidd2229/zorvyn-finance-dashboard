import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import TransactionModal from './components/TransactionModal';
import './App.css';

function AppContent() {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const openAdd  = () => { setEditingTx(null); setModalOpen(true); };
  const openEdit = (tx) => { setEditingTx(tx); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingTx(null); };

  return (
    <div className={`app ${state.theme}`}>
      <Sidebar />
      <main className="main-content">
        {/* TOP BAR */}
        <div className="topbar">
          <span className="topbar-title">
            {state.activeTab === 'dashboard'    && '📊 Overview'}
            {state.activeTab === 'transactions' && '💳 Transactions'}
            {state.activeTab === 'insights'     && '🔍 Insights'}
          </span>
          <div className="topbar-right">
            <div className="role-selector">
              <span className="role-label">Role</span>
              <select
                className="role-select"
                value={state.role}
                onChange={(e) => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
              >
                <option value="admin">👑 Admin</option>
                <option value="viewer">👁️ Viewer</option>
              </select>
            </div>
            <button
              className="theme-toggle"
              onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
              title="Toggle theme"
            >
              {state.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {state.role === 'admin' && (
              <button className="btn-add" onClick={openAdd}>
                + Add Transaction
              </button>
            )}
          </div>
        </div>

        {/* PAGE */}
        <div className="page-content">
          {state.activeTab === 'dashboard'    && <Dashboard />}
          {state.activeTab === 'transactions' && <Transactions onEdit={openEdit} />}
          {state.activeTab === 'insights'     && <Insights />}
        </div>
      </main>

      {modalOpen && (
        <TransactionModal tx={editingTx} onClose={closeModal} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
