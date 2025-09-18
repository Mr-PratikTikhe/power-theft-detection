import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import { Wifi, WifiOff } from 'lucide-react';

import './Dashboard.css';

const PowerTheftDashboard = () => {
  
  // realistic small-range readings (Amps) per hardware
  const [sourceCurrent, setSourceCurrent] = useState(0.15);
  const [loadCurrent, setLoadCurrent] = useState(0.14);
  const [theftDetected, setTheftDetected] = useState(false);
  const [isOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [historicalData, setHistoricalData] = useState([]);

  // Animated number helper
  const useAnimatedNumber = (value, duration = 600) => {
    const [display, setDisplay] = useState(value);
    const raf = useRef(null);
    useEffect(() => {
      const start = performance.now();
      const from = display;
      const to = value;
      cancelAnimationFrame(raf.current);
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const cur = from + (to - from) * t;
        setDisplay(Number(cur.toFixed(2)));
        if (t < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    return display;
  };

  // Small SVG line chart for realtime flow
  const RealTimeChart = ({ data = [], height = 96 }) => {
    const points = data.map(d => d.source || 0).slice(-24);
    if (!points.length) return <div className="pfd-chart-placeholder">No data</div>;
    const w = Math.max(240, points.length * 18);
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = Math.max(0.1, max - min);
    const coords = points.map((v, i) => {
      const x = (i / (points.length - 1)) * (w - 20) + 10;
      const y = height - ((v - min) / range) * (height - 16) - 8;
      return `${x},${y}`;
    });
    const path = `M ${coords.join(' L ')}`;
    return (
      <div className="pfd-chart-placeholder" style={{overflowX: 'auto'}}>
        <svg width={w} height={height}>
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4299E1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4299E1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={path} fill="none" stroke="#4299E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points={`0,${height} ${coords.map(c => c.split(',')[0] + ',' + c.split(',')[1]).join(' ')} ${w},${height}`} fill="url(#g1)" opacity="0.9" />
        </svg>
      </div>
    );
  };

  // Simple gauge for current value
  const Gauge = ({ value = 0, max = 20, size = 96 }) => {
    const pct = Math.min(1, Math.max(0, value / max));
    const angle = pct * 180; // semi-circle
    const r = size / 2 - 8;
    const cx = size / 2;
    const cy = size / 2;
  const dash = `${angle / 180}`;
    return (
      <svg width={size} height={size / 1.2} viewBox={`0 0 ${size} ${size / 1.2}`}>
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#48BB78" />
            <stop offset="100%" stopColor="#4299E1" />
          </linearGradient>
        </defs>
        <g transform={`translate(${cx},${cy})`}>
          <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`} stroke="url(#g2)" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${Math.max(0.01, dash)} 1`} transform={`rotate(${180 - angle})`} />
          <text x="0" y="6" textAnchor="middle" fontSize="18" fill="#e6eef8" fontWeight={700}>{value} A</text>
        </g>
      </svg>
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Normal source between 0.100 and 0.300 A
      const newSource = 0.100 + Math.random() * 0.200;
      // Small normal measurement loss
      const normalLoss = 0.005 + Math.random() * 0.02;

      const theftChance = Math.random();
      // Simulate theft: occasional event where load spikes to ~0.600 A
      let newLoad;
      if (theftChance > 0.93) {
        // load spike (hike) to indicate tampering/theft
        newLoad = 0.58 + Math.random() * 0.05; // ~0.58 - 0.63
      } else {
        // normal: load close to source minus small loss
        newLoad = Math.max(0.0, newSource - normalLoss);
      }

      const roundedSource = Number(newSource.toFixed(3));
      const roundedLoad = Number(newLoad.toFixed(3));

      setSourceCurrent(roundedSource);
      setLoadCurrent(roundedLoad);
      // Detect theft when load jumps to ~0.6 AND the difference (load - source) is significant
      setTheftDetected(newLoad >= 0.6 || (newLoad - newSource) >= 0.25);
      setCurrentTime(new Date());

      setHistoricalData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), source: roundedSource, load: Math.max(0, roundedLoad) }];
        return newData.slice(-24);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  

  return (
    <Layout title="Power Theft Detection" subtitle="Operations Dashboard">
      <section className="pfd-cards-row mb-6">
            <div className="pfd-card neon-blue">
              <div className="card-header">
                <div>
                  <div className="text-sm text-gray-300">Source Current</div>
                  <div className="text-xs text-gray-500">Live</div>
                </div>
                <div className="card-icon bg-blue-500">SC</div>
              </div>
              <div className="metric">{useAnimatedNumber(sourceCurrent)} A</div>
            </div>

            <div className="pfd-card neon-green">
              <div className="card-header">
                <div>
                  <div className="text-sm text-gray-300">Load Current</div>
                  <div className="text-xs text-gray-500">Live</div>
                </div>
                <div className="card-icon bg-green-500">LC</div>
              </div>
              <div className="metric">{useAnimatedNumber(loadCurrent)} A</div>
            </div>

            <div className={`pfd-card ${theftDetected ? 'neon-red' : 'neon-green'}`}>
              <div className="card-header">
                <div>
                  <div className="text-sm text-gray-300">Theft Status</div>
                  <div className="text-xs text-gray-500">Alert</div>
                </div>
                <div className="card-icon" style={{background: theftDetected? 'var(--neon-red)':'var(--neon-green)'}}>{theftDetected? '!' : '✓'}</div>
              </div>
              <div className="metric">{theftDetected ? 'DETECTED' : 'SAFE'}</div>
              <div className="text-xs text-gray-400">Diff: {(sourceCurrent - loadCurrent).toFixed(2)} A</div>
            </div>
          </section>

          <section className="pfd-charts mb-6">
            <div className="pfd-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="mb-0">Real-time Current Flow</h3>
                <div className="text-xs text-gray-400">Last: {currentTime.toLocaleTimeString()}</div>
              </div>
              <RealTimeChart data={historicalData} />
              <div className="mt-3">
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{flex:1}}>
                    <div className="text-xs text-gray-400">Source (blue)</div>
                    <div className="sparkline" style={{height:36}}>
                      {/* tiny visual sparkline using bars */}
                      <div style={{display:'flex',alignItems:'end',gap:4}}>
                        {historicalData.slice(-24).map((d,i)=> <div key={i} style={{width:6,height:Math.max(4,(d.source/15)*36),background:'#4299E1',borderRadius:2}} />)}
                      </div>
                    </div>
                  </div>
                  <div style={{width:120,display:'flex',justifyContent:'center'}}>
                    <Gauge value={sourceCurrent} max={20} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pfd-card">
              <h3 className="mb-3">Power Consumption Gauge</h3>
              <div className="pfd-chart-placeholder">
                <Gauge value={sourceCurrent} max={20} size={140} />
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 pfd-card">
              <h3 className="mb-3">Recent Alerts</h3>
              <div style={{maxHeight:320, overflowY:'auto', display:'grid', gap:8}}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:12,background:'rgba(255,255,255,0.01)',borderRadius:8}}>
                    <div>
                      <div style={{fontWeight:600}}>Alert {i}</div>
                      <div style={{fontSize:12,color:'#9ca3af'}}>Today • 14:{10+i}</div>
                    </div>
                    <div style={{padding:'4px 8px',borderRadius:999,background:'#2bff9d',color:'#022'}}>{i%3===0?'THEFT':'SAFE'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pfd-card">
              <h3 className="mb-3">System Status</h3>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <div>Device Status</div>
                  </div>
                  <div style={{padding:'4px 8px',borderRadius:8,background:isOnline?'#e6fff0':'#ffecec',color:isOnline?'#036':'#600'}}>{isOnline?'ONLINE':'OFFLINE'}</div>
                </div>
                <div style={{fontSize:13,color:'#9ca3af'}}>Last Update: {currentTime.toLocaleTimeString()}</div>
                <div style={{height:8,background:'rgba(255,255,255,0.03)',borderRadius:999}}><div style={{width:'78%',height:'100%',background:'#007bff',borderRadius:999}} /></div>
                <div style={{fontSize:12,color:'#9ca3af'}}>78% Complete</div>
              </div>
            </div>
          </section>
    </Layout>
  );
};

export default PowerTheftDashboard;