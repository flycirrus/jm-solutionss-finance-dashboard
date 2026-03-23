import React, { useState, useEffect } from 'react';
import { loadData } from '../lib/store';
import { Plus } from 'lucide-react';

export default function Transactions() {
  const [data, setData] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return null;

  const filtered = data.transactions.filter(t => filterType === 'all' || t.type === filterType);
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: data.user.currency }).format(val);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Transactions</h2>
        <button className="btn btn-primary"><Plus size={16} /> Add Transaction</button>
      </div>
      <div className="card">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input type="text" placeholder="Search transactions..." className="input" style={{ maxWidth: '300px' }} />
          <select className="input" style={{ width: '150px' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>
              <th style={{ textAlign: 'left', padding: '12px 0' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '12px 0' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px 0' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '12px 0' }}>Status</th>
              <th style={{ textAlign: 'right', padding: '12px 0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
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
                <td style={{ padding: '12px 0', color: 'var(--color-text-light)' }}>{t.id}</td>
                <td style={{ padding: '12px 0', color: 'var(--color-text-light)' }}>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: t.status === 'completed' ? '#e8f5e9' : '#fff3e0', color: t.status === 'completed' ? '#2e7d32' : '#e65100', fontSize: '12px' }}>{t.status}</span>
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
  );
}
