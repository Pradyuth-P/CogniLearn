import { useApp } from '../App.jsx';

export default function Onboarding() {
    const { startSession } = useApp();

    return (
        <section className="absolute inset-0 overflow-y-auto z-30 fade-enter bg-slate-50">
            <div className="landing-container">
                <h1 className="landing-title">CogniLearn</h1>
                <p className="landing-tagline">Learning that adapts to you.</p>
                <p style={{ color: '#555', marginBottom: '8px' }}>
                    Your personalized learning journey designed for neurodivergent minds.
                </p>
                <br />
                <button className="start-btn" onClick={startSession}>
                    Start Learning
                </button>
                <div className="features">
                    <div className="feature-card">
                        <h3>🧠 Adapts</h3>
                        <p>Detects reading struggle &amp; overload.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📁 Any File</h3>
                        <p>Upload PDFs, Word Docs, or Photos.</p>
                    </div>
                    <div className="feature-card">
                        <h3>📊 Faculty</h3>
                        <p>Secure monitoring dashboard.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
