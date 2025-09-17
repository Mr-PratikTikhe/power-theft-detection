import React, { useState } from 'react';
import { Calendar, Shield, Smartphone, Mail, Key, MapPin, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import './Dashboard.css';
import './Profile.css';

const PowerTheftProfile = () => {
  
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@powertech.com",
    role: "Senior Field Engineer",
    avatar: "SJ",
    status: "Active",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    deviceId: "PTD-2024-001",
    accountCreated: "2023-08-15"
  });
  
  const handleEditToggle = () => {
    setEditing(!editing);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  

  return (
    <Layout title="Power Theft Detection" subtitle="Profile" avatar={user.avatar}>
      <div className="pfd-profile-card">
        <div className="p-8">
          <div className="profile-hero">
            <div className="profile-avatar">{user.avatar}</div>
            <div className="profile-info">
              <h3>{user.name}</h3>
              <p>{user.role}</p>
              <div className="profile-badges">
                <div className={`status-badge ${user.status==='Active' ? 'status-active' : 'status-off'}`}>{user.status}</div>
                <div className="text-xs text-gray-400">Member since {user.accountCreated}</div>
              </div>
            </div>
            <div className="profile-actions">
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={handleEditToggle} className="pfd-button">Save</button>
                  <button onClick={handleEditToggle} className="pfd-button-secondary">Cancel</button>
                </div>
              ) : (
                <button onClick={handleEditToggle} className="pfd-button">Edit Profile</button>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat">
              <div className="label">Assigned Devices</div>
              <div className="value">12</div>
            </div>
            <div className="stat">
              <div className="label">Active Incidents</div>
              <div className="value">3</div>
            </div>
            <div className="stat">
              <div className="label">Uptime</div>
              <div className="value">99.7%</div>
            </div>
          </div>

          <div className="profile-details">
            <div className="pfd-section-card">
              <h4 className="font-semibold text-lg mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Mail size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Email Address</div>
                    {editing ? (
                      <input type="email" name="email" value={user.email} onChange={handleInputChange} className="pfd-input w-full px-2 py-1 rounded-md" />
                    ) : (
                      <div className="text-sm font-medium">{user.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Smartphone size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Phone Number</div>
                    {editing ? (
                      <input type="tel" name="phone" value={user.phone} onChange={handleInputChange} className="pfd-input w-full px-2 py-1 rounded-md" />
                    ) : (
                      <div className="text-sm font-medium">{user.phone}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Location</div>
                    {editing ? (
                      <input type="text" name="location" value={user.location} onChange={handleInputChange} className="pfd-input w-full px-2 py-1 rounded-md" />
                    ) : (
                      <div className="text-sm font-medium">{user.location}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pfd-section-card">
              <h4 className="font-semibold text-lg mb-3">Account Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <Activity size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Device ID</div>
                    <div className="text-sm font-medium">{user.deviceId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar size={16} className="text-gray-500" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="text-sm font-medium">{user.accountCreated}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-3">Security Settings</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-2 p-3 text-left pfd-button-secondary rounded-lg">
                    <Key size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-300">Change Password</span>
                  </button>
                  <button className="w-full flex items-center gap-2 p-3 text-left pfd-button-secondary rounded-lg">
                    <Shield size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-300">Two-Factor Authentication</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PowerTheftProfile;