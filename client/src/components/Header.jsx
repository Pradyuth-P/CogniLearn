import { BrainCircuit, ShieldCheck, Home, BookOpen, BarChart2, Bell } from 'lucide-react';
import { useApp } from '../App.jsx';

export default function Header() {
    const { view, navigate, activeProfiles, isFacultyLoggedIn } = useApp();
    const isMonitoring = view === 'module';

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex justify-between items-center px-6 z-50 sticky top-0" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('onboarding')}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="font-bold text-base tracking-tight text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        CogniLearn
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-500 ml-1.5 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">v3.5</span>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
                <button onClick={() => navigate('onboarding')} className={`nav-link flex items-center gap-1.5 ${view === 'onboarding' ? 'active' : ''}`}>
                    <Home className="w-3.5 h-3.5" />Home
                </button>
                <button onClick={() => navigate('module')} className={`nav-link flex items-center gap-1.5 ${view === 'module' ? 'active' : ''}`}>
                    <BookOpen className="w-3.5 h-3.5" />Learn
                </button>
                {isFacultyLoggedIn && (
                    <button onClick={() => navigate('dashboard')} className={`nav-link flex items-center gap-1.5 ${view === 'dashboard' ? 'active' : ''}`}>
                        <BarChart2 className="w-3.5 h-3.5" />Dashboard
                    </button>
                )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Adaptive badges */}
                {isMonitoring && activeProfiles.size > 0 && (
                    <div className="hidden md:flex items-center gap-1.5">
                        {Array.from(activeProfiles).map(p => (
                            <span key={p} className={`adaptive-badge badge-${p}`}>
                                {p === 'dyslexia' ? '📖' : p === 'adhd' ? '⚡' : '🧩'} {p}
                            </span>
                        ))}
                    </div>
                )}
                {isMonitoring && (
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Monitoring
                    </div>
                )}
                <div className="h-5 w-px bg-slate-200" />
                <button
                    onClick={() => navigate(isFacultyLoggedIn ? 'dashboard' : 'login')}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 transition px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                >
                    <ShieldCheck className="w-4 h-4" /> Faculty
                </button>
            </div>
        </header>
    );
}
