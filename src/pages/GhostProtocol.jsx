import React, { useState, useEffect } from 'react';

export default function GhostProtocol() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  
  const [skipToday, setSkipToday] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [skipWeekdays, setSkipWeekdays] = useState([]);
  const [baseCheckinTime, setBaseCheckinTime] = useState("10:00");
  const [logs, setLogs] = useState([]);
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
        setSkipWeekdays(data.skip_weekdays || []);
        setBaseCheckinTime(data.base_checkin_time || "10:00");
        setLogs(data.logs || []);
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
          holidays: holidays,
          skip_weekdays: skipWeekdays,
          base_checkin_time: baseCheckinTime
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

  const kickstartSchedule = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch('/api/attendance?action=kickstart', {
        headers: {
          'Authorization': 'Bearer 1234'
        }
      });
      if (response.ok) {
        setMessage({ text: 'QStash Loop successfully kickstarted!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to kickstart schedule. Is QSTASH_TOKEN set?', type: 'error' });
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

  const clearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all logs?")) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 1234'
        },
        body: JSON.stringify({
          skip_today: skipToday,
          holidays: holidays,
          skip_weekdays: skipWeekdays,
          base_checkin_time: baseCheckinTime,
          clear_logs: true
        })
      });

      if (response.ok) {
        setLogs([]);
        setMessage({ text: 'Logs cleared successfully', type: 'success' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to clear logs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const removeHoliday = (dateToRemove) => {
    setHolidays(holidays.filter(date => date !== dateToRemove));
  };

  const toggleWeekday = (dayIndex) => {
    if (skipWeekdays.includes(dayIndex)) {
      setSkipWeekdays(skipWeekdays.filter(d => d !== dayIndex));
    } else {
      setSkipWeekdays([...skipWeekdays, dayIndex]);
    }
  };

  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

          {/* Time Configuration Section */}
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Target Check-In Time</h3>
                <p className="text-sm text-gray-400">The system will check in randomly within ±5 mins of this time.</p>
                <p className="text-xs text-blue-400 mt-1 italic">Check-out automatically occurs 9 hours and 10 minutes later (±5 mins).</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input 
                type="time" 
                value={baseCheckinTime}
                onChange={(e) => setBaseCheckinTime(e.target.value)}
                className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono text-lg"
              />
              <button
                onClick={kickstartSchedule}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg"
              >
                Start/Restart QStash Loop
              </button>
            </div>
          </div>

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
          
          {/* Weekly Schedule Section */}
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Weekly Schedule Skips</h3>
            <p className="text-sm text-gray-400 mb-4">Select days of the week to always skip attendance (e.g., weekends).</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day, index) => (
                <label key={day} className="flex items-center space-x-3 bg-gray-900/50 p-3 rounded-lg border border-gray-600/50 cursor-pointer hover:bg-gray-800 transition-colors">
                  <input 
                    type="checkbox"
                    checked={skipWeekdays.includes(index)}
                    onChange={() => toggleWeekday(index)}
                    className="w-5 h-5 rounded border-gray-500 text-blue-500 focus:ring-blue-500 bg-gray-800"
                  />
                  <span className="text-gray-300 font-medium">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Logs Section */}
          <div className="bg-gray-700/30 p-5 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Recent Execution Logs</h3>
                <p className="text-sm text-gray-400">Last 20 automated cron executions.</p>
              </div>
              <button 
                onClick={clearLogs}
                disabled={loading || logs.length === 0}
                className="text-sm bg-red-900/50 hover:bg-red-800 text-red-200 py-1 px-3 rounded border border-red-800 transition-colors disabled:opacity-50"
              >
                Clear Logs
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-gray-500 italic text-sm">No logs available yet.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-900/80 p-3 rounded-lg border border-gray-700/50 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-400 font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                      <span className="text-gray-200 mt-1">{log.message}</span>
                    </div>
                    <div className="flex items-center mt-2 sm:mt-0 space-x-3">
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs font-bold text-gray-300 border border-gray-600 uppercase">
                        {log.action}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        log.status === 'success' ? 'bg-green-900/40 text-green-400 border border-green-800' :
                        log.status === 'error' ? 'bg-red-900/40 text-red-400 border border-red-800' :
                        'bg-yellow-900/40 text-yellow-400 border border-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
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
