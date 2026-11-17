import React, { useState } from 'react';
import { Bot, Mic, Send, Volume2, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AiTutorAndCareer({ currentLang }) {
  // AI Tutor Q&A State
  const defaultQuestions = [
    {
      q: 'Why does my bicycle pump get hot when pumping air?',
      a: 'Great observation! When you compress air molecules inside the pump cylinder rapidly, you do mechanical work on the gas. According to the First Law of Thermodynamics (Adiabatic Compression), this rapid work increases the internal kinetic energy of air molecules, converting it into heat you feel on the metal pump barrel!',
      langMap: {
        kn: 'ನೀವು ಪಂಪ್ ಮಾಡುವಾಗ ಗಾಳಿಯನ್ನು ಸಂಕುಚಿತಗೊಳಿಸುತ್ತೀರಿ. ಥರ್ಮೋಡೈನಾಮಿಕ್ಸ್ ನಿಯಮದಂತೆ, ಕೆಲಸವು ಶಾಖವಾಗಿ ಪರಿವರ್ತನೆಯಾಗುತ್ತದೆ.',
        hi: 'जब आप पंप चलाते हैं, तो हवा के संपीड़न से यांत्रिक ऊर्जा ऊष्मा (गर्मी) में बदल जाती है।',
      },
    },
    {
      q: 'Why is the sky blue during the day and orange at sunset?',
      a: 'This is Rayleigh Scattering! Sunlight is composed of all rainbow colors. Blue light has a shorter wavelength and collides with nitrogen/oxygen molecules in our atmosphere, scattering in all directions. At sunset, sunlight travels through 10x more atmosphere, scattering away all blue light and leaving only red and orange to reach your eyes.',
      langMap: {
        kn: 'ಇದು ರೇಲೀ ಸ್ಕ್ಯಾಟರಿಂಗ್! ನೀಲಿ ಬೆಳಕಿನ ತರಂಗಾಂತರ ಕಡಿಮೆಯಾಗಿರುವುದರಿಂದ ಆಕಾಶ ನೀಲಿಯಾಗಿ ಕಾಣುತ್ತದೆ.',
        hi: 'यह रेले प्रकीर्णन है! छोटी तरंग दैर्ध्य के कारण नीला प्रकाश हवा के कणों द्वारा सबसे अधिक बिखरता है।',
      },
    },
    {
      q: 'Why does ice float on water when other solids sink?',
      a: 'Anomalous expansion of water! When water cools below 4°C, its hydrogen bonds lock into an open hexagonal crystalline lattice. This makes solid ice approximately 9% less dense than liquid water, allowing ponds to freeze from top to bottom so village fish survive winter underneath!',
      langMap: {
        kn: 'ನೀರಿನ ಅಸಹಜ ವಿಕಸನ! ಮಂಜುಗಡ್ಡೆಯ ಸಾಂದ್ರತೆಯು ದ್ರವ ನೀರಿಗಿಂತ 9% ಕಡಿಮೆಯಿರುವುದರಿಂದ ಅದು ತೇಲುತ್ತದೆ.',
        hi: 'पानी का असामान्य प्रसार! बर्फ का घनत्व तरल पानी से कम होता है, इसलिए यह तैरती है।',
      },
    },
  ];

  const [activeQuestion, setActiveQuestion] = useState(defaultQuestions[0]);
  const [customInput, setCustomInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleAsk = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setActiveQuestion({
      q: customInput,
      a: `Socratic Step-by-Step Guidance: 1. Let's analyze the forces acting on this system. 2. What happens to energy conservation? 3. Notice how everyday village mechanics follows textbook physics. Try scanning this object in the Lens tab!`,
    });
    setCustomInput('');
  };

  const handleSpeakAnswer = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = activeQuestion.a;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Career Navigator State
  const careers = [
    {
      passion: '🚲 Loves fixing bicycles & tractor gears',
      title: 'Robotics & Electric Vehicle Engineer',
      skills: ['Kinematics & Torque', 'Ohm’s Law & Motor Controllers', 'CAD Design'],
      roadmap: 'Class 8-10 Physics → Polytechnic / ITI / JEE → B.Tech Mechanical & Mechatronics',
      villageImpact: 'Design solar tractors, low-cost EV rickshaws & automated village harvesters.',
      color: '#ff5b57',
    },
    {
      passion: '🌱 Loves watching plant crops & soil insects',
      title: 'Agritech & Genetic Bio-Engineer',
      skills: ['Plant Physiology', 'Cellular Chloroplast Genetics', 'Soil Chemistry & pH'],
      roadmap: 'Class 9-12 Biology & Chemistry → ICAR Entrance → BSc Agriculture / Biotech',
      villageImpact: 'Develop drought-resistant seeds, bio-fertilizers & pest-resilient millet varieties.',
      color: '#2bd980',
    },
    {
      passion: '💡 Loves connecting wires, bulbs & solar plates',
      title: 'Renewable Smart-Grid Engineer',
      skills: ['Circuit Dynamics', 'Solar Photovoltaic Inverters', 'Battery Chem Storage'],
      roadmap: 'Class 8-12 Physics & Math → Diploma / Engineering → Solar Microgrid Specialist',
      villageImpact: 'Build 24/7 solar microgrids and decentralized cold-storage for farmer produce.',
      color: '#ffc531',
    },
  ];

  const [selectedCareer, setSelectedCareer] = useState(0);

  return (
    <section id="careers" style={{ padding: '70px 0', backgroundColor: '#fdfbf7', borderTop: '3px solid #17140d' }}>
      <div className="container-1440">
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 48px auto' }}>
          <div className="eyebrow-pill" style={{ backgroundColor: '#6b5be6', color: '#ffffff', marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffc531', border: '1.5px solid #17140d' }} />
            FEATURES 3 & 23: AI TUTOR & CAREER NAVIGATOR
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', marginBottom: 12 }}>
            From curious questions to{' '}
            <span className="marker-highlight teal">world-class STEM careers.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#444' }}>
            Ask Dr. APJ Mentor any doubt, and chart a clear educational roadmap from your village to top research institutions.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 36,
          }}
        >
          {/* ================= 1. AI TUTOR (DR. APJ MENTOR) ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#12b3a4',
                    border: '2px solid #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={24} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: 22 }}>Dr. APJ Mentor</h3>
                  <p style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Mother-Tongue Socratic AI Tutor</p>
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#2bd980',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                ONLINE 24/7
              </span>
            </div>

            {/* Quick Prompts */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 6 }}>
                Common Village Science Doubts:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {defaultQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestion(item)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '2px solid #17140d',
                      backgroundColor: activeQuestion.q === item.q ? '#ffc531' : '#f5efe2',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    💬 {item.q}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Dialogue Box */}
            <div
              style={{
                backgroundColor: '#17140d',
                color: '#ffffff',
                borderRadius: 14,
                padding: '16px 18px',
                border: '2px solid #17140d',
                marginBottom: 16,
              }}
            >
              <div style={{ color: '#ffc531', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
                Student asks: "{activeQuestion.q}"
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: '#e0dbcf' }}>
                {activeQuestion.a}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  onClick={handleSpeakAnswer}
                  className="btn-candy teal"
                  style={{ padding: '4px 12px', fontSize: 12 }}
                >
                  <Volume2 size={14} />
                  {isSpeaking ? 'Speaking...' : 'Listen in Audio'}
                </button>
              </div>
            </div>

            {/* Ask Custom Input */}
            <form onSubmit={handleAsk} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                placeholder="Ask any question (e.g. why does milk boil over?)"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 9999,
                  border: '2px solid #17140d',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-candy primary"
                style={{ padding: '10px 16px', borderRadius: 9999 }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* ================= 2. STEM CAREER NAVIGATOR ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#ffc531',
                  border: '2px solid #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={24} color="#17140d" />
              </div>
              <div>
                <h3 style={{ fontSize: 22 }}>STEM Career Navigator</h3>
                <p style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Connecting Village Curiosity to Real Careers</p>
              </div>
            </div>

            {/* Passion Selector Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {careers.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCareer(i)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '2px solid #17140d',
                    backgroundColor: selectedCareer === i ? c.color : '#f5efe2',
                    color: selectedCareer === i && c.color === '#ff5b57' ? '#fff' : '#17140d',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    boxShadow: selectedCareer === i ? '3px 3px 0 #17140d' : 'none',
                  }}
                >
                  {c.passion}
                </button>
              ))}
            </div>

            {/* Selected Career Blueprint */}
            <div
              style={{
                borderRadius: 14,
                border: '3px solid #17140d',
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '4px 4px 0 #17140d',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#6b5be6', marginBottom: 2 }}>
                Target Career Pathway:
              </div>
              <h4 style={{ fontSize: 22, color: '#17140d', marginBottom: 12 }}>
                {careers[selectedCareer].title}
              </h4>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ff5b57' }}>
                  Core Concepts to Master in School:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                  {careers[selectedCareer].skills.map((sk, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#f5efe2',
                        border: '1.5px solid #17140d',
                        borderRadius: 6,
                        padding: '2px 8px',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#12b3a4' }}>
                  Educational Roadmap:
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#333', marginTop: 2 }}>
                  {careers[selectedCareer].roadmap}
                </p>
              </div>

              <div style={{ borderTop: '2px dashed #17140d', paddingTop: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ffc531' }}>
                  Village & National Impact:
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#17140d', marginTop: 2 }}>
                  {careers[selectedCareer].villageImpact}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
