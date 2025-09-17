import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, FileText, AlertTriangle, Settings as SettingsIcon, LogOut, Zap } from 'lucide-react';
import '../pages/Dashboard.css';

export default function Layout({ title, subtitle, avatar = 'SJ', children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
    { icon: LogOut, label: 'Logout', path: '/login' },
  ];

  return (
    <div className="pfd-dashboard">
      <header className="pfd-header p-4">
        <div className="header-inner">
          <div className="header-title">
            <div className="text-lg font-semibold">{title}</div>
            {subtitle ? <div className="text-xs text-gray-400">{subtitle}</div> : null}
          </div>
          <div className="control-row">
            <button onClick={() => setSidebarOpen(s => !s)} className="pfd-button">Control Panel</button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">{avatar}</div>
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
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`mb-2 ${window.location.pathname === item.path ? 'active' : ''}`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="pfd-main flex-1">
          <div className="dashboard-inner">{children}</div>
          <footer className="pfd-footer mt-6">© 2024 Power Theft Detection System. All rights reserved.</footer>
        </main>
      </div>
    </div>
  );
}
