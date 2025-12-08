import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, User, Bell, Palette, DollarSign, LogOut, Save, Loader, Check } from 'lucide-react';

const Settings = () => {
  const { user: authUser, signOut } = useAuth();
  const { user, settings, modifySettings, loading: dataLoading } = useData();
  const { theme: currentTheme, setSpecificTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    currency: 'INR',
    monthlyBudget: '',
    enableNotifications: true,
    theme: 'system',
  });
  
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency || 'INR',
        monthlyBudget: settings.monthlyBudget ? settings.monthlyBudget.toString() : '',
        enableNotifications: settings.enableNotifications ?? true,
        theme: settings.theme || 'system',
      });
    }
  }, [settings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveMessage(''); // Clear message when user makes changes
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage('');

      const updates = {
        currency: formData.currency,
        monthlyBudget: formData.monthlyBudget ? parseFloat(formData.monthlyBudget) : null,
        enableNotifications: formData.enableNotifications,
        theme: formData.theme,
      };

      await modifySettings(updates);
      
      // Update theme in ThemeContext immediately
      setSpecificTheme(formData.theme);
      
      setSaveMessage('Settings saved successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl" style={{ background: 'var(--gradient-primary)' }}>
          <SettingsIcon className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-tertiary">Manage your preferences</p>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div 
          className={`p-4 rounded-lg animate-fade-in ${
            saveMessage.includes('success') 
              ? 'bg-green-500/10 border border-green-500/30 text-green-600' 
              : 'bg-red-500/10 border border-red-500/30 text-red-600'
          }`}
        >
          <p className="text-sm font-medium">{saveMessage}</p>
        </div>
      )}

      {/* Profile Section */}
      <div className="card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" 
                 style={{ background: 'var(--gradient-primary)', color: 'white' }}>
              {authUser?.user_metadata?.name?.charAt(0)?.toUpperCase() || 
               authUser?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-base">
                {authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-sm text-tertiary">{authUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Currency</h3>
        </div>
        
        <select
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.symbol} {curr.name} ({curr.code})
            </option>
          ))}
        </select>
      </div>

      {/* Budget Settings */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Monthly Budget</h3>
        </div>
        
        <div>
          <input
            type="number"
            value={formData.monthlyBudget}
            onChange={(e) => handleChange('monthlyBudget', e.target.value)}
            placeholder="Enter monthly budget (optional)"
            className="w-full p-3 rounded-lg border border-border bg-bg-secondary outline-none focus:border-primary transition"
          />
          <p className="text-xs text-tertiary mt-2">
            Set a monthly spending limit to track your budget
          </p>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Palette size={20} className="text-primary" />
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {themes.map((themeOption) => {
            const isSelected = formData.theme === themeOption.value;
            
            return (
              <button
                key={themeOption.value}
                type="button"
                onClick={() => handleChange('theme', themeOption.value)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
                style={{
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                
                <div className="text-2xl mb-1">{themeOption.icon}</div>
                <div className={`text-sm font-semibold ${
                  isSelected ? 'text-primary' : 'text-text-secondary'
                }`}>
                  {themeOption.label}
                </div>
              </button>
            );
          })}
        </div>
        
        <p className="text-xs text-tertiary mt-3 text-center">
          {formData.theme === 'system' 
            ? '💡 Following your system preference' 
            : formData.theme === 'dark'
            ? '🌙 Dark mode active'
            : '☀️ Light mode active'}
        </p>
      </div>

      {/* Notifications */}
      <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            <div>
              <h3 className="font-bold text-base">Notifications</h3>
              <p className="text-xs text-tertiary">Enable push notifications</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enableNotifications}
              onChange={(e) => handleChange('enableNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary btn-block flex items-center justify-center gap-2 animate-slide-up"
        style={{ 
          animationDelay: '0.5s',
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
            Save Settings
          </>
        )}
      </button>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="btn btn-block flex items-center justify-center gap-2 animate-slide-up"
        style={{ 
          animationDelay: '0.6s',
          background: 'var(--gradient-danger)',
          border: 'none',
          color: 'white',
        }}
      >
        <LogOut size={18} />
        Sign Out
      </button>

      {/* Bottom spacing */}
      <div style={{ height: '20px' }} />
    </div>
  );
};

export default Settings;
