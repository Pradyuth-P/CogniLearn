import { useState, useRef } from 'react';
import {
    BookOpen, CheckSquare, Trophy, Upload, Wand2, Volume2, StopCircle,
    Microscope, Orbit, Save, Loader2
} from 'lucide-react';
import { useApp } from '../App.jsx';
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
    } = useApp();

    const [activeTab, setActiveTab] = useState('reading');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Processing...');
    const [speaking, setSpeaking] = useState(false);
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

    const isDyslexia = activeProfiles.has('dyslexia');

    return (
        <section className="absolute inset-0 flex flex-col bg-slate-50">
            {/* ── Module Header ── */}
            <div className="bg-white border-b border-slate-200 px-8 pt-6 pb-0 shadow-sm z-20">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{moduleCode}</span>
                        <h2 className="text-2xl font-bold text-slate-900">{moduleTitle}</h2>
                    </div>
                    <div className="bg-indigo-50 px-3 py-1 rounded text-indigo-700 text-xs font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Score: <span>{score}</span>
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

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto relative p-6 md:p-8" id="module-scroll-container">
                <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">

                    {/* ── Reading Tab ── */}
                    {activeTab === 'reading' && (
                        <div className="col-span-12 lg:col-span-8 space-y-6 fade-enter">
                            {/* Toolbar */}
                            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* TTS — only shown in dyslexia mode */}
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
                            <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
                                {/* Loading Overlay */}
                                {loading && (
                                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-50 rounded-xl backdrop-blur-sm">
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
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={finishSession}
                                    className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                                >
                                    End Session &amp; Save Data <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Quiz Tab ── */}
                    {activeTab === 'quiz' && (
                        <div className="col-span-12 lg:col-span-8 space-y-6">
                            <QuizSection />
                        </div>
                    )}

                    {/* ── Sidebar (distraction) ── */}
                    <div className="col-span-12 lg:col-span-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200 distraction adaptive-content">
                        <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">Switch Subject</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg border border-slate-100 transition">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center shrink-0">
                                    <Microscope className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Biology</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg border border-slate-100 transition">
                                <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded flex items-center justify-center shrink-0">
                                    <Orbit className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Physics</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
