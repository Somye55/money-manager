import React from 'react';
import { Check, X, MessageSquare, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

const SMSExpenseCard = ({ expense, onImport, onDismiss, saving }) => {
  const { categories, settings } = useData();
  
  // Format currency
  const currencySymbol = settings?.currency === 'USD' ? '$' 
    : settings?.currency === 'EUR' ? '€'
    : settings?.currency === 'GBP' ? '£'
    : settings?.currency === 'JPY' ? '¥'
    : '₹';

  // Find suggested category color/icon
  const suggestedCategory = categories.find(c => 
    c.name.toLowerCase() === (expense.suggestedCategory || '').toLowerCase()
  );
  const color = suggestedCategory ? suggestedCategory.color : '#64748b'; // Default gray

  return (
    <div className="card p-3 mb-3 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-full">
                <MessageSquare size={14} className="text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary px-2 py-0.5 bg-primary/5 rounded">
              New Transaction Detected
            </span>
        </div>
        <span className="text-xs text-tertiary">
          {new Date(expense.date).toLocaleDateString()}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="font-bold text-gray-800 dark:text-gray-100">{expense.merchant || 'Unknown Merchant'}</h4>
          <p className="text-sm text-tertiary truncate max-w-[200px]">{expense.suggestedCategory || 'Uncategorized'}</p>
        </div>
        <div className="text-right">
          <span className="block font-bold text-lg text-danger">
            {currencySymbol}{expense.amount.toFixed(2)}
          </span>
        </div>
      </div>
      
      {/* Raw SMS Preview (Optional, can be hidden) */}
      <div className="bg-bg-secondary p-2 rounded text-xs text-tertiary mb-3 italic truncate">
        "{expense.rawSMS}"
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onDismiss(expense)}
          className="flex-1 py-2 px-3 rounded-lg border border-border text-sm font-medium hover:bg-bg-secondary transition flex items-center justify-center gap-1"
          disabled={saving}
        >
          <X size={16} className="text-tertiary" />
          Dismiss
        </button>
        <button 
          onClick={() => onImport(expense)}
          className="flex-1 py-2 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition shadow-sm flex items-center justify-center gap-1"
          disabled={saving}
        >
          <Check size={16} />
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default SMSExpenseCard;