import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

export default function TransactionModal({ tx, onClose }) {
  const { dispatch } = useApp();
  const isEdit = Boolean(tx);

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (tx) setForm({ ...tx, amount: String(tx.amount) });
  }, [tx]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.description.trim()) { alert('Please enter a description.'); return; }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) { alert('Please enter a valid amount.'); return; }
    if (!form.date) { alert('Please select a date.'); return; }

    const payload = { ...form, amount: amt, id: isEdit ? tx.id : Date.now() };
    dispatch({ type: isEdit ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION', payload });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* TYPE */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                className={`type-btn ${form.type === 'income' ? 'active-income' : ''}`}
                onClick={() => set('type', 'income')}
              >↑ Income</button>
              <button
                className={`type-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => set('type', 'expense')}
              >↓ Expense</button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="e.g. Monthly Salary, Swiggy Order..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* AMOUNT + DATE */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                className="form-input"
                type="number"
                min="1"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {Object.entries(CATEGORIES).map(([cat, { icon }]) => (
                <option key={cat} value={cat}>{icon} {cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>
            {isEdit ? '✓ Save Changes' : '+ Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
