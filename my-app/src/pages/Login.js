import React, { useState } from "react";
import './Login.css';

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// Proxy login handler (mock)
	const handleLogin = (e) => {
		e.preventDefault();
		if (email === "admin@gmail.com" && password === "admin123") {
			window.location.href = "/dashboard";
		} else {
			setError("Invalid credentials. Try admin@gmail.com / admin123");
		}
	};

	return (
		<div className="pfd-login-container">
			{/* Background Illustration */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
				<svg width="400" height="400" viewBox="0 0 400 400" fill="none" className="pfd-background-svg">
					<circle cx="200" cy="200" r="180" stroke="#3B82F6" strokeOpacity="0.1" strokeWidth="20" />
					<rect x="120" y="120" width="160" height="160" rx="40" stroke="#3B82F6" strokeOpacity="0.08" strokeWidth="15" />
					<path d="M100 300 Q200 100 300 300" stroke="#3B82F6" strokeWidth="6" fill="none" strokeOpacity="0.05" />
					<rect x="170" y="170" width="60" height="60" rx="12" fill="#F59E42" fillOpacity="0.06" />
				</svg>
			</div>
			
			<form onSubmit={handleLogin} className="pfd-card w-full max-w-md flex flex-col gap-6">
				<h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">Power Theft Detection</h1>
				<div className="flex flex-col gap-2">
					<label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">Email  :    </label>
					<input id="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 pfd-input" />
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">Password  :    </label>
					<input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 pfd-input" />
				</div>
				{error && <div className="text-red-500 text-sm text-center">{error}</div>}
				<button type="submit" className="w-full text-white font-bold py-2 rounded-lg shadow transition pfd-button">Login</button>
			</form>
		</div>
	);
}