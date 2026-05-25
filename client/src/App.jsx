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

export const API_BASE = import.meta.env.DEV ? '' : 'https://cognilearn-vshh.onrender.com';

/* ─── Subjects & Lessons Data ──────────────────── */
export const SUBJECTS = [
    {
        id: 'biology',
        name: 'Biology',
        icon: '🔬',
        color: 'biology',
        description: 'Explore living organisms, ecosystems, genetics, and the molecular machinery of life.',
        duration: '6h 20m',
        rating: '4.9',
        students: '3.2k',
        headerGradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
        lessons: [
            { id: 'bio-1', title: 'Deep Sea Neural Adaptations', duration: '25 min', content: getBioContent('deep-sea') },
            { id: 'bio-2', title: 'Cell Biology & Organelles', duration: '30 min', content: getBioContent('cells') },
            { id: 'bio-3', title: 'Genetics & DNA Structure', duration: '35 min', content: getBioContent('genetics') },
            { id: 'bio-4', title: 'Photosynthesis & Respiration', duration: '28 min', content: getBioContent('photosynthesis') },
            { id: 'bio-5', title: 'Ecosystems & Food Webs', duration: '20 min', content: getBioContent('ecosystems') },
            { id: 'bio-6', title: 'Human Immune System', duration: '32 min', content: getBioContent('immune') },
        ],
    },
    {
        id: 'physics',
        name: 'Physics',
        icon: '⚛️',
        color: 'physics',
        description: "Master Newton's laws, quantum mechanics, electromagnetic waves, and the fundamental forces of nature.",
        duration: '7h 45m',
        rating: '4.8',
        students: '2.8k',
        headerGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        lessons: [
            { id: 'phy-1', title: "Newton's Laws of Motion", duration: '30 min', content: getPhysicsContent('newton') },
            { id: 'phy-2', title: 'Waves & Electromagnetic Spectrum', duration: '35 min', content: getPhysicsContent('waves') },
            { id: 'phy-3', title: 'Thermodynamics', duration: '40 min', content: getPhysicsContent('thermo') },
            { id: 'phy-4', title: 'Quantum Mechanics Intro', duration: '45 min', content: getPhysicsContent('quantum') },
            { id: 'phy-5', title: 'Special Relativity', duration: '38 min', content: getPhysicsContent('relativity') },
        ],
    },
    {
        id: 'math',
        name: 'Mathematics',
        icon: '📐',
        color: 'math',
        description: 'From algebra to calculus — build strong foundations and explore advanced mathematical thinking.',
        duration: '9h 10m',
        rating: '4.7',
        students: '4.1k',
        headerGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        lessons: [
            { id: 'math-1', title: 'Algebra Fundamentals', duration: '30 min', content: getMathContent('algebra') },
            { id: 'math-2', title: 'Geometry & Trigonometry', duration: '35 min', content: getMathContent('geometry') },
            { id: 'math-3', title: 'Differential Calculus', duration: '45 min', content: getMathContent('calculus') },
            { id: 'math-4', title: 'Statistics & Probability', duration: '35 min', content: getMathContent('statistics') },
            { id: 'math-5', title: 'Linear Algebra', duration: '40 min', content: getMathContent('linear') },
        ],
    },
    {
        id: 'history',
        name: 'World History',
        icon: '🏛️',
        color: 'history',
        description: 'Journey through civilizations, wars, revolutions, and the people who shaped our world.',
        duration: '5h 30m',
        rating: '4.8',
        students: '2.5k',
        headerGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        lessons: [
            { id: 'his-1', title: 'Ancient Civilizations', duration: '30 min', content: getHistoryContent('ancient') },
            { id: 'his-2', title: 'The Renaissance Era', duration: '28 min', content: getHistoryContent('renaissance') },
            { id: 'his-3', title: 'World War I & II', duration: '40 min', content: getHistoryContent('ww') },
            { id: 'his-4', title: 'Industrial Revolution', duration: '30 min', content: getHistoryContent('industrial') },
            { id: 'his-5', title: 'Cold War & Modern Era', duration: '35 min', content: getHistoryContent('cold-war') },
        ],
    },
    {
        id: 'english',
        name: 'English Literature',
        icon: '📚',
        color: 'english',
        description: 'Analyze classic and modern literature, develop writing skills, and master the English language.',
        duration: '5h 50m',
        rating: '4.6',
        students: '1.9k',
        headerGradient: 'linear-gradient(135deg, #ec4899, #db2777)',
        lessons: [
            { id: 'eng-1', title: 'Shakespearean Drama', duration: '35 min', content: getEnglishContent('shakespeare') },
            { id: 'eng-2', title: 'Literary Devices & Figures', duration: '25 min', content: getEnglishContent('devices') },
            { id: 'eng-3', title: 'Poetry Analysis', duration: '30 min', content: getEnglishContent('poetry') },
            { id: 'eng-4', title: '20th Century Fiction', duration: '35 min', content: getEnglishContent('fiction') },
        ],
    },
    {
        id: 'cs',
        name: 'Computer Science',
        icon: '💻',
        color: 'cs',
        description: 'Algorithms, data structures, programming paradigms, and the theory behind modern computing.',
        duration: '8h 20m',
        rating: '4.9',
        students: '5.1k',
        headerGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        lessons: [
            { id: 'cs-1', title: 'Algorithms & Big-O Notation', duration: '40 min', content: getCSContent('algorithms') },
            { id: 'cs-2', title: 'Data Structures', duration: '45 min', content: getCSContent('data-structures') },
            { id: 'cs-3', title: 'Web Development Basics', duration: '35 min', content: getCSContent('web') },
            { id: 'cs-4', title: 'Machine Learning Intro', duration: '50 min', content: getCSContent('ml') },
            { id: 'cs-5', title: 'Databases & SQL', duration: '35 min', content: getCSContent('sql') },
            { id: 'cs-6', title: 'Operating Systems', duration: '40 min', content: getCSContent('os') },
        ],
    },
    {
        id: 'geography',
        name: 'Geography',
        icon: '🌍',
        color: 'geography',
        description: 'Discover continents, climate systems, human geography, and the natural forces shaping Earth.',
        duration: '4h 40m',
        rating: '4.6',
        students: '1.7k',
        headerGradient: 'linear-gradient(135deg, #f97316, #ea580c)',
        lessons: [
            { id: 'geo-1', title: 'Physical Geography', duration: '30 min', content: getGeoContent('physical') },
            { id: 'geo-2', title: 'Plate Tectonics & Volcanoes', duration: '28 min', content: getGeoContent('tectonics') },
            { id: 'geo-3', title: 'Climate & Biomes', duration: '32 min', content: getGeoContent('climate') },
            { id: 'geo-4', title: 'Human & Urban Geography', duration: '30 min', content: getGeoContent('human') },
        ],
    },
    {
        id: 'science',
        name: 'General Science',
        icon: '🧪',
        color: 'science',
        description: 'Chemistry, earth science, astronomy, and general scientific principles for everyday understanding.',
        duration: '6h 00m',
        rating: '4.7',
        students: '2.3k',
        headerGradient: 'linear-gradient(135deg, #10b981, #059669)',
        lessons: [
            { id: 'sci-1', title: 'Periodic Table & Elements', duration: '30 min', content: getSciContent('periodic') },
            { id: 'sci-2', title: 'Chemical Reactions', duration: '35 min', content: getSciContent('reactions') },
            { id: 'sci-3', title: 'Solar System & Astronomy', duration: '30 min', content: getSciContent('astronomy') },
            { id: 'sci-4', title: 'Earth Science & Geology', duration: '28 min', content: getSciContent('geology') },
            { id: 'sci-5', title: 'Scientific Method', duration: '20 min', content: getSciContent('method') },
        ],
    },
];

/* ─── Lesson Content Generators ─────────────────── */
function getBioContent(topic) {
    const contents = {
        'deep-sea': `<p class="lead">The abyssal zone remains one of the least explored environments on Earth. Here, life has evolved in radically different directions than on the surface.</p>
      <div class="visual-sticker"><span class="sticker-label">Diagram: Bioluminescent Organs</span>
        <img src="https://cdn.britannica.com/32/6532-004-CDC2337C/section-Tranverse-organ-hatchetfish.jpg" alt="Bioluminescence diagram" style="width:100%; height:150px; object-fit:cover;" />
        <p style="font-size:0.75rem; padding:8px; background:#f8fafc;"><strong>Figure A:</strong> Photophores allow deep-sea life to communicate and hunt in pitch darkness.</p>
      </div>
      <p>Bioluminescence is not merely a survival mechanism; it is a complex language of light used for hunting, mating, and camouflage. Consider the <strong>Vampire Squid</strong> (<em>Vampyroteuthis infernalis</em>).</p>
      <div class="my-6 distraction interactive"><p>Bioluminescence is the production of light by an organism as the result of a chemiluminescence reaction. It occurs in a wide variety of organisms, including marine vertebrates and invertebrates, terrestrial arthropods such as fireflies, some fungi, and microorganisms such as some bacteria and dinoflagellates.</p></div>
      <p>Its filaments can detect movement in pitch-black water, a sensory adaptation that rivals advanced radar systems.</p>`,
        'cells': `<p class="lead">Cells are the fundamental units of life. Every living organism is composed of one or more cells, each performing essential biological functions.</p>
      <h3>Key Organelles</h3>
      <p>The <strong>mitochondria</strong> generate ATP through oxidative phosphorylation — they are the powerhouses of the cell. The <strong>nucleus</strong> contains the cell's DNA and controls gene expression. <strong>Ribosomes</strong> synthesize proteins following instructions encoded in mRNA.</p>
      <div class="visual-sticker"><span class="sticker-label">Cell Structure Overview</span><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Animal_Cell.svg/640px-Animal_Cell.svg.png" alt="Animal cell diagram" style="width:100%; height:200px; object-fit:contain; background:#fff;" /></div>
      <p>The <strong>endoplasmic reticulum (ER)</strong> comes in two types: rough ER (studded with ribosomes) and smooth ER. The Golgi apparatus processes and packages proteins for secretion.</p>`,
        'genetics': `<p class="lead">DNA (deoxyribonucleic acid) is the molecule that carries genetic information in all living organisms and many viruses.</p>
      <h3>The Double Helix</h3>
      <p>DNA consists of two complementary strands wound in a double helix. Each strand is made up of nucleotides containing a phosphate group, a deoxyribose sugar, and one of four nitrogenous bases: <strong>Adenine (A)</strong>, <strong>Thymine (T)</strong>, <strong>Guanine (G)</strong>, and <strong>Cytosine (C)</strong>.</p>
      <p>Base pairing rules: A pairs with T, and G pairs with C. This complementarity is the basis for DNA replication and transcription.</p>
      <h3>Mendelian Genetics</h3>
      <p>Gregor Mendel's experiments with pea plants established the laws of <strong>segregation</strong> and <strong>independent assortment</strong>. Dominant alleles mask recessive ones. A Punnett square predicts the probability of offspring genotypes.</p>`,
        'photosynthesis': `<p class="lead">Photosynthesis is the process by which plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose.</p>
      <h3>The Light-Dependent Reactions</h3>
      <p>These reactions occur in the thylakoid membranes. Sunlight is absorbed by chlorophyll, exciting electrons to a higher energy state. This drives the photolysis of water (splitting water into oxygen, protons, and electrons) and produces ATP and NADPH.</p>
      <h3>The Calvin Cycle</h3>
      <p>In the stroma, CO₂ is fixed using the ATP and NADPH from the light reactions. The enzyme <strong>RuBisCO</strong> catalyzes the first major step. The cycle produces G3P, which can be used to build glucose and other organic compounds.</p>
      <p>Overall equation: <strong>6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂</strong></p>`,
        'ecosystems': `<p class="lead">An ecosystem encompasses all the living organisms in an area together with the non-living components of their environment, interacting as a system.</p>
      <h3>Trophic Levels & Food Webs</h3>
      <p><strong>Producers</strong> (plants) form the base, capturing solar energy. <strong>Primary consumers</strong> (herbivores) eat producers. <strong>Secondary consumers</strong> eat herbivores. <strong>Decomposers</strong> break down dead organic matter, recycling nutrients.</p>
      <p>Energy flow is about 10% efficient between trophic levels — meaning 90% is lost as heat at each step.</p>
      <h3>Biogeochemical Cycles</h3>
      <p>The <strong>carbon cycle</strong>, <strong>nitrogen cycle</strong>, and <strong>water cycle</strong> are essential processes that move matter through ecosystems and the physical environment.</p>`,
        'immune': `<p class="lead">The human immune system is a complex network of cells, tissues, and organs that defends the body against pathogens, including bacteria, viruses, fungi, and parasites.</p>
      <h3>Innate vs. Adaptive Immunity</h3>
      <p><strong>Innate immunity</strong> is the first line of defense — immediate and non-specific. It includes physical barriers (skin, mucous membranes), phagocytes, and the inflammatory response.</p>
      <p><strong>Adaptive immunity</strong> is specific and slower but creates immunological memory. <strong>B cells</strong> produce antibodies; <strong>T cells</strong> kill infected cells or help coordinate the immune response.</p>
      <p>Vaccines work by exposing the immune system to an antigen without causing disease, allowing memory cells to form for faster future responses.</p>`,
    };
    return contents[topic] || contents['deep-sea'];
}

function getPhysicsContent(topic) {
    const contents = {
        newton: `<p class="lead">Isaac Newton's three laws of motion form the foundation of classical mechanics — describing how objects move and interact.</p>
      <h3>First Law — Inertia</h3><p>An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced external force.</p>
      <h3>Second Law — Force & Acceleration</h3><p><strong>F = ma</strong>. The net force on an object equals its mass times its acceleration. The greater the force, the greater the acceleration; the greater the mass, the less the acceleration for the same force.</p>
      <h3>Third Law — Action & Reaction</h3><p>For every action, there is an equal and opposite reaction. When a rocket expels gas downward, it is propelled upward.</p>`,
        waves: `<p class="lead">Waves are disturbances that transfer energy from one point to another without the permanent displacement of matter.</p>
      <h3>Types of Waves</h3><p><strong>Transverse waves</strong> oscillate perpendicular to the direction of energy transfer (e.g., light). <strong>Longitudinal waves</strong> oscillate parallel to the direction of travel (e.g., sound).</p>
      <h3>The Electromagnetic Spectrum</h3><p>Electromagnetic waves span a vast range: radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays. All travel at c = 3×10⁸ m/s in a vacuum. The relationship: <strong>c = fλ</strong> (frequency × wavelength).</p>`,
        thermo: `<p class="lead">Thermodynamics is the branch of physics that deals with heat, work, temperature, and their relation to energy, radiation, and physical properties of matter.</p>
      <h3>The Four Laws</h3><p>The <strong>Zeroth Law</strong> establishes thermal equilibrium. The <strong>First Law</strong> states that energy is conserved: ΔU = Q − W. The <strong>Second Law</strong> states that entropy of an isolated system never decreases. The <strong>Third Law</strong> states that absolute zero cannot be reached.</p>`,
        quantum: `<p class="lead">Quantum mechanics describes the physical properties of nature at the scale of atoms and subatomic particles.</p>
      <h3>Wave-Particle Duality</h3><p>Particles like electrons exhibit both wave-like and particle-like properties. The <strong>double-slit experiment</strong> demonstrates this duality: electrons create an interference pattern when not observed, but behave as particles when observed.</p>
      <h3>Heisenberg's Uncertainty Principle</h3><p>It is impossible to simultaneously know both the precise position and momentum of a particle: <strong>Δx · Δp ≥ ℏ/2</strong>.</p>`,
        relativity: `<p class="lead">Einstein's Special Theory of Relativity (1905) fundamentally changed our understanding of space, time, and energy.</p>
      <h3>The Two Postulates</h3><p>1. The laws of physics are the same in all inertial reference frames. 2. The speed of light in a vacuum is the same for all observers, regardless of the motion of the light source.</p>
      <h3>E = mc²</h3><p>This famous equation expresses the equivalence of energy (E) and mass (m), with c being the speed of light. It means even a tiny amount of mass contains an enormous amount of energy.</p>`,
    };
    return contents[topic] || contents.newton;
}

function getMathContent(topic) {
    const contents = {
        algebra: `<p class="lead">Algebra is the branch of mathematics dealing with symbols and the rules for manipulating those symbols to solve equations and understand relationships.</p>
      <h3>Variables & Expressions</h3><p>A <strong>variable</strong> is a symbol (like x or y) that represents an unknown quantity. An <strong>expression</strong> combines variables, numbers, and operations. An <strong>equation</strong> states that two expressions are equal.</p>
      <h3>Solving Linear Equations</h3><p>To solve 2x + 5 = 13: subtract 5 from both sides to get 2x = 8, then divide by 2 to get x = 4. Always perform the same operation on both sides to maintain equality.</p>
      <h3>Quadratic Formula</h3><p>For ax² + bx + c = 0: <strong>x = (−b ± √(b²−4ac)) / 2a</strong>. The discriminant b²−4ac tells you how many real roots exist.</p>`,
        geometry: `<p class="lead">Geometry is the study of shapes, sizes, positions, and properties of figures and spaces.</p>
      <h3>Pythagorean Theorem</h3><p>In a right triangle, <strong>a² + b² = c²</strong>, where c is the hypotenuse. This theorem has thousands of proofs and is fundamental to trigonometry and navigation.</p>
      <h3>Trigonometric Ratios</h3><p>SOH-CAH-TOA: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. These ratios are the foundation of trigonometry.</p>`,
        calculus: `<p class="lead">Calculus is the mathematical study of continuous change. It has two main branches: differential calculus and integral calculus.</p>
      <h3>Derivatives</h3><p>The derivative measures the rate of change. If f(x) = xⁿ, then f'(x) = nxⁿ⁻¹. The derivative of sin(x) is cos(x). The derivative of eˣ is eˣ.</p>
      <h3>The Chain Rule</h3><p>If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x). This is used to differentiate composite functions.</p>
      <h3>Integrals</h3><p>Integration is the reverse of differentiation. ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. The Fundamental Theorem of Calculus connects derivatives and integrals.</p>`,
        statistics: `<p class="lead">Statistics is the discipline that concerns the collection, organization, analysis, interpretation, and presentation of data.</p>
      <h3>Measures of Central Tendency</h3><p><strong>Mean</strong>: sum of values divided by count. <strong>Median</strong>: middle value when sorted. <strong>Mode</strong>: most frequent value.</p>
      <h3>Normal Distribution</h3><p>The bell curve is described by its mean (μ) and standard deviation (σ). ~68% of data falls within 1σ, ~95% within 2σ, ~99.7% within 3σ (the empirical rule).</p>`,
        linear: `<p class="lead">Linear algebra deals with vectors, matrices, and linear transformations — foundational for computer graphics, machine learning, and engineering.</p>
      <h3>Vectors & Vector Spaces</h3><p>A vector has both magnitude and direction. Vector addition and scalar multiplication follow specific rules. A vector space is a set closed under these operations.</p>
      <h3>Matrix Operations</h3><p>Matrices can be added (element-wise) and multiplied. Matrix multiplication is not commutative: AB ≠ BA in general. The determinant and inverse of a matrix are key concepts.</p>`,
    };
    return contents[topic] || contents.algebra;
}

function getHistoryContent(topic) {
    const contents = {
        ancient: `<p class="lead">The ancient world gave birth to the first cities, writing systems, legal codes, and philosophical traditions that still echo today.</p>
      <h3>Mesopotamia — Cradle of Civilization</h3><p>Between the Tigris and Euphrates rivers, the Sumerians (~3500 BCE) developed cuneiform writing, the wheel, and one of the first legal systems — the Code of Ur-Nammu. Babylon later produced <strong>Hammurabi's Code</strong> (c. 1754 BCE).</p>
      <h3>Ancient Egypt</h3><p>Egyptian civilization flourished for over 3,000 years along the Nile. Their achievements include the Great Pyramids, hieroglyphic writing, advanced medicine, and sophisticated religious systems.</p>
      <h3>Ancient Greece</h3><p>Greece gave birth to democracy (Athens), philosophy (Socrates, Plato, Aristotle), the Olympic Games, and mathematical foundations through Euclid and Pythagoras.</p>`,
        renaissance: `<p class="lead">The Renaissance (14th–17th centuries) was a period of "rebirth" that began in Italy and spread across Europe, marking a transition from the Middle Ages to modernity.</p>
      <h3>Key Ideas</h3><p><strong>Humanism</strong> placed individual human potential at the center. Artists and thinkers looked back to classical Greek and Roman models while innovating boldly.</p>
      <h3>Giant Figures</h3><p><strong>Leonardo da Vinci</strong> bridged art and science. <strong>Michelangelo</strong> created the Sistine Chapel ceiling and David. <strong>Galileo</strong> challenged geocentrism. <strong>Gutenberg's</strong> printing press democratized knowledge.</p>`,
        ww: `<p class="lead">World War I (1914–1918) and World War II (1939–1945) were the two deadliest conflicts in human history, reshaping the world's political map.</p>
      <h3>WWI: Causes & Legacy</h3><p>The assassination of Archduke Franz Ferdinand triggered a chain of alliances. Trench warfare, poison gas, and industrialized killing were defining features. The Treaty of Versailles' harsh terms on Germany sowed the seeds for WWII.</p>
      <h3>WWII: Holocaust & Allied Victory</h3><p>Nazi Germany's genocidal Holocaust murdered 6 million Jews and millions of others. The Allies (US, UK, USSR, France) defeated the Axis powers. WWII ended in 1945, leading to the Cold War, the United Nations, and decolonization.</p>`,
        industrial: `<p class="lead">The Industrial Revolution (c. 1760–1840) began in Britain and transformed manufacturing, agriculture, and society through machines powered by steam and coal.</p>
      <h3>Key Inventions</h3><p>James Watt improved the <strong>steam engine</strong>. Spinning jenny, cotton gin, and power loom revolutionized textile production. The railway shrank distances and connected markets.</p>
      <h3>Social Impact</h3><p>Urbanization soared as workers moved to factory towns. Child labor was common. The working class grew, eventually giving rise to labor movements, unions, and socialist political thought.</p>`,
        'cold-war': `<p class="lead">The Cold War (1947–1991) was a geopolitical struggle between the United States and the Soviet Union, characterized by proxy wars, nuclear arms races, and ideological competition.</p>
      <h3>Key Events</h3><p>The <strong>Berlin Blockade</strong> (1948), Korean War (1950–53), Cuban Missile Crisis (1962), and Vietnam War (1955–75) defined decades of tension. The <strong>Space Race</strong> saw both superpowers compete to reach the Moon — the US succeeded in 1969.</p>
      <h3>End of the Cold War</h3><p>Mikhail Gorbachev's reforms (glasnost, perestroika) and the fall of communist governments across Eastern Europe led to the dissolution of the Soviet Union in 1991.</p>`,
    };
    return contents[topic] || contents.ancient;
}

function getEnglishContent(topic) {
    const contents = {
        shakespeare: `<p class="lead">William Shakespeare (1564–1616) is widely regarded as the greatest writer in the English language and the world's greatest dramatist.</p>
      <h3>Romeo and Juliet</h3><p>A tragedy about two young lovers from feuding families in Verona. Key themes: love vs. hate, fate vs. free will, family loyalty vs. individual desire. Famous soliloquy: "But soft, what light through yonder window breaks..."</p>
      <h3>Hamlet</h3><p>"To be, or not to be — that is the question." Prince Hamlet grapples with themes of revenge, morality, madness, and mortality after his father's ghost reveals he was murdered by Hamlet's uncle.</p>
      <h3>Macbeth</h3><p>A Scottish general driven by ambition and his wife's manipulation to murder King Duncan. Themes: unchecked ambition, guilt, fate, and the corrupting nature of power.</p>`,
        devices: `<p class="lead">Literary devices are tools that writers use to convey meaning, create effects, and make their writing more vivid and engaging.</p>
      <h3>Figures of Speech</h3><p><strong>Simile</strong>: a comparison using "like" or "as" (e.g., "brave as a lion"). <strong>Metaphor</strong>: a direct comparison stating one thing is another ("Life is a journey"). <strong>Personification</strong>: giving human qualities to non-human things ("The trees whispered").</p>
      <h3>Sound Devices</h3><p><strong>Alliteration</strong>: repetition of initial consonant sounds. <strong>Onomatopoeia</strong>: words that imitate sounds (buzz, crash). <strong>Assonance</strong>: repetition of vowel sounds within words.</p>
      <h3>Structural Devices</h3><p><strong>Foreshadowing</strong> hints at future events. <strong>Irony</strong> (verbal, situational, dramatic) creates contrast between expectation and reality. <strong>Flashback</strong> disrupts chronology to reveal past events.</p>`,
        poetry: `<p class="lead">Poetry distills language to its most essential, using rhythm, imagery, and form to express ideas and emotions with concentrated power.</p>
      <h3>Forms of Poetry</h3><p><strong>Sonnet</strong>: 14 lines, often in iambic pentameter. Shakespearean sonnets have three quatrains and a couplet; Petrarchan sonnets have an octave and sestet. <strong>Free verse</strong>: no fixed meter or rhyme scheme. <strong>Haiku</strong>: three lines of 5-7-5 syllables.</p>
      <h3>Poetic Meter</h3><p><strong>Iambic pentameter</strong> consists of five iambs (unstressed-stressed syllables) per line — the rhythm of Shakespeare. "Shall I com-PARE thee TO a SUM-mer's DAY?"</p>`,
        fiction: `<p class="lead">The 20th century produced some of the most significant and challenging works of Western literature, from modernism to postmodernism.</p>
      <h3>George Orwell's 1984</h3><p>A dystopian novel set in a totalitarian superstate called Oceania. "Big Brother is watching you." Themes: surveillance, propaganda, thought control, and the erasure of truth. Coined terms like "Newspeak," "doublethink," and "Orwellian."</p>
      <h3>F. Scott Fitzgerald's The Great Gatsby</h3><p>Set in the Roaring Twenties, it critiques the American Dream through Jay Gatsby's obsessive pursuit of wealth and Daisy Buchanan. The green light at the end of Daisy's dock symbolizes unattainable dreams.</p>`,
    };
    return contents[topic] || contents.shakespeare;
}

function getCSContent(topic) {
    const contents = {
        algorithms: `<p class="lead">An algorithm is a step-by-step procedure for solving a problem. Big-O notation describes how an algorithm's runtime or space requirements grow with input size.</p>
      <h3>Common Complexities</h3><p><strong>O(1)</strong>: Constant time — array access. <strong>O(log n)</strong>: Logarithmic — binary search. <strong>O(n)</strong>: Linear — linear search. <strong>O(n log n)</strong>: Merge sort, quick sort (average). <strong>O(n²)</strong>: Bubble sort, nested loops.</p>
      <h3>Sorting Algorithms</h3><p><strong>Merge Sort</strong> divides the array in half, sorts each half, and merges them — always O(n log n). <strong>Quick Sort</strong> picks a pivot and partitions — O(n log n) average, O(n²) worst case.</p>`,
        'data-structures': `<p class="lead">Data structures are ways of organizing and storing data to enable efficient access and modification.</p>
      <h3>Arrays & Linked Lists</h3><p><strong>Arrays</strong> provide O(1) access by index but O(n) insertion/deletion. <strong>Linked lists</strong> have O(1) insertion/deletion at head but O(n) access.</p>
      <h3>Stacks & Queues</h3><p><strong>Stacks</strong> operate LIFO (Last In, First Out) — used in function call stacks, undo operations. <strong>Queues</strong> operate FIFO (First In, First Out) — used in BFS, task scheduling.</p>
      <h3>Trees & Graphs</h3><p>Binary Search Trees allow O(log n) search, insert, and delete. Graphs model networks. BFS and DFS are fundamental traversal algorithms.</p>`,
        web: `<p class="lead">Web development encompasses building websites and web applications that run in browsers.</p>
      <h3>HTML, CSS, JavaScript</h3><p><strong>HTML</strong> provides structure (elements and content). <strong>CSS</strong> controls presentation (layout, colors, typography). <strong>JavaScript</strong> adds interactivity and dynamic behavior.</p>
      <h3>The DOM</h3><p>The Document Object Model (DOM) represents the HTML document as a tree structure. JavaScript manipulates the DOM to create dynamic pages.</p>
      <h3>Frontend Frameworks</h3><p><strong>React</strong> (component-based, virtual DOM), <strong>Vue.js</strong>, and <strong>Angular</strong> dominate modern frontend development. Each uses a component architecture for building complex UIs.</p>`,
        ml: `<p class="lead">Machine learning enables computers to learn from data and make decisions without being explicitly programmed for every scenario.</p>
      <h3>Supervised Learning</h3><p>Models learn from labeled training data. <strong>Regression</strong> predicts continuous values; <strong>classification</strong> predicts discrete classes. Examples: linear regression, decision trees, neural networks.</p>
      <h3>Neural Networks</h3><p>Inspired by the human brain, neural networks consist of layers of interconnected nodes (neurons). Deep learning uses many layers to extract complex features from data, driving breakthroughs in image recognition and NLP.</p>`,
        sql: `<p class="lead">SQL (Structured Query Language) is the standard language for interacting with relational databases.</p>
      <h3>Core Commands</h3><p><strong>SELECT</strong> retrieves data; <strong>INSERT</strong> adds new rows; <strong>UPDATE</strong> modifies existing rows; <strong>DELETE</strong> removes rows. The <strong>WHERE</strong> clause filters results.</p>
      <h3>Joins</h3><p><strong>INNER JOIN</strong> returns records with matching values in both tables. <strong>LEFT JOIN</strong> returns all records from the left table. <strong>Aggregate functions</strong>: COUNT, SUM, AVG, MAX, MIN — used with GROUP BY.</p>`,
        os: `<p class="lead">An operating system manages hardware resources and provides services for application programs.</p>
      <h3>Process Management</h3><p>The OS manages processes: creation, scheduling, and termination. <strong>CPU scheduling algorithms</strong> include Round Robin, FCFS, and Shortest Job First. Context switching allows multitasking.</p>
      <h3>Memory Management</h3><p><strong>Virtual memory</strong> allows programs to use more memory than physically available via paging. The page table maps virtual addresses to physical addresses. Cache memory provides fast data access close to the CPU.</p>`,
    };
    return contents[topic] || contents.algorithms;
}

function getGeoContent(topic) {
    const contents = {
        physical: `<p class="lead">Physical geography studies the natural features and processes of the Earth's surface.</p>
      <h3>Landforms</h3><p>Mountains, plateaus, plains, and valleys are shaped by endogenic (internal) forces like tectonic activity and exogenic (external) forces like erosion and weathering. The Himalayas are still rising as the Indian plate collides with the Eurasian plate.</p>
      <h3>Drainage Systems</h3><p>Rivers carry water from highlands to seas, creating valleys, deltas, and floodplains. The Amazon basin is the world's largest river basin by area and discharge volume.</p>`,
        tectonics: `<p class="lead">Plate tectonic theory explains how Earth's rigid outer shell (lithosphere) is broken into plates that move over the semi-fluid asthenosphere.</p>
      <h3>Types of Boundaries</h3><p><strong>Divergent boundaries</strong>: plates move apart, creating mid-ocean ridges (e.g., Mid-Atlantic Ridge). <strong>Convergent boundaries</strong>: plates collide, causing subduction or mountain building. <strong>Transform boundaries</strong>: plates slide past each other (e.g., San Andreas Fault).</p>
      <h3>Volcanoes & Earthquakes</h3><p>Most volcanic and seismic activity occurs at plate boundaries. The "Ring of Fire" around the Pacific is the world's most geologically active zone.</p>`,
        climate: `<p class="lead">Climate refers to the long-term patterns of weather in a region, while a biome is a large geographical area defined by its climate, plants, and animals.</p>
      <h3>Climate Zones</h3><p>Earth's major climate zones are determined by latitude, altitude, ocean currents, and distance from the sea: tropical, subtropical, temperate, subarctic, and polar.</p>
      <h3>Major Biomes</h3><p>Tropical rainforests have the highest biodiversity. Deserts receive less than 250mm of rain per year. Tundra is treeless and frozen. Temperate deciduous forests experience four distinct seasons.</p>`,
        human: `<p class="lead">Human geography examines how human activity shapes and is shaped by the physical environment.</p>
      <h3>Urbanization</h3><p>More than half of the world's population now lives in cities. Urban areas are growing fastest in Asia and Africa. <strong>Megacities</strong> (populations >10 million) include Tokyo, Delhi, Shanghai, and São Paulo.</p>
      <h3>Globalization</h3><p>The increasing interconnection of the world's economies, cultures, and populations driven by trade, investment, technology, and migration. It creates both opportunities (economic growth) and challenges (inequality, cultural homogenization).</p>`,
    };
    return contents[topic] || contents.physical;
}

function getSciContent(topic) {
    const contents = {
        periodic: `<p class="lead">The periodic table organizes all known chemical elements by atomic number, electron configuration, and recurring chemical properties.</p>
      <h3>Periods & Groups</h3><p>Elements in the same <strong>period</strong> (row) have the same number of electron shells. Elements in the same <strong>group</strong> (column) have the same number of valence electrons and similar chemical properties. Noble gases (Group 18) are largely non-reactive.</p>
      <h3>Key Elements</h3><p>Hydrogen (H) is the most abundant element in the universe. Oxygen (O) is vital for respiration. Carbon (C) is the backbone of all organic chemistry. Iron (Fe) is the most common element by mass in Earth's core.</p>`,
        reactions: `<p class="lead">A chemical reaction involves the transformation of one or more substances (reactants) into different substances (products).</p>
      <h3>Types of Reactions</h3><p><strong>Synthesis</strong>: A + B → AB. <strong>Decomposition</strong>: AB → A + B. <strong>Single displacement</strong>: A + BC → AC + B. <strong>Double displacement</strong>: AB + CD → AD + CB. <strong>Combustion</strong>: fuel + O₂ → CO₂ + H₂O.</p>
      <h3>Acids & Bases</h3><p>Acids donate protons (H⁺); bases accept them (Brønsted-Lowry definition). pH scale: 0–6 is acidic, 7 is neutral, 8–14 is basic. Strong acids/bases fully dissociate in water.</p>`,
        astronomy: `<p class="lead">Astronomy is the study of celestial objects, space, and the universe as a whole.</p>
      <h3>The Solar System</h3><p>Our solar system contains the Sun (a G-type main-sequence star), 8 planets, dwarf planets, moons (over 200 known), asteroids, comets, and Kuiper Belt objects. Jupiter is the largest planet; Mercury is the smallest.</p>
      <h3>Stars & Galaxies</h3><p>Stars form from collapsing clouds of gas and dust (nebulae). Our Sun is middle-aged (~4.6 billion years old) and will become a red giant in ~5 billion years. The Milky Way contains ~200–400 billion stars and is ~100,000 light-years across.</p>`,
        geology: `<p class="lead">Geology is the study of Earth, including its materials, structure, and the processes acting upon it.</p>
      <h3>Rock Types</h3><p><strong>Igneous rocks</strong> form from solidified magma (granite, basalt). <strong>Sedimentary rocks</strong> form from compressed sediment layers (sandstone, limestone) — and contain most fossils. <strong>Metamorphic rocks</strong> form when existing rocks are transformed by heat and pressure (marble, slate).</p>
      <h3>The Rock Cycle</h3><p>Rocks continuously transform from one type to another through processes of melting, weathering, erosion, compaction, and metamorphism over geological time scales.</p>`,
        method: `<p class="lead">The scientific method is a systematic approach to investigating questions about the natural world through observation, hypothesis, experimentation, and analysis.</p>
      <h3>Steps of the Scientific Method</h3><p>1. <strong>Observation</strong>: Notice a phenomenon. 2. <strong>Question</strong>: Formulate a testable question. 3. <strong>Hypothesis</strong>: Propose a falsifiable explanation. 4. <strong>Experiment</strong>: Design a controlled test. 5. <strong>Data Analysis</strong>: Analyze results objectively. 6. <strong>Conclusion</strong>: Accept, reject, or modify the hypothesis.</p>
      <h3>Controls & Variables</h3><p>A controlled experiment changes one <strong>independent variable</strong> while holding all others constant. The <strong>dependent variable</strong> is what is measured. The <strong>control group</strong> provides a baseline for comparison.</p>`,
    };
    return contents[topic] || contents.periodic;
}

/* ─── Default article content ─── */
export const DEFAULT_CONTENT = getBioContent('deep-sea');

export default function App() {
    /* ── View Router ── */
    const [view, setView] = useState('onboarding');
    const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState(false);

    /* ── Lesson/Subject ── */
    const [currentSubject, setCurrentSubject] = useState(SUBJECTS[0]);
    const [currentLesson, setCurrentLesson] = useState(SUBJECTS[0].lessons[0]);

    /* ── Adaptive Profiles ── */
    const [activeProfiles, setActiveProfiles] = useState(new Set());
    const activeProfilesRef = useRef(new Set()); // always-current mirror for event listeners
    const [isGameActive, setIsGameActive] = useState(false);
    const isGameActiveRef = useRef(false);       // ref mirror for listeners
    const gamePendingRef = useRef(false);
    const isSessionStartedRef = useRef(false);   // ref mirror for listeners
    // Stable ref wrappers so listeners mounted once always call current impl
    const activateProfileRef = useRef(null);
    const triggerGameRef = useRef(null);

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
    const [moduleTitle, setModuleTitle] = useState(SUBJECTS[0].lessons[0].title);
    const [moduleCode, setModuleCode] = useState(SUBJECTS[0].id.toUpperCase() + '-101');
    const [articleHTML, setArticleHTML] = useState(DEFAULT_CONTENT);
    const [score, setScore] = useState(0);
    const [showAiQuiz, setShowAiQuiz] = useState(false);
    const [isSessionStarted, setIsSessionStarted] = useState(false);

    /* ── Select lesson ── */
    const selectLesson = useCallback((subject, lesson) => {
        setCurrentSubject(subject);
        setCurrentLesson(lesson);
        setModuleTitle(lesson.title);
        setModuleCode(subject.id.toUpperCase() + '-' + lesson.id.split('-')[1].padStart(3, '0'));
        setArticleHTML(lesson.content);
        setShowAiQuiz(false);
    }, []);

    /* ── Activate adaptive profile ── */
    const activateProfile = useCallback((profile) => {
        if (activeProfilesRef.current.has(profile)) return;
        const next = new Set(activeProfilesRef.current);
        next.add(profile);
        activeProfilesRef.current = next;
        if (profile === 'adhd') { document.body.classList.add('mode-focus'); notify('Focus Mode', 'Distractions minimized & focus highlights active.', 'zap'); }
        if (profile === 'dyslexia') { document.body.classList.add('mode-dyslexia'); notify('Reading Assist', 'Font optimized for readability.', 'type'); }
        if (profile === 'autism') { document.body.classList.add('mode-autism'); notify('Sensory Mode', 'Colors softened for comfort.', 'smile'); }
        setActiveProfiles(new Set(next));
    }, [notify]);

    // Keep ref in sync so stable listeners always call the latest implementation
    activateProfileRef.current = activateProfile;

    /* ── Trigger orb game ── */
    const triggerGame = useCallback(() => {
        if (gamePendingRef.current || isGameActiveRef.current) return;
        gamePendingRef.current = true;
        const onVisible = () => {
            if (!document.hidden) {
                gamePendingRef.current = false;
                isGameActiveRef.current = true;
                setIsGameActive(true);
                document.removeEventListener('visibilitychange', onVisible);
            }
        };
        document.addEventListener('visibilitychange', onVisible);
    }, []);

    // Keep ref in sync
    triggerGameRef.current = triggerGame;

    /* ── Reset session state ── */
    const resetSession = useCallback(() => {
        metricsRef.current = { tabSwitches: 0, postAdhdTabSwitches: 0, emptySpaceClicks: 0, contentMisclicks: 0, selectionCount: 0, startTime: Date.now() };
        activeProfilesRef.current = new Set();
        isSessionStartedRef.current = false;
        isGameActiveRef.current = false;
        setActiveProfiles(new Set());
        setIsGameActive(false);
        document.body.classList.remove('mode-dyslexia', 'mode-focus', 'mode-autism');
        setArticleHTML(DEFAULT_CONTENT);
        setModuleTitle(SUBJECTS[0].lessons[0].title);
        setModuleCode(SUBJECTS[0].id.toUpperCase() + '-101');
        setScore(0);
        setShowAiQuiz(false);
        setIsSessionStarted(false);
    }, []);

    /* ── Navigate ── */
    const navigate = useCallback((v) => {
        if (v === 'dashboard' && !isFacultyLoggedIn) {
            setView('login');
            return;
        }
        setView(v);
        if (v === 'onboarding') resetSession();
    }, [resetSession, isFacultyLoggedIn]);

    /* ── Start session ── */
    const startSession = useCallback(() => {
        navigate('module');
        metricsRef.current.startTime = Date.now();
        isSessionStartedRef.current = true;
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
            const res = await fetch(`${API_BASE}/api/sessions`, {
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

    /* ── Behavioral listeners — registered ONCE at mount, all mutable values via refs ── */
    useEffect(() => {
        const handleClick = (e) => {
            if (!isSessionStartedRef.current) return;
            if (isGameActiveRef.current) return;
            if (e.target.closest('button, a, input, .interactive, .btn-interactive')) return;
            const tag = e.target.tagName;
            if (['SECTION', 'MAIN', 'BODY', 'DIV'].includes(tag)) {
                metricsRef.current.emptySpaceClicks++;
                if (metricsRef.current.emptySpaceClicks >= 2) activateProfileRef.current?.('autism');
            }
            if (['P', 'H1', 'H2', 'H3', 'H4', 'ARTICLE', 'LI', 'SPAN'].includes(tag)) {
                metricsRef.current.contentMisclicks++;
                if (metricsRef.current.contentMisclicks >= 3) activateProfileRef.current?.('dyslexia');
            }
        };

        const handleSelection = () => {
            if (!isSessionStartedRef.current) return;
            if (document.getSelection().toString().length > 5) {
                if (!selectionDebounceRef.current) {
                    metricsRef.current.selectionCount++;
                    selectionDebounceRef.current = true;
                    setTimeout(() => { selectionDebounceRef.current = false; }, 1000);
                    if (metricsRef.current.selectionCount >= 3) activateProfileRef.current?.('dyslexia');
                }
            }
        };

        // Registered once — reads all mutable state through stable refs only
        const handleVisibility = () => {
            if (!isSessionStartedRef.current) return;
            if (document.hidden) {
                metricsRef.current.tabSwitches++;
                const switches = metricsRef.current.tabSwitches;
                const hasAdhd = activeProfilesRef.current.has('adhd');
                console.log(`[CogniLearn] Tab switch #${switches} | ADHD active: ${hasAdhd}`);
                if (hasAdhd) {
                    metricsRef.current.postAdhdTabSwitches++;
                    console.log(`[CogniLearn] Post-ADHD switch #${metricsRef.current.postAdhdTabSwitches}`);
                    if (metricsRef.current.postAdhdTabSwitches >= 2) triggerGameRef.current?.();
                } else if (switches >= 1) {  // triggers on first tab switch away
                    console.log('[CogniLearn] ADHD threshold reached — activating Focus Mode!');
                    activateProfileRef.current?.('adhd');
                }
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('selectionchange', handleSelection);
        document.addEventListener('visibilitychange', handleVisibility);
        console.log('[CogniLearn] 🧠 Behavioral listeners registered (mount)');
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('selectionchange', handleSelection);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, []); // Mounted once — no deps needed since all values are accessed via refs

    // Debug hook — accessible from DevTools console as window.cogniDebug
    useEffect(() => {
        window.cogniDebug = {
            get sessionStarted() { return isSessionStartedRef.current; },
            get tabSwitches() { return metricsRef.current.tabSwitches; },
            get activeProfiles() { return [...activeProfilesRef.current]; },
            get documentHidden() { return document.hidden; },
            forceADHD() { activateProfileRef.current?.('adhd'); return 'ADHD activated!'; },
            forceDyslexia() { activateProfileRef.current?.('dyslexia'); return 'Dyslexia mode activated!'; },
            forceAutism() { activateProfileRef.current?.('autism'); return 'Autism mode activated!'; },
            simulateTabSwitch() {
                // Manually fires the visibility logic as if the tab was hidden
                const was = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
                Object.defineProperty(document, 'hidden', { value: true, configurable: true });
                document.dispatchEvent(new Event('visibilitychange'));
                setTimeout(() => {
                    if (was) Object.defineProperty(document, 'hidden', was);
                    else Object.defineProperty(document, 'hidden', { value: false, configurable: true });
                    document.dispatchEvent(new Event('visibilitychange'));
                }, 100);
                return 'Tab switch simulated!';
            },
        };
        console.log('[CogniLearn] 🔧 Debug: window.cogniDebug available. Try cogniDebug.forceADHD()');
    }, []);

    /* ── Context value ── */
    const ctx = {
        view, navigate, activeProfiles, isGameActive, setIsGameActive,
        notify, moduleTitle, setModuleTitle, moduleCode, setModuleCode,
        articleHTML, setArticleHTML, score, setScore,
        showAiQuiz, setShowAiQuiz, startSession, finishSession, resetSession,
        currentSubject, currentLesson, selectLesson,
        activateProfile,  // exposed for manual test button in Module
        isFacultyLoggedIn, setIsFacultyLoggedIn,
    };

    return (
        <AppContext.Provider value={ctx}>
            <div className="h-screen flex flex-col overflow-hidden text-slate-800">
                <Header />
                <main id="app-container" className="flex-1 relative overflow-hidden bg-slate-50">
                    {view === 'onboarding' && <Onboarding />}
                    {view === 'module' && <Module />}
                    {view === 'login' && <Login />}
                    {view === 'dashboard' && isFacultyLoggedIn && <Dashboard />}
                    {isGameActive && <GameOverlay />}
                </main>
                <ToastContainer toasts={toasts} />
            </div>
        </AppContext.Provider>
    );
}
