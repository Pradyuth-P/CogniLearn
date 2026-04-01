import { useApp, SUBJECTS } from '../App.jsx';
import { BookOpen, ArrowRight, Star, Users, Clock, ChevronRight, Zap, Target, TrendingUp } from 'lucide-react';

function SubjectCard({ subject, onSelect }) {
    return (
        <div className={`subject-card subject-${subject.color} group`} onClick={() => onSelect(subject)}>
            {/* Card header with gradient */}
            <div className="h-24 flex items-center justify-center relative" style={{ background: subject.headerGradient }}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <span className="text-4xl relative z-10">{subject.icon}</span>
                <div className="absolute top-3 right-3">
                    <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {subject.lessons.length} lessons
                    </span>
                </div>
            </div>
            {/* Card body */}
            <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {subject.name}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">{subject.description}</p>
                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{subject.duration}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{subject.rating}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{subject.students}</span>
                </div>
                {/* Lesson preview */}
                <div className="space-y-1.5 mb-4">
                    {subject.lessons.slice(0, 3).map((lesson, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 shrink-0">{i + 1}</span>
                            <span className="truncate">{lesson.title}</span>
                        </div>
                    ))}
                    {subject.lessons.length > 3 && (
                        <div className="text-xs text-indigo-500 font-medium pl-6">+{subject.lessons.length - 3} more lessons</div>
                    )}
                </div>
                {/* CTA */}
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all"
                    style={{ background: subject.headerGradient, color: 'white' }}
                >
                    Start Learning <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function Onboarding() {
    const { startSession, selectLesson } = useApp();

    const handleSelectSubject = (subject) => {
        selectLesson(subject, subject.lessons[0]);
        startSession();
    };

    const handleSelectLesson = (subject, lesson) => {
        selectLesson(subject, lesson);
        startSession();
    };

    const stats = [
        { icon: <BookOpen className="w-5 h-5" />, value: '48+', label: 'Lessons', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { icon: <Target className="w-5 h-5" />, value: '8', label: 'Subjects', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { icon: <Zap className="w-5 h-5" />, value: '3', label: 'Adaptive Modes', color: 'text-amber-600', bg: 'bg-amber-50' },
        { icon: <TrendingUp className="w-5 h-5" />, value: '100%', label: 'Personalized', color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <section className="absolute inset-0 overflow-y-auto z-30 fade-enter" style={{ background: '#f8faff' }}>
            {/* ── Branded Hero Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                padding: '80px 24px 72px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle dot-grid overlay */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }} />

                {/* Logo mark */}
                <div style={{
                    width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 30, backdropFilter: 'blur(8px)',
                    position: 'relative', zIndex: 1,
                }}>
                    🧠
                </div>

                {/* App name */}
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                    fontSize: 'clamp(40px, 6vw, 72px)',
                    fontWeight: 800,
                    color: 'white',
                    margin: '0 0 12px',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    position: 'relative', zIndex: 1,
                }}>
                    CogniLearn
                </h1>

                {/* Tagline */}
                <p style={{
                    fontSize: 'clamp(16px, 2.5vw, 20px)',
                    color: 'rgba(255,255,255,0.85)',
                    margin: '0 auto 32px',
                    maxWidth: 520,
                    lineHeight: 1.65,
                    fontWeight: 400,
                    position: 'relative', zIndex: 1,
                }}>
                    Your AI-powered adaptive learning platform — designed for every kind of mind.
                    Dyslexia, ADHD, autism, and beyond.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <button
                        onClick={() => handleSelectSubject(SUBJECTS[0])}
                        style={{
                            background: 'white', color: '#4f46e5',
                            border: 'none', padding: '14px 36px',
                            fontSize: 15, fontWeight: 700,
                            borderRadius: 50, cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}
                    >
                        🚀 Start Learning
                    </button>
                    <button
                        onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            background: 'rgba(255,255,255,0.15)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '14px 32px', fontSize: 15, fontWeight: 600,
                            borderRadius: 50, cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                        }}
                    >
                        Browse Subjects ↓
                    </button>
                </div>

                {/* Feature badges row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 36, position: 'relative', zIndex: 1 }}>
                    {['🧠 Adaptive AI', '📁 Upload Any File', '🎮 Focus Game', '📊 Faculty Dashboard'].map(f => (
                        <span key={f} style={{
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.22)',
                            color: 'rgba(255,255,255,0.9)',
                            padding: '6px 14px', borderRadius: 20,
                            fontSize: 13, fontWeight: 500,
                            backdropFilter: 'blur(6px)',
                        }}>{f}</span>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{
                            background: 'white',
                            borderRadius: 16,
                            padding: '24px 16px',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                        }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                            }} className={`${s.bg} ${s.color}`}>{s.icon}</div>
                            <div style={{
                                fontSize: 28, fontWeight: 800, color: '#1e1b4b',
                                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                                lineHeight: 1,
                            }}>{s.value}</div>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginTop: 6, letterSpacing: '0.02em' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Subject Catalog */}
            <div id="catalog" className="max-w-6xl mx-auto px-6 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Subject Catalog</h2>
                        <p className="text-slate-500 text-sm mt-1">Click any subject to begin — or choose a specific lesson below</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {SUBJECTS.map((subject) => (
                        <SubjectCard key={subject.id} subject={subject} onSelect={handleSelectSubject} />
                    ))}
                </div>

                {/* Quick-access lesson rows */}
                <div className="mt-12">
                    <h3 className="text-lg font-bold text-slate-900 mb-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        🎯 Quick Start — Featured Lessons
                    </h3>
                    <div className="space-y-3">
                        {SUBJECTS.slice(0, 4).flatMap(s => s.lessons.slice(0, 2).map(l => ({ ...l, subject: s }))).map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelectLesson(item.subject, item)}
                                className="w-full flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-5 py-4 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all text-left group shadow-sm"
                            >
                                <span className="text-2xl">{item.subject.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-800 truncate">{item.title}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{item.subject.name} · {item.duration}</div>
                                </div>
                                <div className={`subject-badge subject-${item.subject.color}`}>{item.subject.name}</div>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
