import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, FileText, AlertTriangle, Settings as SettingsIcon, LogOut, Zap, Save } from 'lucide-react';
import './Dashboard.css';

export default function SettingsPage(){
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [samplingInterval, setSamplingInterval] = useState(3);
  const [alertThreshold, setAlertThreshold] = useState(1.5);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Logout', path: '/login' },
  ];

  const saveSettings = () => {
    // placeholder: persist to API or localStorage
    console.log('settings', { notifications, samplingInterval, alertThreshold });
    alert('Settings saved');
  };

  return (
    <div className="pfd-dashboard p-6">
      <header className="pfd-header p-4">
        <div className="header-inner">
          <div className="header-title">
            <div className="text-lg font-semibold">Power Theft Detection</div>
            <div className="text-xs text-gray-400">Settings</div>
          </div>
          <div className="control-row">
            <button onClick={() => setSidebarOpen(s => !s)} className="pfd-button">Control Panel</button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">SJ</div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`pfd-sidebar p-4 ${sidebarOpen ? 'open' : ''}`}>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Zap size={20} />
              <span className="font-medium">Control Panel</span>
            </div>
          </div>

          <nav>
            {sidebarItems.map((item, idx) => (
              <button key={idx} onClick={() => navigate(item.path)} className={`mb-2 ${window.location.pathname === item.path ? 'active' : ''}`}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="pfd-main flex-1">
          <div className="dashboard-inner">
            <div className="pfd-card" style={{maxWidth:920, margin:'0 auto'}}>
              <h3 className="mb-4">Application Settings</h3>

              <div style={{display:'grid',gap:12}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div className="text-sm text-gray-300">Notifications</div>
                    <div className="text-xs text-gray-500">Enable email and push notifications for important alerts</div>
                  </div>
                  <label style={{display:'flex',alignItems:'center',gap:8}}>
                    <input type="checkbox" checked={notifications} onChange={e=>setNotifications(e.target.checked)} />
                  </label>
                </div>

                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div className="text-sm text-gray-300">Sampling Interval (s)</div>
                    <div className="text-xs text-gray-500">How frequently meters report readings</div>
                  </div>
                  <input type="range" min={1} max={10} value={samplingInterval} onChange={e=>setSamplingInterval(Number(e.target.value))} />
                </div>

                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div className="text-sm text-gray-300">Theft Threshold (A)</div>
                    <div className="text-xs text-gray-500">Minimum difference between source and load to flag theft</div>
                  </div>
                  <input type="number" step="0.1" value={alertThreshold} onChange={e=>setAlertThreshold(Number(e.target.value))} style={{width:120}} />
                </div>

                <div style={{display:'flex',justifyContent:'flex-end',marginTop:6}}>
                  <button onClick={saveSettings} className="pfd-button"><Save size={14} style={{marginRight:8}}/>Save Settings</button>
                </div>
              </div>
            </div>
          </div>
          <footer className="pfd-footer mt-6">© 2024 Power Theft Detection System. All rights reserved.</footer>
        </main>
      </div>
    </div>
  );
}
