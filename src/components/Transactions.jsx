import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from '../utils/helpers';
import { CATEGORIES } from '../data/mockData';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Transactions({ onEdit }) {
  const { state, dispatch } = useApp();
  const { transactions, filters, sortConfig, role } = state;

  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (filters.type     !== 'all') list = list.filter((t) => t.type === filters.type);
    if (filters.category !== 'all') list = list.filter((t) => t.category === filters.category);
    if (filters.month    !== 'all') {
      const mi = parseInt(filters.month);
      list = list.filter((t) => new Date(t.date).getMonth() === mi);
    }

    list.sort((a, b) => {
      let av = a[sortConfig.key], bv = b[sortConfig.key];
      if (sortConfig.key === 'amount') { av = +av; bv = +bv; }
      if (sortConfig.key === 'date')   { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortConfig.dir === 'asc' ? -1 :  1;
      if (av > bv) return sortConfig.dir === 'asc' ?  1 : -1;
      return 0;
    });

    return list;
  }, [transactions, filters, sortConfig]);

  const categories = [...new Set(transactions.map((t) => t.category))].sort();

  const toggleSort = (key) => {
    dispatch({
      type: 'SET_SORT',
      payload: {
        key,
        dir: sortConfig.key === key && sortConfig.dir === 'desc' ? 'asc' : 'desc',
      },
    });
  };

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.dir === 'asc' ? ' ↑' : ' ↓';
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  const totalIn  = filtered.filter((t) => t.type === 'income' ).reduce((a, t) => a + t.amount, 0);
  const totalOut = filtered.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0);

  return (
    <div>
      {role === 'viewer' && (
        <div className="viewer-banner">
          👁️ You are in <strong style={{ margin: '0 4px' }}>Viewer mode</strong> — read-only. Switch to Admin to add or edit transactions.
        </div>
      )}

      {/* CONTROLS */}
      <div className="tx-page-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
          />
        </div>

        <select className="filter-select" value={filters.type}
          onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } })}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select className="filter-select" value={filters.category}
          onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } })}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="filter-select" value={filters.month}
          onChange={(e) => dispatch({ type: 'SET_FILTER', payload: { month: e.target.value } })}>
          <option value="all">All Months</option>
          {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>

        <div className="export-btns">
          <button className="btn-export" onClick={() => exportToCSV(filtered)}>⬇ CSV</button>
          <button className="btn-export" onClick={() => exportToJSON(filtered)}>⬇ JSON</button>
        </div>
      </div>

      {/* SUMMARY CHIPS */}
      <div className="summary-chips">
        <div className="summary-chip">
          <span className="chip-label">Showing</span>
          <span className="chip-val">{filtered.length} txns</span>
        </div>
        <div className="summary-chip">
          <span className="chip-label">Total In</span>
          <span className="chip-val" style={{ color: 'var(--success)' }}>{formatCurrency(totalIn)}</span>
        </div>
        <div className="summary-chip">
          <span className="chip-label">Total Out</span>
          <span className="chip-val" style={{ color: 'var(--danger)' }}>{formatCurrency(totalOut)}</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="tx-table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No transactions found</div>
            <div className="empty-state-sub">Try adjusting your filters</div>
          </div>
        ) : (
          <table className="tx-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('date')}>Date{sortIcon('date')}</th>
                <th>Description</th>
                <th onClick={() => toggleSort('category')}>Category{sortIcon('category')}</th>
                <th onClick={() => toggleSort('type')}>Type{sortIcon('type')}</th>
                <th onClick={() => toggleSort('amount')}>Amount{sortIcon('amount')}</th>
                {role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>
                    {formatDate(tx.date)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                        {CATEGORIES[tx.category]?.icon || '💵'}
                      </span>
                      <span style={{ fontWeight: 500 }}>{tx.description}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: `${CATEGORIES[tx.category]?.color || '#888'}18`, color: CATEGORIES[tx.category]?.color || '#888', fontWeight: 700 }}>
                      {tx.category}
                    </span>
                  </td>
                  <td><span className={`type-badge ${tx.type}`}>{tx.type}</span></td>
                  <td>
                    <span className={`tx-amount ${tx.type}`} style={{ fontSize: 13 }}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  {role === 'admin' && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-icon" onClick={() => onEdit(tx)} title="Edit">✏️</button>
                        <button className="btn-icon danger" onClick={() => handleDelete(tx.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
