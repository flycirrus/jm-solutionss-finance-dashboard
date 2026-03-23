import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';

function Layout({ children }) {
  const navItems = ['Dashboard', 'Transactions', 'Wallet', 'Goals', 'Analytics', 'Reports'];
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: 'var(--color-navy)', color: 'white', padding: '24px' }}>
        <h2 style={{ color: 'white', marginBottom: '32px' }}>JM Solutionss</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => (
            <NavLink 
              key={item} 
              to={`/${item.toLowerCase()}`}
              style={({ isActive }) => ({
                padding: '12px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#B0B8EB',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s'
              })}
            >
              {item}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', height: '100vh', boxSizing: 'border-box' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{color: 'var(--color-text-light)', cursor: 'pointer'}}>Theme Toggle</span>
            <span style={{color: 'var(--color-text-light)', cursor: 'pointer'}}>Settings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="text" placeholder="Search..." className="input" style={{ width: '200px' }} />
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>JD</div>
            <span style={{ fontWeight: '500' }}>John Doe</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Analytics />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
