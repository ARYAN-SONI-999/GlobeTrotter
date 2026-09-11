import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PackingListModal({ isOpen, onClose, destinationName, daysCount, activities }) {
  const [items, setItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!isOpen) return;

    const fetchPackingList = async () => {
      setLoading(true);
      try {
        const res = await api.post('/planner/packing-list', {
          destinationName,
          daysCount: daysCount || 3,
          activities: activities || []
        });
        setItems(res.data.items || []);
      } catch (err) {
        console.error('Failed to load packing list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackingList();
  }, [isOpen, destinationName, daysCount, activities]);

  if (!isOpen) return null;

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['All', ...new Set(items.map((i) => i.category))];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter((i) => i.category === selectedCategory);

  const completedCount = items.filter((i) => checkedItems[i.id]).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content packing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>🧳 Smart Packing Checklist</h2>
            <p className="modal-subtitle">
              Customized for {destinationName || 'your trip'} ({daysCount || 3} days)
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress Bar */}
        <div className="packing-progress-container">
          <div className="packing-progress-label">
            <span>{completedCount} of {items.length} packed</span>
            <span className="bold">{progressPercent}%</span>
          </div>
          <div className="packing-progress-bar">
            <div className="packing-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="packing-categories-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Item List */}
        <div className="packing-items-list">
          {loading ? (
            <div className="loading-state">Generating packing recommendations...</div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">No items found in this category.</div>
          ) : (
            filteredItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <label key={item.id} className={`packing-item-row ${isChecked ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                  />
                  <span className="packing-item-text">{item.item}</span>
                  <span className="packing-item-tag">{item.category}</span>
                </label>
              );
            })
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setCheckedItems({})}>Reset All</button>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
