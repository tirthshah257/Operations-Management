import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MeteoricLogo from '../../components/common/MeteoricLogo';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

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
    { role: 'Super Admin', displayRole: 'Meteoric 360', email: 'admin@enterprise.com' },
    { role: 'IT Admin', displayRole: 'Mithun — IT Admin', email: 'mithun@enterprise.com' },
    { role: 'Admin', displayRole: 'Kiran Patel — Admin', email: 'kiran.patel@enterprise.com' },
    { role: 'End User', displayRole: 'Neha Gupta — User', email: 'neha.gupta@enterprise.com' },
    { role: 'Manager', displayRole: 'Manager', email: 'priya.sharma@enterprise.com' },
    { role: 'Technician', displayRole: 'Technician', email: 'amit.joshi@enterprise.com' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-center py-2">
          <MeteoricLogo className="h-10" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
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
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
          >
            Sign In to Meteoric 360
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => { loginDemo('admin@enterprise.com'); navigate('/dashboard'); }}
            className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            Sign In with SSO Demo (Meteoric 360)
          </button>
        </div>

        {/* Quick Role Fill Demo Buttons */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Quick Demo Account Selector</p>
          <div className="grid grid-cols-2 gap-2">
            {quickRoles.map(item => (
              <button
                key={item.role}
                onClick={() => { setEmail(item.email); loginDemo(item.email); navigate('/dashboard'); }}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 text-left transition-colors"
              >
                <div className="font-extrabold text-blue-400 truncate">{item.displayRole}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
