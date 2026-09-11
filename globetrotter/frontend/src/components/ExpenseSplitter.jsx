import React, { useState } from 'react';

export default function ExpenseSplitter({ tripName = 'Our Trip' }) {
  const [members, setMembers] = useState(['Rahul', 'Priya', 'Amit']);
  const [newMember, setNewMember] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Expressway Toll & Cab', amount: 1800, paidBy: 'Rahul' },
    { id: 2, title: 'Dinner at Heritage Thali', amount: 3600, paidBy: 'Priya' },
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0] || '');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.trim() || members.includes(newMember.trim())) return;
    setMembers([...members, newMember.trim()]);
    setNewMember('');
  };

  const handleRemoveMember = (memberName) => {
    if (members.length <= 1) {
      alert('At least one group member is required.');
      return;
    }
    const updatedMembers = members.filter((m) => m !== memberName);
    setMembers(updatedMembers);
    if (paidBy === memberName) {
      setPaidBy(updatedMembers[0] || '');
    }
    // Remove expenses paid by removed member
    setExpenses((prev) => prev.filter((e) => e.paidBy !== memberName));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0 || !paidBy) return;
    const newExp = {
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
      paidBy,
    };
    setExpenses([...expenses, newExp]);
    setTitle('');
    setAmount('');
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Calculate Balances
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonShare = members.length > 0 ? totalSpend / members.length : 0;

  // Track paid per person
  const paidMap = {};
  members.forEach(m => { paidMap[m] = 0; });
  expenses.forEach(e => {
    if (paidMap[e.paidBy] !== undefined) {
      paidMap[e.paidBy] += e.amount;
    }
  });

  // Net balance = Paid - Share (Positive = owed money, Negative = owes money)
  const balances = members.map(m => ({
    name: m,
    paid: paidMap[m],
    net: paidMap[m] - perPersonShare,
  }));

  const handleExportCSV = () => {
    let csv = `Expense Title,Amount (INR),Paid By\n`;
    expenses.forEach(e => {
      csv += `"${e.title.replace(/"/g, '""')}",${e.amount},"${e.paidBy}"\n`;
    });
    csv += `\nMember,Total Paid (INR),Net Balance (INR),Status\n`;
    balances.forEach(b => {
      const status = b.net >= 0 ? `Gets back ₹${Math.round(b.net)}` : `Owes ₹${Math.round(Math.abs(b.net))}`;
      csv += `"${b.name}",${b.paid},${Math.round(b.net)},"${status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tripName.replace(/[\s\W]+/g, '_')}_expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💰 Group Expense Splitter — {tripName}
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Split bills seamlessly among travel companions in ₹ INR</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleExportCSV}
            style={{ background: '#0284c7', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
          >
            📥 Export CSV Report
          </button>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontWeight: 700, fontSize: '13px' }}>
            Total Spend: ₹{totalSpend.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Members Bar */}
      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>👥 Group Members ({members.length}):</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {members.map(m => (
            <span key={m} style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>👤 {m}</span>
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(m)}
                  title={`Remove ${m} from group`}
                  style={{
                    background: '#c7d2fe',
                    color: '#1e1b4b',
                    border: 'none',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: 800,
                    lineHeight: 1,
                    padding: 0
                  }}
                >
                  ✕
                </button>
              )}
            </span>
          ))}

          <form onSubmit={handleAddMember} style={{ display: 'inline-flex', gap: '4px' }}>
            <input
              type="text"
              placeholder="+ Add Name"
              value={newMember}
              onChange={e => setNewMember(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', width: '100px' }}
            />
            <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Add</button>
          </form>
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginBottom: '16px', background: '#fafafa', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Expense Title</label>
          <input
            type="text"
            placeholder="e.g. Lunch at highway"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Amount (₹ INR)</label>
          <input
            type="number"
            placeholder="e.g. 1500"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Paid By</label>
          <select
            value={paidBy}
            onChange={e => setPaidBy(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: 'white' }}
          >
            {members.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="submit"
            style={{ width: '100%', background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            ➕ Log Expense
          </button>
        </div>
      </form>

      {/* Expenses Log & Settlement Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {/* Expenses List */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>📋 Logged Expenses ({expenses.length})</div>
          {expenses.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No expenses logged yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {expenses.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{e.title}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Paid by <strong>{e.paidBy}</strong></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#16a34a' }}>₹{e.amount.toLocaleString()}</span>
                    <button onClick={() => handleDeleteExpense(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settlement Summary */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>⚖️ Balance &amp; Settlement (Share: ₹{Math.round(perPersonShare).toLocaleString()}/person)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {balances.map(b => (
              <div key={b.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: b.net >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${b.net >= 0 ? '#bbf7d0' : '#fecaca'}`, padding: '8px 12px', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{b.name}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Paid ₹{b.paid.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {b.net >= 0 ? (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '13px' }}>Gets back ₹{Math.round(b.net).toLocaleString()}</span>
                  ) : (
                    <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '13px' }}>Owes ₹{Math.round(Math.abs(b.net)).toLocaleString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
