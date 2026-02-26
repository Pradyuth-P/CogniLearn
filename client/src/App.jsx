import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Onboarding from './components/Onboarding.jsx';
import Module from './components/Module.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import GameOverlay from './components/GameOverlay.jsx';
import ToastContainer from './components/ToastContainer.jsx';

/* ─── Context ───────────────────────────────────── */
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

/* ─── Default article content matching original HTML ─ */
export const DEFAULT_CONTENT = `
  <p class="lead">The abyssal zone remains one of the least explored environments on Earth. Here, life has evolved in radically different directions than on the surface.</p>
  <div class="visual-sticker">
    <span class="sticker-label">Diagram: Bioluminescent Organs</span>
    <img src="https://cdn.britannica.com/32/6532-004-CDC2337C/section-Tranverse-organ-hatchetfish.jpg" alt="Bioluminescence diagram" style="width:100%; height:150px; object-fit:cover;" />
    <p style="font-size:0.75rem; padding:8px; background:#f8fafc;"><strong>Figure A:</strong> Photophores allow deep-sea life to communicate and hunt in pitch darkness.</p>
  </div>
  <p>Bioluminescence is not merely a survival mechanism; it is a complex language of light used for hunting, mating, and camouflage. Consider the <strong>Vampire Squid</strong> (<em>Vampyroteuthis infernalis</em>).</p>
  <div class="my-6 distraction interactive">
    <p>Bioluminescence is the production of light by an organism as the result of a chemiluminescence reaction. It occurs in a wide variety of organisms, including marine vertebrates and invertebrates, terrestrial arthropods such as fireflies, some fungi, and microorganisms such as some bacteria and dinoflagellates. In some animals, the light is bacteriogenic, produced by symbiotic bacteria such as those from the genus Vibrio; in others, it is autogenic, produced by the animals themselves. Bioluminescence has evolved independently at least 94 times, first emerging in octocorals some 540 million years ago.</p>
  </div>
  <p>Its filaments can detect movement in pitch-black water, a sensory adaptation that rivals advanced radar systems.</p>
`;

export default function App() {
    /* ── View Router ── */
    const [view, setView] = useState('onboarding'); // onboarding | module | login | dashboard

    /* ── Adaptive Profiles ── */
    const [activeProfiles, setActiveProfiles] = useState(new Set());
    const [isGameActive, setIsGameActive] = useState(false);
    const gamePendingRef = useRef(false);

    /* ── Session Metrics ── */
    const metricsRef = useRef({
        tabSwitches: 0, postAdhdTabSwitches: 0, emptySpaceClicks: 0,
        contentMisclicks: 0, selectionCount: 0, startTime: Date.now(),
    });
    const selectionDebounceRef = useRef(false);

    /* ── Toast system ── */
    const [toasts, setToasts] = useState([]);
    const notify = useCallback((title, msg, icon) => {
        const id = Date.now();
        setToasts(t => [...t, { id, title, msg, icon }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
    }, []);

    /* ── Module state ── */
    const [moduleTitle, setModuleTitle] = useState('Deep Sea Neural Adaptations');
    const [moduleCode, setModuleCode] = useState('BIO-101');
    const [articleHTML, setArticleHTML] = useState(DEFAULT_CONTENT);
    const [score, setScore] = useState(0);
    const [showAiQuiz, setShowAiQuiz] = useState(false);
    const [isSessionStarted, setIsSessionStarted] = useState(false);

    /* ── Activate adaptive profile ── */
    const activateProfile = useCallback((profile) => {
        setActiveProfiles(prev => {
            if (prev.has(profile)) return prev;
            const next = new Set(prev);
            next.add(profile);
            if (profile === 'adhd') { document.body.classList.add('mode-focus'); notify('Focus Mode', 'Distractions minimized.', 'zap'); }
            if (profile === 'dyslexia') { document.body.classList.add('mode-dyslexia'); notify('Reading Assist', 'Font optimized.', 'type'); }
            if (profile === 'autism') { document.body.classList.add('mode-autism'); notify('Sensory Mode', 'Color softened.', 'smile'); }
            return next;
        });
    }, [notify]);

    /* ── Trigger orb game ── */
    const triggerGame = useCallback(() => {
        if (gamePendingRef.current || isGameActive) return;
        gamePendingRef.current = true;
        const onVisible = () => {
            if (!document.hidden) {
                gamePendingRef.current = false;
                setIsGameActive(true);
                document.removeEventListener('visibilitychange', onVisible);
            }
        };
        document.addEventListener('visibilitychange', onVisible);
    }, [isGameActive]);

    /* ── Reset session state ── */
    const resetSession = useCallback(() => {
        metricsRef.current = { tabSwitches: 0, postAdhdTabSwitches: 0, emptySpaceClicks: 0, contentMisclicks: 0, selectionCount: 0, startTime: Date.now() };
        setActiveProfiles(new Set());
        document.body.classList.remove('mode-dyslexia', 'mode-focus', 'mode-autism');
        setArticleHTML(DEFAULT_CONTENT);
        setModuleTitle('Deep Sea Neural Adaptations');
        setModuleCode('BIO-101');
        setScore(0);
        setShowAiQuiz(false);
        setIsSessionStarted(false);
    }, []);

    /* ── Navigate ── */
    const navigate = useCallback((v) => {
        setView(v);
        if (v === 'onboarding') resetSession();
    }, [resetSession]);

    /* ── Start session ── */
    const startSession = useCallback(() => {
        navigate('module');
        metricsRef.current.startTime = Date.now();
        setIsSessionStarted(true);
    }, [navigate]);

    /* ── Finish & save session ── */
    const finishSession = useCallback(async () => {
        const m = metricsRef.current;
        const timeSpent = Math.floor((Date.now() - m.startTime) / 1000);
        const profileArr = Array.from(activeProfiles);
        const activeMode = profileArr[0] ? profileArr[0].charAt(0).toUpperCase() + profileArr[0].slice(1) : 'Neurotypical';

        let triggerDesc = 'None';
        if (m.tabSwitches > 2) triggerDesc = `${m.tabSwitches} Tab Switches`;
        if (m.contentMisclicks + m.emptySpaceClicks > 3) triggerDesc = `${m.contentMisclicks + m.emptySpaceClicks} Misclicks`;

        const payload = {
            studentId: 'S-' + Math.floor(1000 + Math.random() * 9000),
            mode: activeMode,
            triggers: triggerDesc,
            timeSpent: Math.floor(timeSpent / 60) + 'm ' + (timeSpent % 60) + 's',
            score,
        };

        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) notify('Database Sync', 'Session saved to MongoDB!', 'database');
            else notify('Warning', 'Saved locally only.', 'alert-triangle');
        } catch {
            notify('Offline Mode', 'Could not reach server.', 'wifi-off');
        }

        alert('Session Saved!');
        resetSession();
        navigate('onboarding');
    }, [activeProfiles, score, notify, resetSession, navigate]);

    /* ── Behavioral listeners (only active during module view) ── */
    useEffect(() => {
        if (!isSessionStarted) return;

        const handleClick = (e) => {
            if (isGameActive) return;
            if (e.target.closest('button, a, input, .interactive')) return;
            const tag = e.target.tagName;
            if (['SECTION', 'MAIN', 'BODY', 'DIV'].includes(tag)) {
                metricsRef.current.emptySpaceClicks++;
                if (metricsRef.current.emptySpaceClicks >= 2) activateProfile('autism');
            }
            if (['P', 'H1', 'H2', 'H3', 'H4', 'ARTICLE', 'LI', 'SPAN'].includes(tag)) {
                metricsRef.current.contentMisclicks++;
                if (metricsRef.current.contentMisclicks >= 3) activateProfile('dyslexia');
            }
        };

        const handleSelection = () => {
            if (document.getSelection().toString().length > 5) {
                if (!selectionDebounceRef.current) {
                    metricsRef.current.selectionCount++;
                    selectionDebounceRef.current = true;
                    setTimeout(() => { selectionDebounceRef.current = false; }, 1000);
                    if (metricsRef.current.selectionCount >= 3) activateProfile('dyslexia');
                }
            }
        };

        const handleVisibility = () => {
            if (document.hidden) {
                metricsRef.current.tabSwitches++;
                if (activeProfiles.has('adhd')) {
                    metricsRef.current.postAdhdTabSwitches++;
                    if (metricsRef.current.postAdhdTabSwitches >= 2) triggerGame();
                } else if (metricsRef.current.tabSwitches >= 2) {
                    activateProfile('adhd');
                }
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('selectionchange', handleSelection);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('selectionchange', handleSelection);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [isSessionStarted, isGameActive, activeProfiles, activateProfile, triggerGame]);

    /* ── Context value ── */
    const ctx = {
        view, navigate, activeProfiles, isGameActive, setIsGameActive,
        notify, moduleTitle, setModuleTitle, moduleCode, setModuleCode,
        articleHTML, setArticleHTML, score, setScore,
        showAiQuiz, setShowAiQuiz, startSession, finishSession, resetSession,
    };

    return (
        <AppContext.Provider value={ctx}>
            <div className="h-screen flex flex-col overflow-hidden text-slate-800">
                <Header />
                <main id="app-container" className="flex-1 relative overflow-hidden bg-slate-50">
                    {view === 'onboarding' && <Onboarding />}
                    {view === 'module' && <Module />}
                    {view === 'login' && <Login />}
                    {view === 'dashboard' && <Dashboard />}
                    {isGameActive && <GameOverlay />}
                </main>
                <ToastContainer toasts={toasts} />
            </div>
        </AppContext.Provider>
    );
}
