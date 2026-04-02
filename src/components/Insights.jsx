import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { CATEGORIES, MONTHLY_DATA } from '../data/mockData';

export default function Insights() {
  const { state } = useApp();
  const txs = state.transactions;

  const expenses = txs.filter((t) => t.type === 'expense');
  const incomes  = txs.filter((t) => t.type === 'income');
  const totalExp = expenses.reduce((a, t) => a + t.amount, 0);
  const totalInc = incomes.reduce((a, t) => a + t.amount, 0);

  const catData = useMemo(() => {
    const map = {};
    expenses.forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const incMap = {};
  incomes.forEach((t) => { incMap[t.category] = (incMap[t.category] || 0) + t.amount; });
  const topInc  = Object.entries(incMap).sort((a, b) => b[1] - a[1])[0];
  const topCat  = catData[0];
  const savRate = totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;
  const avgDaily = totalExp > 0 ? Math.round(totalExp / 90) : 0;
  const maxCat  = catData[0]?.[1] || 1;

  const curr    = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prev    = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const incChg  = ((curr.income   - prev.income)   / prev.income   * 100).toFixed(1);
  const expChg  = ((curr.expenses - prev.expenses) / prev.expenses * 100).toFixed(1);

  const observations = useMemo(() => {
    const obs = [];
    if (savRate > 30) obs.push({ icon: '🌟', title: 'Strong Savings', body: `You're saving over ${savRate}% of income — well above the recommended 20%.` });
    if (savRate < 10 && savRate >= 0) obs.push({ icon: '⚠️', title: 'Low Savings Rate', body: 'Below 10% savings. Consider reducing discretionary spending.' });
    if (topCat && topCat[1] / totalExp > 0.3) obs.push({ icon: '📌', title: 'Concentrated Spending', body: `${topCat[0]} is ${Math.round(topCat[1] / totalExp * 100)}% of expenses. Evaluate if this aligns with your goals.` });
    const food = catData.find((c) => c[0] === 'Food');
    if (food && food[1] > 5000) obs.push({ icon: '🍜', title: 'Food Spending', body: `${formatCurrency(food[1])} on food. Meal prepping could reduce this by 30–40%.` });
    obs.push({ icon: '📅', title: 'Automate Investments', body: 'Set up automatic SIPs to ensure you invest before discretionary spending.' });
    obs.push({ icon: '💡', title: 'Emergency Fund Target', body: `Keep ${formatCurrency(totalExp * 2)} as a 6-month emergency buffer based on your spending.` });
    return obs.slice(0, 4);
  }, [catData, savRate, topCat, totalExp]);

  return (
    <div>
      {/* KEY METRICS */}
      <div className="insights-grid">
        <div className="card insight-card">
          <div className="insight-tag">🔥 Top Spending</div>
          <div className="insight-headline">{topCat ? `${CATEGORIES[topCat[0]]?.icon || ''} ${topCat[0]}` : 'No data'}</div>
          <div className="insight-sub">
            {topCat
              ? `You've spent ${formatCurrency(topCat[1])} on ${topCat[0]}, which is ${Math.round(topCat[1] / totalExp * 100)}% of total expenses.`
              : 'No expense data available.'}
          </div>
        </div>
        <div className="card insight-card">
          <div className="insight-tag">💸 Daily Average</div>
          <div className="insight-headline">{formatCurrency(avgDaily)}/day</div>
          <div className="insight-sub">
            Your average daily spend. {avgDaily > 2000 ? 'Consider reducing discretionary expenses.' : 'Solid control over daily spending!'}
          </div>
        </div>
        <div className="card insight-card">
          <div className="insight-tag">📈 Top Income Source</div>
          <div className="insight-headline">{topInc ? `${CATEGORIES[topInc[0]]?.icon || ''} ${topInc[0]}` : 'No data'}</div>
          <div className="insight-sub">
            {topInc
              ? `${topInc[0]} contributes ${formatCurrency(topInc[1])}, which is ${Math.round(topInc[1] / totalInc * 100)}% of total income.`
              : 'No income data available.'}
          </div>
        </div>
        <div className="card insight-card">
          <div className="insight-tag">🎯 Savings Rate</div>
          <div className="insight-headline">{savRate}%</div>
          <div className="insight-sub">
            {totalInc > totalExp
              ? `You're saving ${formatCurrency(totalInc - totalExp)}. Excellent financial discipline!`
              : 'Expenses exceed income. Review your spending habits.'}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Category breakdown */}
        <div className="card" style={{ padding: 22 }}>
          <div className="chart-title">Spending by Category</div>
          <div className="progress-list">
            {catData.slice(0, 7).map(([cat, amt]) => (
              <div key={cat}>
                <div className="progress-header">
                  <span className="progress-name">{CATEGORIES[cat]?.icon} {cat}</span>
                  <span className="progress-amount">{formatCurrency(amt)} · {Math.round(amt / totalExp * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(amt / maxCat) * 100}%`, background: CATEGORIES[cat]?.color || '#888' }} />
                </div>
              </div>
            ))}
            {catData.length === 0 && <div style={{ color: 'var(--text3)', fontSize: 13 }}>No expense data yet.</div>}
          </div>
        </div>

        {/* Monthly comparison */}
        <div className="card" style={{ padding: 22 }}>
          <div className="chart-title">Monthly Comparison</div>
          {MONTHLY_DATA.slice(-4).map((m) => (
            <div key={m.month} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>{m.month} 2025</span>
                <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  <span style={{ color: 'var(--success)' }}>+{(m.income   / 1000).toFixed(0)}K</span>
                  <span style={{ color: 'var(--danger)'  }}>-{(m.expenses / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[['Inc', 'income', m.income], ['Exp', 'expense', m.expenses]].map(([label, cls, val]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: 'var(--text3)' }}>
                    <span style={{ width: 24 }}>{label}</span>
                    <div className="comp-bar-track">
                      <div className={`comp-bar-fill ${cls}`} style={{ width: `${(val / 115000) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding: 14, background: parseFloat(expChg) < 0 ? 'rgba(46,213,115,0.08)' : 'rgba(255,71,87,0.08)', border: `1px solid ${parseFloat(expChg) < 0 ? 'rgba(46,213,115,0.2)' : 'rgba(255,71,87,0.2)'}`, borderRadius: 10 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Month-over-Month</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              Income <strong style={{ color: parseFloat(incChg) > 0 ? 'var(--success)' : 'var(--danger)' }}>{parseFloat(incChg) > 0 ? '↑' : '↓'} {Math.abs(incChg)}%</strong>
              {' · '}Expenses <strong style={{ color: parseFloat(expChg) < 0 ? 'var(--success)' : 'var(--danger)' }}>{parseFloat(expChg) > 0 ? '↑' : '↓'} {Math.abs(expChg)}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* OBSERVATIONS */}
      <div className="card" style={{ padding: 22 }}>
        <div className="chart-title">🤖 Smart Observations</div>
        {observations.map((o, i) => (
          <div key={i} className="obs-item">
            <span style={{ fontSize: 20, flexShrink: 0 }}>{o.icon}</span>
            <div><div className="obs-title">{o.title}</div><div>{o.body}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
