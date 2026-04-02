import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '◈', label: 'Dashboard'    },
  { id: 'transactions', icon: '↕', label: 'Transactions' },
  { id: 'insights',     icon: '◎', label: 'Insights'     },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();

  const totalIncome  = state.transactions.filter((t) => t.type === 'income' ).reduce((a, t) => a + t.amount, 0);
  const totalExpense = state.transactions.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">₹</div>
          <div>
            <div className="logo-text">Zorvyn</div>
            <div className="logo-tagline">Finance Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${state.activeTab === item.id ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', payload: item.id })}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="balance-widget">
          <div className="balance-label">Net Balance</div>
          <div className="balance-amount">{formatCurrency(balance)}</div>
          <div className="balance-change">↑ Live</div>
        </div>
      </div>
    </aside>
  );
}
