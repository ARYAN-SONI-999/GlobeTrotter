import React, { useState } from 'react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', rateToINR: 1 },
  { code: 'USD', symbol: '$', rateToINR: 83.2 },
  { code: 'EUR', symbol: '€', rateToINR: 90.5 },
  { code: 'GBP', symbol: '£', rateToINR: 105.1 },
  { code: 'AED', symbol: 'د.إ', rateToINR: 22.6 },
  { code: 'JPY', symbol: '¥', rateToINR: 0.55 }
];

export default function GroupExpenseSplitter({ tripName = 'My Trip' }) {
  const [members, setMembers] = useState(['You', 'Rahul', 'Priya']);
  const [newMemberName, setNewMemberName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  // Expense Logger State
  const [expenses, setExpenses] = useState([
    { id: 1, title: 'Hotel Booking', amount: 9000, paidBy: 'You', splitBetween: ['You', 'Rahul', 'Priya'] },
    { id: 2, title: 'Dinner at Beach Shack', amount: 2400, paidBy: 'Rahul', splitBetween: ['You', 'Rahul', 'Priya'] },
    { id: 3, title: 'Scooter Rental', amount: 1500, paidBy: 'Priya', splitBetween: ['Rahul', 'Priya'] }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [selectedSplitMembers, setSelectedSplitMembers] = useState(['You', 'Rahul', 'Priya']);

  const curr = CURRENCIES.find((c) => c.code === selectedCurrency) || CURRENCIES[0];

  const formatAmount = (amtINR) => {
    const converted = amtINR / curr.rateToINR;
    return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || members.includes(newMemberName.trim())) return;
    const name = newMemberName.trim();
    setMembers((prev) => [...prev, name]);
    setSelectedSplitMembers((prev) => [...prev, name]);
    setNewMemberName('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || selectedSplitMembers.length === 0) return;

    // Convert input amount to INR base for storage
    const amountInINR = parseFloat(amount) * curr.rateToINR;

    const newExp = {
      id: Date.now(),
      title: title.trim(),
      amount: amountInINR,
      paidBy,
      splitBetween: [...selectedSplitMembers]
    };

    setExpenses((prev) => [...prev, newExp]);
    setTitle('');
    setAmount('');
  };

  const calculateDebts = () => {
    const balances = {};
    members.forEach((m) => (balances[m] = 0));

    expenses.forEach((exp) => {
      const share = exp.amount / exp.splitBetween.length;
      balances[exp.paidBy] += exp.amount;
      exp.splitBetween.forEach((m) => {
        balances[m] -= share;
      });
    });

    const debtors = [];
    const creditors = [];

    Object.entries(balances).forEach(([m, bal]) => {
      if (bal < -1) debtors.push({ name: m, amount: -bal });
      if (bal > 1) creditors.push({ name: m, amount: bal });
    });

    const settlements = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debt = debtors[i];
      const cred = creditors[j];
      const minAmt = Math.min(debt.amount, cred.amount);

      settlements.push({
        from: debt.name,
        to: cred.name,
        amount: minAmt
      });

      debt.amount -= minAmt;
      cred.amount -= minAmt;

      if (debt.amount < 1) i++;
      if (cred.amount < 1) j++;
    }

    return settlements;
  };

  const exportExpensesToCSV = () => {
    let csv = `Title,Paid By,Amount (INR),Split Between\n`;
    expenses.forEach((exp) => {
      csv += `"${exp.title}","${exp.paidBy}",${exp.amount},"${exp.splitBetween.join('; ')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripName.replace(/\s+/g, '_')}_expenses.csv`;
    a.click();
  };

  const settlements = calculateDebts();
  const totalExpenseINR = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="group-expense-splitter" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', margin: '24px 0' }}>
      {/* Header & Currency Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>👥</span> Group Expense Splitter & Debt Calculator
          </h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Log shared trip costs and automatically calculate equal settlements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>

          <button className="btn btn-outline" onClick={exportExpensesToCSV} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Group Members Row */}
      <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>Travelers ({members.length}):</span>
          {members.map((m) => (
            <span key={m} style={{ background: 'white', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
              👤 {m}
            </span>
          ))}
        </div>

        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="+ Add traveler name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            style={{ padding: '4px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
            Add
          </button>
        </form>
      </div>

      {/* Main Grid: Add Expense + Settlements */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Form to log expense */}
        <form onSubmit={handleAddExpense} style={{ background: '#f1f5f9', padding: '16px', borderRadius: '14px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>➕ Log New Expense</h4>
          <input
            type="text"
            placeholder="Expense title (e.g. Dinner, Cab fare)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginBottom: '10px' }}
            required
          />
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="number"
              placeholder={`Amount in ${selectedCurrency}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              required
            />
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              {members.map((m) => (
                <option key={m} value={m}>Paid by {m}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.85rem' }}>
            Save Expense
          </button>
        </form>

        {/* Debt Settlements Card */}
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '16px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#065f46' }}>⚖️ Settle Up Balances</h4>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>Total: {formatAmount(totalExpenseINR)}</span>
          </div>

          {settlements.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0 }}>🎉 All group balances are settled!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {settlements.map((s, idx) => (
                <div key={idx} style={{ background: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                  <span>
                    <strong>{s.from}</strong> owes <strong>{s.to}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: '#dc2626' }}>{formatAmount(s.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
