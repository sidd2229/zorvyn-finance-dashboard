import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CATEGORIES, MONTHLY_DATA } from '../data/mockData';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const txs = state.transactions;

  const totalIncome  = useMemo(() => txs.filter((t) => t.type === 'income' ).reduce((a, t) => a + t.amount, 0), [txs]);
  const totalExpense = useMemo(() => txs.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0), [txs]);
  const balance    = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const categoryData = useMemo(() => {
    const map = {};
    txs.filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => ({ cat, amt, color: CATEGORIES[cat]?.color || '#888' }));
  }, [txs]);

  const totalCat = categoryData.reduce((a, c) => a + c.amt, 0);
  const recent   = useMemo(() => [...txs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7), [txs]);
  const maxBar   = Math.max(...MONTHLY_DATA.map((m) => Math.max(m.income, m.expenses)));

  return (
    <div>
      {/* STAT CARDS */}
      <div className="stats-grid">
        <StatCard label="Total Balance"  amount={formatCurrency(balance)}      icon="💰" cls="s-balance"  iconCls="si-green"   change="+12.4%" dir="up" />
        <StatCard label="Total Income"   amount={formatCurrency(totalIncome)}  icon="📥" cls="s-income"   iconCls="si-emerald" change="+8.2%"  dir="up" />
        <StatCard label="Total Expenses" amount={formatCurrency(totalExpense)} icon="📤" cls="s-expense"  iconCls="si-red"     change="+3.1%"  dir="dn" />
        <StatCard label="Savings Rate"   amount={`${savingsRate}%`}            icon="🎯" cls="s-savings"  iconCls="si-blue"    change="+5.2%"  dir="up" />
      </div>

      {/* CHARTS */}
      <div className="charts-row">
        <div className="card chart-card">
          <div className="chart-title">Monthly Income vs Expenses</div>
          <div className="bar-chart">
            {MONTHLY_DATA.map((m) => (
              <div key={m.month} className="bar-group">
                <div className="bar-pair">
                  <div className="bar b-income"  style={{ height: `${(m.income   / maxBar) * 100}%` }} title={`Income: ${formatCurrency(m.income)}`}   />
                  <div className="bar b-expense" style={{ height: `${(m.expenses / maxBar) * 100}%` }} title={`Expenses: ${formatCurrency(m.expenses)}`} />
                </div>
                <div className="bar-label">{m.month}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--accent)' }} />Income</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--danger)' }} />Expenses</div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-title">Spending Breakdown</div>
          <DonutChart data={categoryData} total={totalCat} />
        </div>
      </div>

      {/* RECENT */}
      <div>
        <div className="section-header">
          <div className="section-title">Recent Transactions</div>
          <button className="btn-link" onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}>
            View all →
          </button>
        </div>
        <div className="card">
          <div className="tx-list">
            {recent.length === 0
              ? <div className="empty-state"><div className="empty-state-icon">💳</div><div className="empty-state-text">No transactions yet</div></div>
              : recent.map((tx) => <TxRow key={tx.id} tx={tx} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, amount, icon, cls, iconCls, change, dir }) {
  return (
    <div className={`card stat-card ${cls}`}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon ${iconCls}`}>{icon}</div>
      </div>
      <div className="stat-amount">{amount}</div>
      <div className={`stat-change ${dir}`}>{dir === 'up' ? '↑' : '↓'} {change} vs last month</div>
    </div>
  );
}

function DonutChart({ data, total }) {
  const size = 160, r = 58, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = data.map((d) => {
    const pct = d.amt / (total || 1);
    const dash = pct * circ;
    const s = { ...d, dash, offset, pct };
    offset += dash;
    return s;
  });

  return (
    <div className="donut-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg3)" strokeWidth="20" />
        {slices.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth="20"
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-s.offset + circ / 4}
          />
        ))}
        <text x={cx} y={cy - 5}  textAnchor="middle" fontSize="11" fill="var(--text3)" fontFamily="Space Mono">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)" fontFamily="Space Mono">
          {(total / 1000).toFixed(0)}K
        </text>
      </svg>
      <div className="donut-categories">
        {slices.map((s, i) => (
          <div key={i} className="donut-cat-item">
            <div className="cat-dot" style={{ background: s.color }} />
            <span className="cat-name">{s.cat}</span>
            <span className="cat-pct">{Math.round(s.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TxRow({ tx }) {
  const cat = CATEGORIES[tx.category] || { icon: '💵' };
  return (
    <div className="tx-item">
      <div className="tx-icon">{cat.icon}</div>
      <div className="tx-info">
        <div className="tx-desc">{tx.description}</div>
        <div className="tx-meta">
          <span>{formatDate(tx.date)}</span>
          <span className="tx-cat-badge">{tx.category}</span>
        </div>
      </div>
      <div className={`tx-amount ${tx.type}`}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </div>
    </div>
  );
}
