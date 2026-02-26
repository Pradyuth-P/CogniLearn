import { useState, useEffect, useRef } from 'react';
import { useApp } from '../App.jsx';

export default function GameOverlay() {
    const { setIsGameActive, notify } = useApp();
    const [orbsCaught, setOrbsCaught] = useState(0);
    const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
    const required = 3;
    const remaining = required - orbsCaught;
    const orbRef = useRef(null);

    const spawnOrb = () => {
        setOrbPos({
            x: Math.random() * (window.innerWidth - 120) + 20,
            y: Math.random() * (window.innerHeight - 120) + 20,
        });
    };

    useEffect(() => {
        spawnOrb();
    }, []);

    const handleCatch = () => {
        const next = orbsCaught + 1;
        if (next >= required) {
            setIsGameActive(false);
            notify('Focus Regained', 'Good job!', 'check-circle');
        } else {
            setOrbsCaught(next);
            spawnOrb();
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/95 z-[100] flex flex-col items-center justify-center cursor-crosshair">
            <div className="absolute top-10 text-center pointer-events-none text-white">
                <h2 className="text-3xl font-bold mb-2">Let's Refocus!</h2>
                <p className="text-indigo-200">
                    Catch{' '}
                    <span className="font-bold text-white text-2xl">{remaining}</span>{' '}
                    orbs.
                </p>
            </div>
            <div
                ref={orbRef}
                className="orb"
                style={{ left: orbPos.x, top: orbPos.y }}
                onClick={handleCatch}
            />
        </div>
    );
}
