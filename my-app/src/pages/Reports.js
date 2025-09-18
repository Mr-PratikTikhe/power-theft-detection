
import React, { useEffect, useMemo, useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Download, Search } from 'lucide-react';
import './Dashboard.css';
import './Reports.css';

// small helper to format date
const fmt = (d) => new Date(d).toLocaleString();


const generateRow = (base = new Date()) => {
	// source between 0.100 - 0.300 A
	const sourceVal = 0.100 + Math.random() * 0.200;
	const normalLoss = 0.005 + Math.random() * 0.02;
	const theftChance = Math.random();
	let loadVal;
	if (theftChance > 0.93) {
		// theft spike
		loadVal = 0.58 + Math.random() * 0.05; // ~0.58-0.63
	} else {
		loadVal = Math.max(0, sourceVal - normalLoss);
	}
	const source = Number(sourceVal.toFixed(3));
	const load = Number(loadVal.toFixed(3));
	const theft = (load >= 0.6) || (load - source) >= 0.25;
	const severity = theft ? (Math.random() > 0.6 ? 'High' : 'Medium') : 'Safe';
	return {
		id: `${base.getTime()}-${Math.floor(Math.random() * 1000)}`,
		time: new Date(base).toISOString(),
		source,
		load,
		theft,
		severity,
		device: `MTR-${String(100 + Math.floor(Math.random() * 50))}`,
	};
};

const useAnimatedNumber = (value, duration = 700) => {
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

const BarChart = ({ labels = [], values = [], color = '#ff7b7b', height = 140 }) => {
	const max = Math.max(...values, 1);
	return (
		<div className="pfd-chart-placeholder" style={{display:'flex',alignItems:'end',gap:8}}>
			{values.map((v,i)=> (
				<div key={i} style={{flex:1, textAlign:'center'}} title={`${labels[i]}: ${v}`}>
					<div style={{height: Math.max(6, (v / max) * height), background: color, borderRadius:6, marginBottom:6, transition:'height 300ms'}}></div>
					<div style={{fontSize:11,color:'#9ca3af'}}>{labels[i]}</div>
				</div>
			))}
		</div>
	);
};

const Donut = ({ values = [], colors = ['#48BB78','#4299E1','#ff7b7b'], size=120 }) => {
	const total = values.reduce((s,a)=>s+a,0) || 1;
	let cum = 0;
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
			<g transform={`translate(${size/2},${size/2})`}>
				{values.map((v,i)=>{
					const start = (cum/total) * Math.PI * 2;
					cum += v;
					const end = (cum/total) * Math.PI * 2;
					const large = end - start > Math.PI ? 1 : 0;
					const r = size/2 - 8;
					const x1 = Math.cos(start)*r;
					const y1 = Math.sin(start)*r;
					const x2 = Math.cos(end)*r;
					const y2 = Math.sin(end)*r;
					const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
					return <path key={i} d={d} stroke={colors[i%colors.length]} strokeWidth={16} fill="none" strokeLinecap="butt" />;
				})}
				<circle r={size/2 - 28} fill="#071017" />
			</g>
		</svg>
	);
};

const LineChart = ({ points = [], color = '#4299E1', height = 140 }) => {
	if (!points.length) return <div className="pfd-chart-placeholder">No data</div>;
	const w = Math.max(200, points.length * 28);
	const max = Math.max(...points);
	const min = Math.min(...points);
	const range = Math.max(1, max - min);
	const coords = points.map((v, i) => {
		const x = (i / (points.length - 1)) * (w - 20) + 10;
		const y = height - ((v - min) / range) * (height - 16) - 8;
		return `${x},${y}`;
	});
	const path = `M ${coords.join(' L ')}`;
	return (
		<div className="pfd-chart-placeholder" style={{ overflow: 'auto' }}>
			<svg width={w} height={height}>
				<defs>
					<linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor={color} stopOpacity="0.18" />
						<stop offset="100%" stopColor={color} stopOpacity="0" />
					</linearGradient>
				</defs>
				<path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 400ms' }} />
				<polygon points={`0,${height} ${coords.map(c => c.split(',')[0] + ',' + c.split(',')[1]).join(' ')} ${w},${height}`} fill="url(#grad)" opacity="0.8" />
			</svg>
		</div>
	);
};

export default function Reports() {
	const [rows, setRows] = useState(() => {
		// seed data: last 30 entries
		const list = [];
		for(let i=0;i<30;i++){
			const d = new Date();
			d.setMinutes(d.getMinutes() - (30-i)*15);
			list.push(generateRow(d));
		}
		return list.reverse();
	});

	const [search, setSearch] = useState('');
	const [severity, setSeverity] = useState('All');
	const [dateRange, setDateRange] = useState('30');
	const [device, setDevice] = useState('All');
	const [autoRefresh] = useState(true);

	// auto-refresh simulation: push new row
	useEffect(()=>{
		if(!autoRefresh) return;
		const id = setInterval(()=>{
			setRows(prev => [generateRow(new Date()), ...prev].slice(0,500));
		}, 5000);
		return ()=>clearInterval(id);
	},[autoRefresh]);

	const devices = useMemo(()=>{
		const s = new Set(rows.map(r=>r.device));
		return ['All',...Array.from(s)];
	},[rows]);

	const filtered = useMemo(()=>{
		const now = Date.now();
		const cutoff = dateRange==='7' ? now - 7*24*3600*1000 : dateRange==='1' ? now - 24*3600*1000 : now - 30*24*3600*1000;
		return rows.filter(r=>{
			if(device!=='All' && r.device!==device) return false;
			if(severity!=='All' && r.severity!==severity) return false;
			if(search){
				const s = search.toLowerCase();
				if(!r.device.toLowerCase().includes(s) && !r.time.toLowerCase().includes(s)) return false;
			}
			if(new Date(r.time).getTime() < cutoff) return false;
			return true;
		});
	},[rows,search,severity,dateRange,device]);

	// aggregates for cards & charts
	const totalThefts = useMemo(()=> rows.filter(r=>r.theft).length, [rows]);
	const totalEnergy = useMemo(()=> rows.reduce((s,r)=>s + ((r.source+r.load)/2)*0.25, 0), [rows]); // mock kWh
	const avgDailyLoad = useMemo(()=>{
	    if(!rows.length) return 0;
	    return Number((rows.reduce((s,r)=>s + r.load,0) / rows.length).toFixed(3));
	},[rows]);

	const theftLast30 = useMemo(()=>{
		const counts = {};
		rows.slice(0,30).forEach(r=>{
			const d = new Date(r.time).toLocaleDateString();
			counts[d] = (counts[d]||0) + (r.theft?1:0);
		});
		const labels = Object.keys(counts).slice(-14);
		const vals = labels.map(l=>counts[l]||0);
		return {labels, vals};
	},[rows]);

	const linePoints = useMemo(()=> rows.slice(0,24).map(r=>Number(r.source)), [rows]);
	const pieVals = useMemo(()=> [rows.filter(r=>r.theft).length, rows.filter(r=>!r.theft).length], [rows]);

	const displayThefts = useAnimatedNumber(totalThefts, 900);
	const displayEnergy = useAnimatedNumber(Number(totalEnergy.toFixed(2)), 900);
	const displayAvgLoad = useAnimatedNumber(Number(avgDailyLoad), 900);

	const exportCSV = () =>{
		const header = ['time','device','source','load','theft','severity'];
		const csv = [header.join(',')].concat(filtered.map(r=>[r.time,r.device,r.source,r.load,r.theft?'THEFT':'SAFE',r.severity].join(','))).join('\n');
		const blob = new Blob([csv],{type:'text/csv'});
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a'); a.href = url; a.download = `reports_${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
	};

	const exportPDF = () => {
		// simple print-based PDF export (user can choose PDF in print dialog)
		window.print();
	};

	return (
		<Layout title="Power Theft Detection" subtitle="Reports">
			{/* Top Cards */}
			<section className="pfd-cards-row mb-6">
				<div className="pfd-card neon-red">
					<div className="text-sm text-gray-300 mb-2">Total Theft Cases</div>
					<div className="text-3xl font-bold">{displayThefts}</div>
					<div className="text-xs text-gray-400">(last {rows.length} entries)</div>
				</div>

				<div className="pfd-card neon-blue">
					<div className="text-sm text-gray-300 mb-2">Total Energy (kWh)</div>
					<div className="text-3xl font-bold">{displayEnergy}</div>
					<div className="text-xs text-gray-400">Estimated</div>
				</div>

				<div className="pfd-card neon-green">
					<div className="text-sm text-gray-300 mb-2">Avg Daily Load (A)</div>
					<div className="text-3xl font-bold">{displayAvgLoad}</div>
					<div className="text-xs text-gray-400">Rolling</div>
				</div>

				<div className="pfd-card">
					<div className="text-sm text-gray-300 mb-2">Downtime (hrs)</div>
					<div className="text-3xl font-bold">0</div>
					<div className="text-xs text-gray-400">No recorded downtime</div>
				</div>
			</section>

			<section className="grid lg:grid-cols-3 gap-6 mb-6">
				<div className="lg:col-span-2 pfd-card">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg">Power consumption trends</h3>
						<div className="flex items-center gap-2">
							<select value={dateRange} onChange={e=>setDateRange(e.target.value)} className="rounded px-2 py-1 bg-transparent border">
								<option value="1">Last 24h</option>
								<option value="7">Last 7d</option>
								<option value="30">Last 30d</option>
							</select>
						</div>
					</div>
					<LineChart points={linePoints.slice(0,24)} />
				</div>

				<div className="pfd-card">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg">Summary</h3>
						<div className="flex gap-2">
							<button onClick={exportCSV} className="px-3 py-1 rounded bg-blue-600 text-white flex items-center gap-2"><Download size={14}/> CSV</button>
							<button onClick={exportPDF} className="px-3 py-1 rounded bg-gray-700 text-white">PDF</button>
						</div>
					</div>

					<div style={{display:'grid',gap:12}}>
						<div style={{display:'flex',alignItems:'center',gap:12}}>
							<Donut values={pieVals} />
							<div>
								<div className="flex items-center gap-2"><div className="pfd-alert-badge neon-red">{pieVals[0]}</div><div className="text-sm">Theft</div></div>
								<div className="flex items-center gap-2 mt-2"><div className="pfd-alert-badge neon-green">{pieVals[1]}</div><div className="text-sm">Safe</div></div>
							</div>
						</div>

						<div>
							<h4 className="text-sm text-gray-300 mb-2">Incidents (last 14)</h4>
							<BarChart labels={theftLast30.labels} values={theftLast30.vals} color="#ff7b7b" />
						</div>
					</div>
				</div>
			</section>

			{/* Filters + Table */}
			<section className="pfd-card">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
					<div className="flex items-center gap-2">
						<Search size={16} />
						<input placeholder="Search by device or time" value={search} onChange={e=>setSearch(e.target.value)} className="px-3 py-2 rounded bg-transparent border" />
						<select value={severity} onChange={e=>setSeverity(e.target.value)} className="px-2 py-1 rounded bg-transparent border">
							<option>All</option>
							<option>Safe</option>
							<option>Medium</option>
							<option>High</option>
						</select>
						<select value={device} onChange={e=>setDevice(e.target.value)} className="px-2 py-1 rounded bg-transparent border">
							{devices.map(d=> <option key={d} value={d}>{d}</option>)}
						</select>
					</div>

					<div className="flex items-center gap-2">
						<button onClick={()=>{ setRows(prev => [generateRow(new Date()), ...prev].slice(0,500)); }} className="px-3 py-1 rounded bg-blue-600 text-white">Add Row</button>
						<button onClick={exportCSV} className="px-3 py-1 rounded bg-gray-700 text-white">Export CSV</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-xs text-gray-400">
								<th className="px-3 py-2">Date & Time</th>
								<th className="px-3 py-2">Device</th>
								<th className="px-3 py-2">Source (A)</th>
								<th className="px-3 py-2">Load (A)</th>
								<th className="px-3 py-2">Status</th>
								<th className="px-3 py-2">Alert Level</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((r,i)=> (
								<tr key={r.id} className={i%2===0? 'striped':' '}>
									<td className="px-3 py-2">{fmt(r.time)}</td>
									<td className="px-3 py-2">{r.device}</td>
									<td className="px-3 py-2">{Number(r.source).toFixed(3)}</td>
									<td className="px-3 py-2">{Number(r.load).toFixed(3)}</td>
									<td className="px-3 py-2"><span className={`pfd-alert-badge ${r.theft? 'neon-red':'neon-green'}`}>{r.theft? 'THEFT':'SAFE'}</span></td>
									<td className="px-3 py-2"><span className={`pfd-alert-badge`}>{r.severity}</span></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</Layout>
	);
}
