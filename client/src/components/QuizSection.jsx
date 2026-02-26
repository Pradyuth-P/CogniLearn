import { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { useApp } from '../App.jsx';

export default function QuizSection() {
    const { score, setScore, notify, showAiQuiz } = useApp();
    const [aiQuizGenerated, setAiQuizGenerated] = useState(false);
    const [generating, setGenerating] = useState(false);

    const check = (btn, isCorrect) => {
        // Prevent double-clicking
        if (btn.disabled) return;
        btn.disabled = true;
        const parentBtns = btn.closest('.quiz-item').querySelectorAll('.quiz-btn');
        parentBtns.forEach(b => { b.disabled = true; });

        if (isCorrect) {
            btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
            setScore(s => {
                const next = s + 10;
                notify('Correct!', '+10 Points', 'check');
                return next;
            });
        } else {
            btn.classList.add('bg-red-50', 'border-red-300', 'text-red-700');
            notify('Try Again', 'Incorrect', 'x');
        }
    };

    const generateQuiz = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 2000));
        setAiQuizGenerated(true);
        setGenerating(false);
        notify('Quiz Ready', 'AI questions generated.', 'sparkles');
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            {/* Static Quiz */}
            {!showAiQuiz && (
                <div id="static-quiz-wrapper">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-xl font-bold text-slate-800">Module Quiz</h3>
                        <span className="text-sm text-slate-400">Standard Questions</span>
                    </div>
                    <div className="space-y-8">
                        <div className="quiz-item">
                            <p className="font-medium text-slate-800 mb-3">1. What is the primary diet of the Vampire Squid?</p>
                            <div className="space-y-2">
                                <button onClick={e => check(e.currentTarget, false)} className="quiz-btn w-full text-left px-4 py-3 rounded border border-slate-200 hover:bg-slate-50 transition text-sm">Small fish</button>
                                <button onClick={e => check(e.currentTarget, true)} className="quiz-btn w-full text-left px-4 py-3 rounded border border-slate-200 hover:bg-slate-50 transition text-sm">Marine snow (detritus)</button>
                            </div>
                        </div>
                        <div className="quiz-item">
                            <p className="font-medium text-slate-800 mb-3">2. How is bioluminescence used?</p>
                            <div className="space-y-2">
                                <button onClick={e => check(e.currentTarget, true)} className="quiz-btn w-full text-left px-4 py-3 rounded border border-slate-200 hover:bg-slate-50 transition text-sm">Hunting, mating, and camouflage</button>
                                <button onClick={e => check(e.currentTarget, false)} className="quiz-btn w-full text-left px-4 py-3 rounded border border-slate-200 hover:bg-slate-50 transition text-sm">Generating heat</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Quiz Section — shown after file upload */}
            {showAiQuiz && (
                <div className="border-t border-slate-100 pt-8">
                    {!aiQuizGenerated ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="bg-indigo-50 p-3 rounded-full mb-3 text-indigo-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-slate-800">New Content Loaded</h4>
                            <p className="text-sm text-slate-500 mb-4 max-w-md">Generate a new quiz based on your uploaded file.</p>
                            <button
                                onClick={generateQuiz}
                                disabled={generating}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-60"
                            >
                                <Sparkles className="w-4 h-4" />
                                {generating ? 'Analyzing Content...' : 'Generate AI Quiz'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-800">AI-Generated Quiz</h3>
                                <button
                                    onClick={() => { setAiQuizGenerated(false); generateQuiz(); }}
                                    className="text-xs text-indigo-500 border border-indigo-200 px-3 py-1 rounded hover:bg-indigo-50 transition"
                                >
                                    Regenerate
                                </button>
                            </div>
                            <div className="quiz-item bg-slate-50 p-4 rounded-lg">
                                <p className="font-medium text-slate-800 mb-3">AI-1. What is the central concept discussed in the provided file?</p>
                                <div className="space-y-2">
                                    <button onClick={e => check(e.currentTarget, true)} className="quiz-btn w-full text-left px-4 py-3 rounded bg-white border border-slate-200 text-sm">Main Framework</button>
                                    <button onClick={e => check(e.currentTarget, false)} className="quiz-btn w-full text-left px-4 py-3 rounded bg-white border border-slate-200 text-sm">Minor Supporting Data</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
