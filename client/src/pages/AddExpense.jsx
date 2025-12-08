import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Save, X, Calendar, Tag, FileText, DollarSign, Loader } from 'lucide-react';
import * as Icons from 'lucide-react';

const AddExpense = () => {
  const { categories, addExpense, settings } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        date: new Date(formData.date).toISOString(),
        source: 'MANUAL',
      };

      await addExpense(expenseData);
      
      // Reset form and navigate back
      navigate('/');
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error('Error adding expense:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Get currency symbol
  const currencySymbol = settings?.currency === 'USD' ? '$' 
    : settings?.currency === 'EUR' ? '€'
    : settings?.currency === 'GBP' ? '£'
    : settings?.currency === 'JPY' ? '¥'
    : '₹'; // Default to INR

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
          <PlusCircle className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Add Expense</h1>
          <p className="text-sm text-tertiary">Track your spending</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 animate-fade-in">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div className="card p-5 animate-slide-up">
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <DollarSign size={18} className="text-primary" />
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-tertiary">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 text-2xl font-bold rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
              autoFocus
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <FileText size={18} className="text-primary" />
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="e.g., Grocery shopping"
            className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
            maxLength={100}
          />
        </div>

        {/* Category Selection */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <Tag size={18} className="text-primary" />
            Category
          </label>
          
          {categories.length === 0 ? (
            <p className="text-sm text-tertiary">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const IconComponent = Icons[category.icon] || Icons.Circle;
                const isSelected = formData.categoryId === category.id.toString();
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChange('categoryId', category.id.toString())}
                    className={`p-4 rounded-lg border-2 transition ${
                      isSelected
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{
                      background: isSelected 
                        ? `${category.color}15` 
                        : 'transparent'
                    }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="rounded-full p-2"
                        style={{ background: `${category.color}20` }}
                      >
                        <IconComponent 
                          size={20} 
                          style={{ color: category.color }} 
                        />
                      </div>
                      <span className="text-sm font-semibold">{category.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Date Input */}
        <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <label className="flex items-center gap-2 mb-3 font-semibold text-sm">
            <Calendar size={18} className="text-primary" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            type="button"
            onClick={handleCancel}
            className="btn flex-1 flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-tertiary"
            disabled={saving}
          >
            <X size={18} />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            style={{ 
              background: 'var(--gradient-primary)',
              border: 'none',
            }}
          >
            {saving ? (
              <>
                <Loader size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Add Expense
              </>
            )}
          </button>
        </div>
      </form>

      {/* Bottom spacing */}
      <div style={{ height: '20px' }} />
    </div>
  );
};

export default AddExpense;
