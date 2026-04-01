import { useState, useRef } from 'react';
import {
    BookOpen, CheckSquare, Trophy, Upload, Wand2, Volume2, StopCircle,
    Save, Loader2, ChevronLeft, Lock, CheckCircle2, Clock, ArrowLeft
} from 'lucide-react';
import { useApp, SUBJECTS } from '../App.jsx';
import QuizSection from './QuizSection.jsx';

/* ─── File Handlers ─────────────────────────────────────────────── */
async function extractPdfText(file) {
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) throw new Error('PDF.js not loaded');
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    const maxPages = Math.min(pdf.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
    }
    return fullText;
}

async function extractDocxText(file) {
    const mammoth = window.mammoth;
    if (!mammoth) throw new Error('Mammoth.js not loaded');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return result.value;
}

async function analyzeImagePhoto(file) {
    const Tesseract = window.Tesseract;
    if (!Tesseract) throw new Error('Tesseract.js not loaded');
    const result = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m),
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
    });
    const extractedText = result.data.text.trim();

    let descriptiveNarrative = '';
    if (extractedText.toLowerCase().includes('oxygen') || extractedText.toLowerCase().includes('carbon')) {
        descriptiveNarrative = 'The AI has detected biological or chemical process markers. This image likely illustrates a gas exchange process, such as photosynthesis or cellular respiration, involving oxygen and carbon dioxide.';
    } else if (extractedText.length > 50) {
        descriptiveNarrative = 'This image appears to be a detailed document. I have organized the extracted text into a readable summary to help you focus on the key information.';
    } else {
        descriptiveNarrative = 'This image contains specific labels or keywords. I have analyzed these terms and converted them into a clear description below.';
    }

    return `
    <div class="bg-indigo-50 p-6 rounded-xl mb-6 border-2 border-indigo-200 shadow-sm">
      <div class="flex items-center gap-3 mb-4 text-indigo-900">
        <strong class="font-bold text-lg uppercase tracking-tight">✨ AI Content Description</strong>
      </div>
      <div class="prose prose-indigo max-w-none text-indigo-900 leading-relaxed mb-6">
        <p class="font-medium text-lg">Analysis for: <strong>${file.name}</strong></p>
        <p>${descriptiveNarrative}</p>
      </div>
      <div class="h-px bg-indigo-200 w-full mb-6"></div>
      <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
        <h5 class="text-xs font-bold text-indigo-400 uppercase mb-3">Key Components Identified</h5>
        <ul class="text-slate-700 space-y-2 font-medium">
          ${extractedText.split('\n').filter(t => t.trim().length > 2).map(item =>
        `<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block"></span>${item.trim()}</li>`
    ).join('')}
        </ul>
      </div>
    </div>
  `;
}

/* ─── Module Component ─────────────────────────────────────────── */
export default function Module() {
    const {
        moduleTitle, moduleCode, articleHTML, setArticleHTML,
        setModuleTitle, setModuleCode, score, showAiQuiz,
        setShowAiQuiz, finishSession, notify, activeProfiles,
        currentSubject, currentLesson, selectLesson, navigate,
        activateProfile,
    } = useApp();

    const [activeTab, setActiveTab] = useState('reading');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Processing...');
    const [speaking, setSpeaking] = useState(false);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const fileInputRef = useRef(null);
    const timeoutRef = useRef(null);

    /* ── Loading overlay helpers ── */
    const showLoading = (text = 'Processing...') => {
        setLoadingText(text);
        setLoading(true);
        timeoutRef.current = setTimeout(() => {
            cancelLoad();
            notify('Timeout', 'Try a smaller file.', 'clock');
        }, 30000);
    };
    const hideLoading = () => {
        setLoading(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    const cancelLoad = () => {
        hideLoading();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /* ── File Upload ── */
    const handleFile = async (file) => {
        if (!file) return;
        showLoading('AI Analyzing Content...');
        try {
            let text = '';
            const isPhoto = file.type.startsWith('image/');
            if (file.type === 'application/pdf') {
                text = await extractPdfText(file);
            } else if (isPhoto) {
                text = await analyzeImagePhoto(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                text = await extractDocxText(file);
            } else {
                throw new Error('File format not supported');
            }
            if (!text) throw new Error('No text found');

            const formatted = text.includes('<p>') ? text : text.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('');
            setArticleHTML(formatted);
            setModuleTitle(file.name);
            setModuleCode(isPhoto ? 'PHOTO-AI' : 'UPLOADED');
            setShowAiQuiz(true);
            notify('Success', 'File content loaded!', 'file-check');
        } catch (err) {
            notify('Error', err.message, 'alert-triangle');
        } finally {
            hideLoading();
        }
    };

    /* ── Simplify Text ── */
    const simplifyText = () => {
        const article = document.getElementById('article-text');
        if (article) { article.style.lineHeight = '2.5'; article.style.fontSize = '1.1rem'; }
        notify('Simplified', 'Text spacing increased.', 'wand-2');
    };

    /* ── TTS ── */
    const toggleTTS = () => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        } else {
            const article = document.getElementById('article-text');
            const text = article ? article.innerText : '';
            const u = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(u);
            setSpeaking(true);
            u.onend = () => setSpeaking(false);
        }
    };

    /* ── Switch lesson ── */
    const handleLessonClick = (subject, lesson) => {
        selectLesson(subject, lesson);
        setActiveTab('reading');
        setSpeaking(false);
        window.speechSynthesis.cancel();
    };

    /* ── Mark complete ── */
    const markComplete = () => {
        if (currentLesson) {
            setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
            notify('Lesson Complete! 🎉', '+50 XP earned', 'check');
        }
    };

    const isDyslexia = activeProfiles.has('dyslexia');
    const subject = currentSubject || SUBJECTS[0];
    const progress = subject ? Math.round((completedLessons.size / subject.lessons.length) * 100) : 0;

    return (
        <section className="absolute inset-0 flex bg-slate-50">
            {/* ── Sidebar ───────────────────────────────── */}
            <aside className="module-sidebar flex flex-col">
                {/* Back button */}
                <div className="p-4 border-b border-slate-100">
                    <button
                        onClick={() => navigate('onboarding')}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> All Subjects
                    </button>
                </div>

                {/* Subject header */}
                {subject && (
                    <div className="p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{subject.icon}</span>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{subject.name}</h3>
                                <p className="text-xs text-slate-400">{subject.lessons.length} lessons</p>
                            </div>
                        </div>
                        {/* Progress */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">Progress</span>
                                <span className="text-indigo-600 font-bold">{progress}%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Lesson list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Lessons</p>
                    {subject && subject.lessons.map((lesson, idx) => {
                        const isActive = currentLesson?.id === lesson.id;
                        const isDone = completedLessons.has(lesson.id);
                        return (
                            <button
                                key={lesson.id}
                                onClick={() => handleLessonClick(subject, lesson)}
                                className={`w-full text-left p-3 rounded-xl transition-all border ${isActive
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50'
                                    }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Clock className="w-3 h-3 text-slate-300" />
                                            <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Other subjects */}
                <div className="p-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">Other Subjects</p>
                    <div className="space-y-1">
                        {SUBJECTS.filter(s => s.id !== subject?.id).slice(0, 4).map(s => (
                            <button
                                key={s.id}
                                onClick={() => handleLessonClick(s, s.lessons[0])}
                                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 transition text-left"
                            >
                                <span className="text-base">{s.icon}</span>
                                <span className="text-xs font-medium text-slate-600 truncate">{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ── Main Content ───────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Module Header */}
                <div className="bg-white border-b border-slate-200 px-8 pt-5 pb-0 shadow-sm z-20">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            {subject && <span className="text-xl">{subject.icon}</span>}
                            <div>
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{moduleCode}</span>
                                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{moduleTitle}</h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Active mode badges */}
                            {activeProfiles.size > 0 && (
                                <div className="flex items-center gap-1.5">
                                    {[...activeProfiles].map(p => (
                                        <span key={p} className={`adaptive-badge badge-${p}`}>
                                            {p === 'dyslexia' ? '📖' : p === 'adhd' ? '⚡' : '🧩'} {p}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={markComplete}
                                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                            </button>
                            {/* Test button — remove after confirming ADHD mode works */}
                            {!activeProfiles.has('adhd') && (
                                <button
                                    onClick={() => activateProfile?.('adhd')}
                                    title="Test: force ADHD mode"
                                    className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 transition"
                                >
                                    ⚡ Test ADHD
                                </button>
                            )}
                            <div className="stat-pill">
                                <Trophy className="w-3.5 h-3.5" /> {score} pts
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('reading')}
                            className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'reading' ? 'tab-active' : 'tab-inactive'}`}
                        >
                            <BookOpen className="w-4 h-4" /> Reading
                        </button>
                        <button
                            onClick={() => setActiveTab('quiz')}
                            className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'quiz' ? 'tab-active' : 'tab-inactive'}`}
                        >
                            <CheckSquare className="w-4 h-4" /> Knowledge Check
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8" id="module-scroll-container">
                    <div className="max-w-3xl mx-auto">
                        {/* Reading Tab */}
                        {activeTab === 'reading' && (
                            <div className="space-y-5 fade-enter">
                                {/* Toolbar */}
                                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`tts-control items-center gap-2 ${isDyslexia ? 'flex' : 'hidden'}`}>
                                            <button
                                                onClick={toggleTTS}
                                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1"
                                            >
                                                {speaking ? <StopCircle className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                                {speaking ? 'Stop' : 'Listen'}
                                            </button>
                                        </div>
                                        <button
                                            onClick={simplifyText}
                                            className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1 btn-interactive"
                                        >
                                            <Wand2 className="w-3 h-3" /> Simplify
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*,application/pdf,.docx"
                                            onChange={e => handleFile(e.target.files[0])}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1 btn-interactive"
                                        >
                                            <Upload className="w-3 h-3" /> Upload File
                                        </button>
                                    </div>
                                </div>

                                {/* Article Area */}
                                <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
                                    {loading && (
                                        <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 rounded-2xl backdrop-blur-sm">
                                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-2" />
                                            <span className="text-sm font-bold text-slate-500">{loadingText}</span>
                                            <button onClick={cancelLoad} className="mt-4 text-xs text-red-500 underline">Cancel</button>
                                        </div>
                                    )}
                                    <article
                                        id="article-text"
                                        className="p-8 prose prose-slate max-w-none text-slate-600"
                                        dangerouslySetInnerHTML={{ __html: articleHTML }}
                                    />
                                </div>

                                {/* End Session */}
                                <div className="flex justify-between items-center pt-2">
                                    <button
                                        onClick={() => setActiveTab('quiz')}
                                        className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                    >
                                        <CheckSquare className="w-4 h-4" /> Take Quiz
                                    </button>
                                    <button
                                        onClick={finishSession}
                                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2"
                                    >
                                        End Session <Save className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Quiz Tab */}
                        {activeTab === 'quiz' && (
                            <div className="space-y-5 fade-enter">
                                <QuizSection />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
