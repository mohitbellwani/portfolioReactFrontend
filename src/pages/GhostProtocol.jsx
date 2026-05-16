import React, { useState, useEffect } from 'react';

export default function GhostProtocol() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  
  const [skipToday, setSkipToday] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [newHoliday, setNewHoliday] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAuthenticated(true);
      fetchSettings();
    } else {
      alert('Access Denied');
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSkipToday(data.skip_today || false);
        setHolidays(data.holidays || []);
      } else {
        setMessage({ text: 'Failed to fetch settings', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 1234',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skip_today: skipToday,
          holidays: holidays
        })
      });

      if (response.ok) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to save settings', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Error connecting to server', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addHoliday = () => {
    if (newHoliday && !holidays.includes(newHoliday)) {
      setHolidays([...holidays, newHoliday].sort());
      setNewHoliday('');
    }
  };

  const removeHoliday = (dateToRemove) => {
    setHolidays(holidays.filter(date => date !== dateToRemove));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">GHOST PROTOCOL</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-4"
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wider text-blue-400">ATTENDANCE SETTINGS</h1>
          {loading && <span className="text-sm text-gray-400 animate-pulse">Syncing...</span>}
        </div>
        
        <div className="p-6 space-y-8">
          {message.text && (
            <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Skip Today Section */}
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Skip Today</h3>
              <p className="text-sm text-gray-400">Prevent the cron job from running today only. Auto-resets tomorrow.</p>
            </div>
            <button
              onClick={() => setSkipToday(!skipToday)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${skipToday ? 'bg-blue-500' : 'bg-gray-600'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${skipToday ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Holidays Section */}
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Holidays List</h3>
            <p className="text-sm text-gray-400 mb-4">Dates when attendance should automatically be skipped.</p>
            
            <div className="flex space-x-3 mb-6">
              <input
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={addHoliday}
                className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Add Date
              </button>
            </div>

            <div className="space-y-2">
              {holidays.length === 0 ? (
                <p className="text-gray-500 italic text-sm">No holidays configured.</p>
              ) : (
                holidays.map(date => (
                  <div key={date} className="flex justify-between items-center bg-gray-900/80 p-3 rounded-lg border border-gray-700/50">
                    <span className="text-gray-300 font-mono">{date}</span>
                    <button 
                      onClick={() => removeHoliday(date)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={saveSettings}
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all ${
                loading ? 'bg-blue-800 text-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-900/50 hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Saving...' : 'SAVE CONFIGURATION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
