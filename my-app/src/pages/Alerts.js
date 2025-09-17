import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, FileText, AlertTriangle, Settings as SettingsIcon, LogOut, Zap } from 'lucide-react';
import './Dashboard.css';

export default function AlertsPage(){
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Logout', path: '/login' },
  ];

  useEffect(()=>{
    // seed some alerts
    const list = [];
    for(let i=0;i<8;i++){
      list.push({id:i, level: i%3===0? 'HIGH' : (i%3===1? 'MEDIUM':'LOW'), text:`Meter MTR-${100+i} reported abnormal drift`, time: new Date(Date.now()-i*60000).toLocaleString()});
    }
    setAlerts(list);
  },[]);

  return (
    <div className="pfd-dashboard p-6">
      <header className="pfd-header p-4">
        <div className="header-inner">
          <div className="header-title">
            <div className="text-lg font-semibold">Power Theft Detection</div>
            <div className="text-xs text-gray-400">Alerts</div>
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
              <h3 className="mb-4">Recent Alerts</h3>
              <div style={{display:'grid',gap:8}}>
                {alerts.map(a=> (
                  <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,borderRadius:8,background:'rgba(255,255,255,0.01)'}}>
                    <div>
                      <div style={{fontWeight:700}}>{a.text}</div>
                      <div style={{fontSize:12,color:'#9ca3af'}}>{a.time}</div>
                    </div>
                    <div style={{padding:'6px 10px',borderRadius:999,background: a.level==='HIGH'? 'rgba(255,77,77,0.12)': a.level==='MEDIUM' ? 'rgba(255,195,0,0.08)' : 'rgba(59,130,246,0.06)'}}>{a.level}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <footer className="pfd-footer mt-6">© 2024 Power Theft Detection System. All rights reserved.</footer>
        </main>
      </div>
    </div>
  );
}
