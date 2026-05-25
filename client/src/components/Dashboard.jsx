import { useEffect, useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useApp, API_BASE } from '../App.jsx';

export default function Dashboard() {
    const { navigate, setIsFacultyLoggedIn } = useApp();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/sessions`);
                if (!res.ok) throw new Error('Bad response');
                const data = await res.json();
                setSessions(data);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    return (
        <section className="absolute inset-0 bg-slate-50 flex flex-col z-40">
            <header className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-md">
                <h2 className="font-bold text-xl flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5" /> Student Monitoring Dashboard
                </h2>
                <button
                    onClick={() => {
                        setIsFacultyLoggedIn(false);
                        navigate('onboarding');
                    }}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition"
                >
                    Logout
                </button>
            </header>

            <div className="p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700 flex justify-between">
                        <span>Recent Learning Sessions</span>
                        <span className="text-xs text-slate-500 font-normal">Real-time Data</span>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Student ID</th>
                                <th className="px-6 py-3 font-semibold">Active Mode</th>
                                <th className="px-6 py-3 font-semibold">Triggers Detected</th>
                                <th className="px-6 py-3 font-semibold">Time Spent</th>
                                <th className="px-6 py-3 font-semibold">Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-100">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-slate-400">
                                        Fetching data from MongoDB...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-red-500 font-bold">
                                        Failed to connect to Backend Server.
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && sessions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-slate-500">
                                        No sessions found in database.
                                    </td>
                                </tr>
                            )}
                            {sessions.map((row) => (
                                <tr key={row._id} className="hover:bg-slate-50 transition border-b border-slate-100">
                                    <td className="px-6 py-4 font-medium text-slate-900">{row.studentId}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-50 text-indigo-600">
                                            {row.mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{row.triggers}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.timeSpent}</td>
                                    <td className="px-6 py-4 font-bold text-green-600">{row.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
