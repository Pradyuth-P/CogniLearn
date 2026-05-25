import { useState } from 'react';
import { ShieldIcon } from 'lucide-react';
import { useApp } from '../App.jsx';

export default function Login() {
    const { navigate, setIsFacultyLoggedIn } = useApp();
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const trimmedUser = user.trim().toLowerCase();
        const trimmedPass = pass.trim();
        console.log("Attempting login with:", { user: trimmedUser, pass: trimmedPass });
        if (trimmedUser === 'abc' && trimmedPass === '123') {
            setIsFacultyLoggedIn(true);
            navigate('dashboard');
        } else {
            alert(`Invalid Credentials\n\nReceived details:\nFaculty ID: "${trimmedUser}"\nPassword: "${trimmedPass}"`);
        }
    };

    return (
        <section className="absolute inset-0 flex items-center justify-center bg-slate-100 z-40">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="text-center mb-6">
                    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                        <ShieldIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Faculty Portal</h2>
                    <p className="text-sm text-slate-500">Only authorized faculty members.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Faculty ID</label>
                        <input
                            type="text"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                            placeholder="FACULTY"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                        <input
                            type="password"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg hover:bg-slate-800 transition">
                        Secure Login
                    </button>
                </form>
                <button
                    onClick={() => navigate('onboarding')}
                    className="w-full mt-4 text-sm text-slate-500 hover:text-slate-800"
                >
                    Back to Student View
                </button>
            </div>
        </section>
    );
}
