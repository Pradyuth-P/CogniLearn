import { useMemo } from 'react';
import {
    Zap, Type, Smile, CheckCircle, WifiOff, Database, AlertTriangle,
    Check, X, Sparkles, FileCheck, Clock
} from 'lucide-react';

const ICON_MAP = {
    zap: Zap, type: Type, smile: Smile, 'check-circle': CheckCircle,
    'wifi-off': WifiOff, database: Database, 'alert-triangle': AlertTriangle,
    check: Check, x: X, sparkles: Sparkles, 'file-check': FileCheck, clock: Clock,
};

function Toast({ toast }) {
    const Icon = ICON_MAP[toast.icon] || Zap;
    return (
        <div className="bg-slate-900 text-white p-4 rounded-lg shadow-xl flex gap-3 w-80 pointer-events-auto">
            <Icon className="text-indigo-400 w-5 h-5 shrink-0 mt-0.5" />
            <div>
                <h4 className="font-bold text-sm">{toast.title}</h4>
                <p className="text-xs text-slate-300">{toast.msg}</p>
            </div>
        </div>
    );
}

export default function ToastContainer({ toasts }) {
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[60] pointer-events-none">
            {toasts.map(t => <Toast key={t.id} toast={t} />)}
        </div>
    );
}
