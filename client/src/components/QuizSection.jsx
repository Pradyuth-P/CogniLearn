import { useState } from 'react';
import { Sparkles, FileText, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '../App.jsx';

/* ─── Quiz questions per subject ─────────────────────────────── */
const SUBJECT_QUIZZES = {
    biology: [
        {
            q: 'What is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
            correct: 1,
        },
        {
            q: 'Which process do plants use to convert sunlight into energy?',
            options: ['Respiration', 'Fermentation', 'Photosynthesis', 'Transpiration'],
            correct: 2,
        },
        {
            q: 'What molecule carries genetic information in cells?',
            options: ['RNA', 'ATP', 'DNA', 'Protein'],
            correct: 2,
        },
        {
            q: 'How is bioluminescence primarily used by deep-sea creatures?',
            options: ['Generating heat', 'Hunting, mating, and camouflage', 'Digesting food', 'Producing oxygen'],
            correct: 1,
        },
    ],
    physics: [
        {
            q: "What is Newton's Second Law of Motion?",
            options: ['Every action has an equal and opposite reaction', 'F = ma', 'Objects at rest stay at rest', 'Energy cannot be created or destroyed'],
            correct: 1,
        },
        {
            q: 'What is the speed of light in a vacuum?',
            options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
            correct: 1,
        },
        {
            q: 'Which type of wave does not require a medium to travel?',
            options: ['Sound waves', 'Water waves', 'Electromagnetic waves', 'Seismic waves'],
            correct: 2,
        },
        {
            q: 'What is the SI unit of electric current?',
            options: ['Volt', 'Watt', 'Ohm', 'Ampere'],
            correct: 3,
        },
    ],
    math: [
        {
            q: 'What is the derivative of sin(x)?',
            options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'],
            correct: 1,
        },
        {
            q: 'What is the value of π (pi) to two decimal places?',
            options: ['3.41', '3.14', '3.12', '3.16'],
            correct: 1,
        },
        {
            q: 'Which theorem states a² + b² = c² for right triangles?',
            options: ['Euclid\'s theorem', 'Thales\' theorem', 'Pythagorean theorem', 'Fermat\'s theorem'],
            correct: 2,
        },
        {
            q: 'What is the integral of 1/x dx?',
            options: ['x', 'ln|x| + C', '1/x² + C', 'e^x + C'],
            correct: 1,
        },
    ],
    history: [
        {
            q: 'In which year did World War II end?',
            options: ['1943', '1944', '1945', '1946'],
            correct: 2,
        },
        {
            q: 'Who was the first U.S. President?',
            options: ['Thomas Jefferson', 'John Adams', 'Abraham Lincoln', 'George Washington'],
            correct: 3,
        },
        {
            q: 'The Renaissance originated in which country?',
            options: ['France', 'Italy', 'Greece', 'Spain'],
            correct: 1,
        },
        {
            q: 'Which ancient wonder was located in Alexandria, Egypt?',
            options: ['The Colosseum', 'The Lighthouse', 'The Parthenon', 'The Pantheon'],
            correct: 1,
        },
    ],
    english: [
        {
            q: 'Who wrote "Romeo and Juliet"?',
            options: ['Charles Dickens', 'Jane Austen', 'William Shakespeare', 'Oscar Wilde'],
            correct: 2,
        },
        {
            q: 'What is a metaphor?',
            options: ['A direct comparison using "like" or "as"', 'A figure of speech that directly states one thing is another', 'Repetition of consonant sounds', 'Exaggeration for effect'],
            correct: 1,
        },
        {
            q: 'Which literary device describes assigning human qualities to non-human things?',
            options: ['Alliteration', 'Simile', 'Personification', 'Foreshadowing'],
            correct: 2,
        },
        {
            q: 'What is the main theme of George Orwell\'s "1984"?',
            options: ['Love and loss', 'Totalitarianism and surveillance', 'Environmental destruction', 'Space exploration'],
            correct: 1,
        },
    ],
    cs: [
        {
            q: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High-Level Text Machine Language', 'Hyperlink Text Manipulation Language', 'Home Tool Markup Language'],
            correct: 0,
        },
        {
            q: 'Which data structure uses LIFO order?',
            options: ['Queue', 'Stack', 'Linked List', 'Array'],
            correct: 1,
        },
        {
            q: 'What is the time complexity of Binary Search?',
            options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
            correct: 2,
        },
        {
            q: 'What does CSS stand for?',
            options: ['Computer Style Sheet', 'Cascading Style Sheet', 'Creative Style System', 'Color Style Sheet'],
            correct: 1,
        },
    ],
    geography: [
        {
            q: 'What is the longest river in the world?',
            options: ['Amazon', 'Mississippi', 'Yangtze', 'Nile'],
            correct: 3,
        },
        {
            q: 'Which continent has the most countries?',
            options: ['Asia', 'Europe', 'Africa', 'South America'],
            correct: 2,
        },
        {
            q: 'What is the capital of Australia?',
            options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
            correct: 2,
        },
        {
            q: 'Which ocean is the largest?',
            options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
            correct: 3,
        },
    ],
    science: [
        {
            q: 'What is the atomic number of Carbon?',
            options: ['4', '6', '8', '12'],
            correct: 1,
        },
        {
            q: 'What is the chemical symbol for Gold?',
            options: ['Go', 'Gd', 'Au', 'Ag'],
            correct: 2,
        },
        {
            q: 'What planet is known as the Red Planet?',
            options: ['Venus', 'Jupiter', 'Saturn', 'Mars'],
            correct: 3,
        },
        {
            q: 'What force keeps planets in orbit around the sun?',
            options: ['Magnetism', 'Gravity', 'Friction', 'Nuclear force'],
            correct: 1,
        },
    ],
};

export default function QuizSection() {
    const { score, setScore, notify, showAiQuiz, currentSubject } = useApp();
    const [answers, setAnswers] = useState({});
    const [aiQuizGenerated, setAiQuizGenerated] = useState(false);
    const [generating, setGenerating] = useState(false);

    const subjectId = currentSubject?.id || 'biology';
    const questions = SUBJECT_QUIZZES[subjectId] || SUBJECT_QUIZZES.biology;

    const handleAnswer = (qIdx, optIdx) => {
        if (answers[qIdx] !== undefined) return; // Already answered
        const isCorrect = questions[qIdx].correct === optIdx;
        setAnswers(prev => ({ ...prev, [qIdx]: { chosen: optIdx, correct: isCorrect } }));
        if (isCorrect) {
            setScore(s => {
                const next = s + 10;
                notify('Correct! ✅', '+10 Points', 'check');
                return next;
            });
        } else {
            notify('Not quite 🤔', 'Try another question!', 'x');
        }
    };

    const generateQuiz = async () => {
        setGenerating(true);
        await new Promise(r => setTimeout(r, 1800));
        setAiQuizGenerated(true);
        setGenerating(false);
        notify('Quiz Ready! 🎉', 'AI questions generated.', 'sparkles');
    };

    const answeredCount = Object.keys(answers).length;
    const correctCount = Object.values(answers).filter(a => a.correct).length;
    const allDone = answeredCount === questions.length;

    return (
        <div className="space-y-6">
            {/* Score summary if all answered */}
            {allDone && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 text-center fade-enter">
                    <Trophy className="w-10 h-10 mx-auto mb-3 opacity-90" />
                    <div className="text-3xl font-bold mb-1">{correctCount}/{questions.length}</div>
                    <div className="text-sm opacity-80">
                        {correctCount === questions.length ? '🎉 Perfect Score! Brilliant!' : correctCount >= questions.length / 2 ? '👍 Great job! Keep practicing.' : '💪 Keep going! Review the lesson and try again.'}
                    </div>
                </div>
            )}

            {/* Static subject quiz */}
            {!showAiQuiz && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {currentSubject?.name || 'Module'} Quiz
                            </h3>
                            <p className="text-sm text-slate-400 mt-0.5">{questions.length} questions · 10 points each</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="font-semibold text-indigo-600">{answeredCount}</span>/{questions.length} answered
                        </div>
                    </div>
                    <div className="space-y-8">
                        {questions.map((question, qIdx) => {
                            const answer = answers[qIdx];
                            return (
                                <div key={qIdx} className="quiz-item">
                                    <p className="font-semibold text-slate-800 mb-3 flex items-start gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{qIdx + 1}</span>
                                        {question.q}
                                    </p>
                                    <div className="space-y-2.5 pl-8">
                                        {question.options.map((opt, optIdx) => {
                                            let btnClass = 'quiz-btn';
                                            if (answer !== undefined) {
                                                if (optIdx === question.correct) btnClass += ' correct';
                                                else if (optIdx === answer.chosen && !answer.correct) btnClass += ' incorrect';
                                            }
                                            return (
                                                <button
                                                    key={optIdx}
                                                    className={btnClass}
                                                    onClick={() => handleAnswer(qIdx, optIdx)}
                                                    disabled={answer !== undefined}
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className="w-5 h-5 rounded-full border-2 border-current opacity-40 flex items-center justify-center shrink-0 text-[10px] font-bold">
                                                            {String.fromCharCode(65 + optIdx)}
                                                        </span>
                                                        {opt}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* AI Quiz Section — shown after file upload */}
            {showAiQuiz && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    {!aiQuizGenerated ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-indigo-500" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-lg mb-2">New Content Detected</h4>
                            <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
                                Your file has been analyzed. Generate a custom quiz based on the content you uploaded.
                            </p>
                            <button
                                onClick={generateQuiz}
                                disabled={generating}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-60 shadow-sm"
                            >
                                <Sparkles className="w-4 h-4" />
                                {generating ? 'Analyzing Content...' : 'Generate AI Quiz'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-800">AI-Generated Quiz</h3>
                                <button
                                    onClick={() => { setAiQuizGenerated(false); generateQuiz(); }}
                                    className="text-xs text-indigo-500 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition font-semibold"
                                >
                                    Regenerate
                                </button>
                            </div>
                            <div className="quiz-item bg-slate-50 p-5 rounded-xl">
                                <p className="font-semibold text-slate-800 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold inline-flex items-center justify-center mr-2">1</span>
                                    What is the central concept discussed in the provided file?
                                </p>
                                <div className="space-y-2.5 pl-8">
                                    <button onClick={e => { e.currentTarget.classList.add('correct'); }} className="quiz-btn">Main Framework / Core Concept</button>
                                    <button onClick={e => { e.currentTarget.classList.add('incorrect'); }} className="quiz-btn">Minor Supporting Data</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
