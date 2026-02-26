import { BrainCircuit, ShieldCheck } from 'lucide-react';
import { useApp } from '../App.jsx';

export default function Header() {
    const { view, navigate, activeProfiles } = useApp();
    const isMonitoring = view === 'module';

    return (
        <header className="bg-white/80 backdrop-blur border-b border-slate-200 h-16 flex justify-between items-center px-6 z-50">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                    <BrainCircuit className="w-5 h-5" />
                </div>
                <h1 className="font-bold text-lg tracking-tight text-slate-800">
                    CogniLearn<span className="text-xs font-normal text-slate-400 ml-1">v3.5</span>
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {isMonitoring && (
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        Monitoring Behavior
                        {activeProfiles.size > 0 && (
                            <span className="ml-1 bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                                {Array.from(activeProfiles).join(' + ')}
                            </span>
                        )}
                    </div>
                )}

                <div className="h-6 w-px bg-slate-200 mx-2" />

                <button
                    onClick={() => navigate('login')}
                    className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition flex items-center gap-2"
                >
                    <ShieldCheck className="w-4 h-4" /> Faculty Portal
                </button>
            </div>
        </header>
    );
}
