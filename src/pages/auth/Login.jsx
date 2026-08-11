import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@enterprise.com');
  const [password, setPassword] = useState('demo123');
  const { loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    loginDemo(email);
    navigate('/dashboard');
  };

  const quickRoles = [
    { role: 'Super Admin', email: 'admin@enterprise.com' },
    { role: 'IT Admin', email: 'rahul.mehta@enterprise.com' },
    { role: 'Manager', email: 'priya.sharma@enterprise.com' },
    { role: 'Technician', email: 'amit.joshi@enterprise.com' },
    { role: 'End User', email: 'neha.gupta@enterprise.com' },
    { role: 'Inventory Manager', email: 'ramesh.patel@enterprise.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Enterprise SaaS</h1>
            <p className="text-xs text-blue-400 font-semibold">Asset & Ticketing Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-blue-600 focus:ring-0" />
              <span>Remember Me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo authentication mode'); }} className="text-blue-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            Sign In Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/60">
          <button
            onClick={() => { loginDemo('admin@enterprise.com'); navigate('/dashboard'); }}
            className="w-full py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-600"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            Sign In with Single Sign-On (SSO Demo)
          </button>
        </div>

        {/* Quick Role Fill Demo Buttons */}
        <div className="mt-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Demo Account Selector</p>
          <div className="grid grid-cols-2 gap-2">
            {quickRoles.map(item => (
              <button
                key={item.role}
                onClick={() => { setEmail(item.email); loginDemo(item.email); navigate('/dashboard'); }}
                className="p-2 bg-slate-900/60 hover:bg-slate-700/50 border border-slate-700/60 rounded-lg text-[11px] font-semibold text-slate-300 text-left transition-colors"
              >
                <div className="font-bold text-blue-400">{item.role}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
