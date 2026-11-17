import React, { useState } from 'react';
import { Sparkles, ArrowRight, Volume2, Beaker, CheckCircle2, Play, Flame, Compass, RefreshCw } from 'lucide-react';

export default function Hero({ currentLang, onStartScan, onOpenLabs }) {
  // Preset objects for the tilted interactive mockup
  const scannedObjects = {
    bicycle: {
      name: 'Hero Bicycle (ಬೈಸಿಕಲ್ / साइकिल)',
      category: 'Mechanical & Kinematics',
      physics: "Newton's 1st & 2nd Laws • Gear Torque • Friction & Rolling Resistance",
      math: 'Circumference = 2πr • Velocity Ratio = N1/N2 • Cadence to Speed',
      chem: 'Rubber Vulcanization • Chain Lubrication Viscosity • Polymer Grip',
      experiment: 'Chalk line on the tire! Measure circumference and calculate speed from wheel rotations per minute.',
      audioText: {
        en: "Scanning bicycle: Demonstrates Newton's laws of motion, gear torque multiplication, and rolling friction of rubber tires.",
        kn: "ಬೈಸಿಕಲ್ ಸ್ಕ್ಯಾನ್: ನ್ಯೂಟನ್ ಚಲನೆಯ ನಿಯಮಗಳು, ಗೇರ್ ಟಾರ್ಕ್ ಮತ್ತು ಚಕ್ರದ ಘರ್ಷಣೆಯನ್ನು ವಿವರಿಸುತ್ತದೆ.",
        hi: "साइकिल स्कैन: न्यूटन के गति के नियम, गियर अनुपात और घर्षण के सिद्धांतों को प्रदर्शित करता है।",
        te: "సైకిల్ స్కాన్: న్యూటన్ చలన నియమాలు మరియు గేర్ నిష్పత్తిని వివరిస్తుంది.",
        ta: "சைக்கிள் ஸ்கேன்: நியூட்டனின் இயக்க விதிகள் மற்றும் உராய்வை விளக்குகிறது.",
        mr: "सायकल स्कॅन: न्यूटनचे गतीचे नियम आणि घर्षण स्पष्ट करते.",
      },
      stats: [
        { label: 'Kinetic Energy', val: '86%', color: '#ff5b57' },
        { label: 'Torque Multiplier', val: '3.2x', color: '#ffc531' },
        { label: 'Friction Coeff', val: '0.72', color: '#12b3a4' },
      ],
      checkmarks: [
        'Newton’s 3rd Law: Ground pushes tire forward',
        'Gear Ratio Calculation: 44T chainring to 18T cog',
        'Centripetal stability: Angular momentum of spinning wheels',
      ],
    },
    cooker: {
      name: 'Pressure Cooker (ಕುಕ್ಕರ್ / कुकर)',
      category: 'Thermodynamics & Physical Chem',
      physics: 'Boyle’s Law & Gay-Lussac’s Law (P ∝ T) • Steam Expansion • Safety Valve',
      math: 'Temperature vs Pressure Curve • Saturated Vapor Curves',
      chem: 'Boiling Point Elevation under Pressure (121°C) • Latent Heat of Vaporization',
      experiment: 'Observe boiling time at atmospheric pressure vs sealed pressure. Why does dal cook 3x faster?',
      audioText: {
        en: 'Pressure cooker scan: Elevated pressure raises the boiling point of water from 100 to 121 degrees Celsius, transferring heat faster.',
        kn: 'ಪ್ರೆಶರ್ ಕುಕ್ಕರ್: ಅಧಿಕ ಒತ್ತಡದಿಂದ ನೀರಿನ ಕುದಿಯುವ ಬಿಂದು ಹೆಚ್ಚಾಗಿ ಆಹಾರ ಬೇಗ ಬೇಯುತ್ತದೆ.',
        hi: 'प्रेशर कुकर: दबाव बढ़ने से पानी का क्वथनांक 100 से बढ़कर 121 डिग्री हो जाता है।',
        te: 'ప్రెషర్ కుక్కర్: పీడనం పెరగడం వల్ల నీరు వేగంగా మరుగుతుంది.',
        ta: 'பிரஷர் குக்கர்: அதிக அழுத்தம் நீரின் கொதிநிலையை உயர்த்துகிறது.',
        mr: 'प्रेशर कुकर: दाब वाढल्यामुळे पाण्याचा उत्कलन बिंदू वाढतो.',
      },
      stats: [
        { label: 'Internal Pressure', val: '2.0 atm', color: '#ff5b57' },
        { label: 'Boiling Point', val: '121 °C', color: '#6b5be6' },
        { label: 'Cooking Speedup', val: '300%', color: '#12b3a4' },
      ],
      checkmarks: [
        'Gay-Lussac’s Law: Pressure directly proportional to Kelvin temperature',
        'Phase Transition: Latent heat absorption (2260 kJ/kg)',
        'Mechanical safety: Weighted valve releases steam at limit',
      ],
    },
    fan: {
      name: 'Ceiling Fan (ಫ್ಯಾನ್ / छत का पंखा)',
      category: 'Electromagnetism & Fluid Flow',
      physics: 'Lorentz Force • AC Induction Motor • Angular Velocity & Centrifugal Force',
      math: 'Blade Sweep Area A = πr² • Volumetric Air Flow Rate Q = A × v',
      chem: 'Capacitor Dielectric Storage • Copper Coil Eddy Currents',
      experiment: 'Tape a paper strip to the blade edge and center. Observe relative velocity and centrifugal swing.',
      audioText: {
        en: 'Ceiling fan: Alternating current creates a rotating magnetic field in the stator, generating torque to circulate air downwards.',
        kn: 'ಸೀಲಿಂಗ್ ಫ್ಯಾನ್: ವಿದ್ಯುತ್ಕಾಂತೀಯ ಪ್ರೇರಣೆಯ ಮೂಲಕ ಗಾಳಿಯನ್ನು ಕೆಳಮುಖವಾಗಿ ತಳ್ಳುತ್ತದೆ.',
        hi: 'छत का पंखा: विद्युत चुंबकीय प्रेरण के माध्यम से घूर्णन गति पैदा करता है।',
        te: 'సీలింగ్ ఫ్యాన్: విద్యుదయస్కాంత ప్రేరణ ద్వారా గాలిని క్రిందికి నెట్టుతుంది.',
        ta: 'மின்விசிறி: மின்காந்த தூண்டல் மூலம் சுழற்சி ஆற்றலை உருவாக்குகிறது.',
        mr: 'पंखा: विद्युतचुंबकीय प्रेरणेद्वारे हवेचा प्रवाह तयार करतो.',
      },
      stats: [
        { label: 'RPM Velocity', val: '360', color: '#3aa0ff' },
        { label: 'Air Flow Rate', val: '220 m³/m', color: '#ffc531' },
        { label: 'Motor Efficiency', val: '91%', color: '#12b3a4' },
      ],
      checkmarks: [
        'Aerodynamic blade pitch directs airflow downward',
        'Run capacitor creates 90-degree phase shift for starting torque',
        'Conservation of angular momentum when speed step changes',
      ],
    },
    plant: {
      name: 'Neem Leaf (ಬೇವು / नीम का पत्ता)',
      category: 'Plant Physiology & Bio-optics',
      physics: 'Photon Absorption (430nm & 660nm) • Capillary Action in Xylem',
      math: 'Surface Area to Volume Ratio of Leaves • Stomatal Density Count',
      chem: 'Photosynthesis: 6CO₂ + 6H₂O + Photons → C₆H₁₂O₆ + 6O₂ • Chlorophyll A & B',
      experiment: 'Submerge leaf in warm water and observe oxygen bubbles forming on underside stomata!',
      audioText: {
        en: 'Neem plant scan: Chlorophyll absorbs solar photons to split water molecules, generating oxygen and glucose.',
        kn: 'ಬೇವಿನ ಎಲೆ: ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯ ಮೂಲಕ ಸೌರಶಕ್ತಿಯನ್ನು ಗ್ಲುಕೋಸ್ ಆಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.',
        hi: 'नीम की पत्ती: प्रकाश संश्लेषण द्वारा सौर ऊर्जा को रासायनिक ऊर्जा में बदलती है।',
        te: 'వేప ఆకు: కిరణజన్య సంయోగక్రియ ద్వారా ఆక్సిజన్ విడుదల చేస్తుంది.',
        ta: 'வேப்பிலை: ஒளிச்சேர்க்கை மூலம் ஆக்ஸிஜனை உற்பத்தி செய்கிறது.',
        mr: 'कडुलिंब पान: प्रकाश संश्लेषणाद्वारे ऑक्सिजन तयार करते.',
      },
      stats: [
        { label: 'Light Harvest', val: '94%', color: '#2bd980' },
        { label: 'Transpiration', val: '1.2 ml/h', color: '#3aa0ff' },
        { label: 'Stomata Count', val: '120/mm²', color: '#ffc531' },
      ],
      checkmarks: [
        'Light Dependent Reaction: Photolysis of water in thylakoid',
        'Capillary tension pulls moisture up 15 meters',
        'Azadirachtin compound acts as organic insect deterrent',
      ],
    },
  };

  const [activeObjKey, setActiveObjKey] = useState('bicycle');
  const activeObj = scannedObjects[activeObjKey];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = activeObj.audioText[currentLang] || activeObj.audioText['en'];
      const utterance = new SpeechSynthesisUtterance(text);
      // Try setting Indian English / Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(v => v.lang.includes(currentLang) || v.lang.includes('IN'));
      if (matched) utterance.voice = matched;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(activeObj.audioText[currentLang] || activeObj.audioText['en']);
    }
  };

  return (
    <section id="hero" style={{ position: 'relative', zIndex: 1, paddingTop: 48, paddingBottom: 64 }}>
      <div className="container-1440">
        
        {/* Asymmetric 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN: Copy + CTAs + Trust Row */}
          <div>
            {/* Eyebrow Pill */}
            <div
              className="eyebrow-pill"
              style={{
                backgroundColor: '#6b5be6',
                color: '#ffffff',
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#ffc531',
                  border: '1.5px solid #17140d',
                  display: 'inline-block',
                }}
              />
              POCKET SCIENCE LAB FOR EVERY RURAL STUDENT
            </div>

            {/* Giant Display Headline */}
            <h1
              style={{
                fontSize: 'clamp(42px, 5.2vw, 74px)',
                lineHeight: 1.02,
                marginBottom: 24,
                letterSpacing: '-0.035em',
              }}
            >
              Turn <span className="marker-highlight">Every Bicycle</span> & Village into a{' '}
              <span className="marker-highlight teal">Pocket Lab.</span>
            </h1>

            {/* Lead Paragraph */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(16px, 1.3vw, 19px)',
                color: '#38342c',
                lineHeight: 1.6,
                maxWidth: 580,
                marginBottom: 32,
              }}
            >
              No costly lab glassware required. Point your phone at a bicycle, pressure cooker, ceiling fan, or well pump to instantly unlock interactive Physics, Chemistry, Math & Biology — in your mother tongue with voice guidance.
            </p>

            {/* Dual Candy CTA Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 40 }}>
              <button
                onClick={onStartScan}
                className="btn-candy primary"
                style={{ fontSize: 17, padding: '14px 28px' }}
              >
                Scan an Object Now
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>

              <button
                onClick={onOpenLabs}
                className="btn-candy secondary"
                style={{ fontSize: 17, padding: '14px 28px' }}
              >
                <Beaker size={20} strokeWidth={2.5} color="#17140d" />
                Launch Virtual Lab
              </button>
            </div>

            {/* Trust Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Overlapping Avatars */}
              <div style={{ display: 'flex' }}>
                {[
                  { bg: '#ff5b57', label: 'R' },
                  { bg: '#12b3a4', label: 'P' },
                  { bg: '#6b5be6', label: 'A' },
                  { bg: '#ffc531', label: 'S' },
                ].map((av, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      backgroundColor: av.bg,
                      color: av.bg === '#ffc531' ? '#17140d' : '#ffffff',
                      border: '3px solid #17140d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 16,
                      marginLeft: idx === 0 ? 0 : -12,
                      boxShadow: '2px 2px 0 #17140d',
                    }}
                  >
                    {av.label}
                  </div>
                ))}
              </div>

              {/* Two-Line Proof Copy */}
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#17140d', fontFamily: 'var(--font-display)' }}>
                  Gamified Learning & Future Roadmaps
                </p>
                <p style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>
                  Kannada • Hindi • Telugu • Tamil • 100% Offline Capable
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Tilted Interactive Product Dashboard Mockup */}
          <div>
            <div
              className="memphis-card tilted-card"
              style={{
                backgroundColor: '#ffffff',
                border: '3px solid #17140d',
                borderRadius: 24,
                boxShadow: '9px 9px 0 #17140d',
                maxWidth: 620,
                margin: '0 auto',
              }}
            >
              {/* Browser Chrome Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  backgroundColor: '#f5efe2',
                  borderBottom: '3px solid #17140d',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5b57', border: '2px solid #17140d' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffc531', border: '2px solid #17140d' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#12b3a4', border: '2px solid #17140d' }} />
                  <span style={{ marginLeft: 8, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#17140d' }}>
                    VidyaVerse • Live Lens 3.2
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, backgroundColor: '#2bd980', padding: '2px 8px', borderRadius: 9999, border: '2px solid #17140d' }}>
                    ACTIVE SCAN
                  </span>
                </div>
              </div>

              {/* Object Switcher Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: '12px 16px',
                  backgroundColor: '#ffffff',
                  borderBottom: '3px solid #17140d',
                  overflowX: 'auto',
                }}
              >
                {[
                  { key: 'bicycle', icon: '🚲', name: 'Bicycle' },
                  { key: 'cooker', icon: '🍲', name: 'Cooker' },
                  { key: 'fan', icon: '🌀', name: 'Ceiling Fan' },
                  { key: 'plant', icon: '🌱', name: 'Neem Leaf' },
                ].map((obj) => (
                  <button
                    key={obj.key}
                    onClick={() => setActiveObjKey(obj.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 14px',
                      borderRadius: 9999,
                      border: '2px solid #17140d',
                      backgroundColor: activeObjKey === obj.key ? '#ffc531' : '#f5efe2',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: activeObjKey === obj.key ? '2px 2px 0 #17140d' : 'none',
                    }}
                  >
                    <span>{obj.icon}</span>
                    <span>{obj.name}</span>
                  </button>
                ))}
              </div>

              {/* Mockup Body */}
              <div style={{ padding: '20px 22px' }}>
                
                {/* Object Title & Audio button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#ff5b57', letterSpacing: '0.04em' }}>
                      {activeObj.category}
                    </span>
                    <h3 style={{ fontSize: 22, marginTop: 2 }}>{activeObj.name}</h3>
                  </div>

                  <button
                    onClick={handleSpeak}
                    className="btn-candy teal"
                    style={{ padding: '8px 14px', fontSize: 13, boxShadow: '3px 3px 0 #17140d' }}
                    title="Read in Selected Language"
                  >
                    <Volume2 size={16} />
                    {isPlayingAudio ? 'Speaking...' : 'Listen (ಧ್ವನಿ)'}
                  </button>
                </div>

                {/* STEM Concept Decomposition Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginBottom: 18 }}>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      backgroundColor: '#fff4e6',
                      border: '2px solid #17140d',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 12, backgroundColor: '#ff5b57', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        PHYSICS
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#17140d' }}>{activeObj.physics}</p>
                  </div>

                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      backgroundColor: '#eef8f6',
                      border: '2px solid #17140d',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 12, backgroundColor: '#12b3a4', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        MATHEMATICS
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#17140d' }}>{activeObj.math}</p>
                  </div>

                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      backgroundColor: '#f3eefb',
                      border: '2px solid #17140d',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 12, backgroundColor: '#6b5be6', color: '#fff', padding: '1px 6px', borderRadius: 4, border: '1.5px solid #17140d' }}>
                        CHEMISTRY / BIO
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#17140d' }}>{activeObj.chem}</p>
                  </div>
                </div>

                {/* Visual Stats Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  {activeObj.stats.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: '2px solid #17140d',
                        backgroundColor: '#f5efe2',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, color: '#666', fontWeight: 700 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Socratic Checkmarks / Concept Mastery */}
                <div style={{ borderTop: '2px dashed #17140d', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', color: '#17140d' }}>
                    Concept Checklist for Exams:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activeObj.checkmarks.map((chk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
                        <CheckCircle2 size={16} color="#12b3a4" strokeWidth={3} />
                        <span>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Household Experiment Prompt */}
                <div
                  style={{
                    marginTop: 16,
                    padding: '10px 14px',
                    borderRadius: 12,
                    backgroundColor: '#ffc531',
                    border: '2px solid #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Flame size={22} color="#17140d" />
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#17140d' }}>
                    <span style={{ textDecoration: 'underline' }}>Pocket DIY Experiment:</span> {activeObj.experiment}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
