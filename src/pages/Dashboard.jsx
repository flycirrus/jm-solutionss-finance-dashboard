import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { loadData } from '../lib/store';
import { ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Activity, TrendingUp } from 'lucide-react';

const COLORS = ['#2E3A8C', '#4A5FD9', '#1A2254', '#8C97E0', '#B0B8EB'];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return <div>Loading...</div>;

  const currentMonthTransactions = data.transactions.filter(t => t.date.startsWith("2026-03"));
  const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const savings = income - expense;
  const balance = data.transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: data.user.currency }).format(val);

  const incomeData = [
    { name: 'Jan', Fixed: 4000, Variable: 2400 },
    { name: 'Feb', Fixed: 4000, Variable: 1398 },
    { name: 'Mar', Fixed: 4000, Variable: income - 4000 > 0 ? income - 4000 : 0 },
  ];

  const budgetData = data.budget.map((b, i) => ({
    name: b.category,
    value: b.spentAmount,
    color: COLORS[i % COLORS.length]
  }));

  const spentLimitPct = Math.min((expense / data.user.monthlySpendingLimit) * 100, 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <MetricCard title="Total Balance" amount={formatCurrency(balance)} icon={<Wallet size={20} />} trend={+2.5} />
        <MetricCard title="Total Income" amount={formatCurrency(income)} icon={<TrendingUp size={20} />} trend={+1.2} />
        <MetricCard title="Total Expense" amount={formatCurrency(expense)} icon={<Activity size={20} />} trend={-5.4} isNegativeGood />
        <MetricCard title="Total Savings" amount={formatCurrency(savings)} icon={<ArrowUpRight size={20} />} trend={+8.1} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>Total Income</h3>
            <select className="input" style={{ width: 'auto' }}><option>This Year</option></select>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend iconType="circle" />
                <Bar dataKey="Fixed" stackId="a" fill="#2E3A8C" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Variable" stackId="a" fill="#4A5FD9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>Budget</h3>
            <select className="input" style={{ width: 'auto' }}><option>This Month</option></select>
          </div>
          <div style={{ height: 250, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Spent</div>
              <div style={{ fontWeight: 'bold' }}>{formatCurrency(expense)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
            {budgetData.map(b => (
              <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: b.color }} />
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3>Spending Limit</h3>
            <p className="text-small" style={{ color: 'var(--color-text-light)' }}>Monthly Payment Limit</p>
            <div style={{ margin: '16px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>{formatCurrency(expense)}</span>
                <span className="text-small" style={{ color: 'var(--color-text-light)' }}>/ {formatCurrency(data.user.monthlySpendingLimit)}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${spentLimitPct}%`, backgroundColor: spentLimitPct > 90 ? '#c62828' : 'var(--color-primary)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3>My Cards</h3>
              <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>+ Add</button>
            </div>
            {data.cards.map(card => (
              <div key={card.id} style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'var(--color-navy)', color: 'white', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 'bold' }}>{card.cardType.toUpperCase()}</div>
                  <CreditCard size={20} />
                </div>
                <div style={{ fontSize: '18px', letterSpacing: '2px' }}>{card.cardNumber}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#B0B8EB' }}>
                  <span>{card.cardholderName}</span>
                  <span>{card.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3>Recent Transactions</h3>
            <a href="#" style={{ color: 'var(--color-primary)', fontSize: '14px', textDecoration: 'none' }}>See all</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
                <th style={{ textAlign: 'left', padding: '12px 0' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px 0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '12px 0' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '12px 0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.slice(0, 5).map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-bg)' }}>
                  <td style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                      {t.recipientName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{t.recipientName}</div>
                      <div className="text-caption" style={{ color: 'var(--color-text-light)' }}>{t.category}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 0', color: 'var(--color-text-light)' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: t.status === 'completed' ? '#e8f5e9' : '#fff3e0', color: t.status === 'completed' ? '#2e7d32' : '#e65100', fontSize: '12px' }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '500', color: t.type === 'income' ? '#2e7d32' : 'var(--color-text)' }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, amount, icon, trend, isNegativeGood }) {
  const isPositive = trend > 0;
  const trendColor = (isPositive && !isNegativeGood) || (!isPositive && isNegativeGood) ? '#2e7d32' : '#c62828';
  
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{title}</span>
        <div style={{ color: 'var(--color-primary)' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700' }}>{amount}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
        <span style={{ color: trendColor, display: 'flex', alignItems: 'center' }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </span>
        <span style={{ color: 'var(--color-text-light)' }}>vs last month</span>
      </div>
    </div>
  )
}
