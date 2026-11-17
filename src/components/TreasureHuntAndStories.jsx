import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Compass, CheckCircle2, Award, BookOpen, Sparkles, Trophy } from 'lucide-react';

export default function TreasureHuntAndStories() {
  // Treasure Hunt items
  const [huntItems, setHuntItems] = useState([
    { id: 'brake', label: 'Bicycle Rubber Brake Pad', science: 'Frictional braking converts kinetic energy to heat', found: false, icon: '🛑' },
    { id: 'sole', label: 'Shoe Sole Tread Pattern', science: 'Static friction coefficient prevents slipping on monsoon mud', found: false, icon: '👟' },
    { id: 'match', label: 'Matchstick Striker Surface', science: 'Friction generates flash heat (180°C) igniting phosphorus', found: false, icon: '🔥' },
  ]);

  const [points, setPoints] = useState(0);
  const [badgeAwarded, setBadgeAwarded] = useState(false);

  const handleToggleItem = (id) => {
    const updated = huntItems.map((item) => {
      if (item.id === id) {
        const nextState = !item.found;
        return { ...item, found: nextState };
      }
      return item;
    });

    setHuntItems(updated);
    const foundCount = updated.filter((it) => it.found).length;
    setPoints(foundCount * 50);

    if (foundCount === 3 && !badgeAwarded) {
      setBadgeAwarded(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Story Mode State
  const [storyStep, setStoryStep] = useState(0);
  const storyChapters = [
    {
      title: 'Chapter 1: The Heavy Rice Sack',
      text: 'Raju had to carry a 20kg rice sack across the muddy village field to his grandmother’s house. His feet slipped backward with every step. Why?',
      concept: 'Newton’s 3rd Law: For Raju to push forward, his feet must push the ground backward. Slippery mud cannot provide sufficient static friction!',
      icon: '🌾',
    },
    {
      title: 'Chapter 2: The Bicycle Spoke Rocket',
      text: 'Raju took his bicycle tire pump, fitted a long rubber balloon onto the nozzle, and taped a plastic straw to the top. As the pressurized air rushed out...',
      concept: 'Action and Reaction! The escaping air rushes backwards with force F, pushing Raju’s balloon rocket forward with equal and opposite force -F!',
      icon: '🚀',
    },
    {
      title: 'Chapter 3: Raju Reaches Space Orbit',
      text: 'By understanding how forces balance and action creates reaction, Raju built the village’s first water-rocket for the school science fair!',
      concept: 'Real-world science is not magic: It is understanding the invisible laws hidden inside bicycle pumps, pressure cookers, and muddy boots.',
      icon: '🌌',
    },
  ];

  return (
    <section id="hunt" style={{ padding: '70px 0', borderTop: '3px solid #17140d' }}>
      <div className="container-1440">
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: 840, margin: '0 auto 48px auto' }}>
          <div className="eyebrow-pill" style={{ backgroundColor: '#ffc531', color: '#17140d', marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff5b57', border: '1.5px solid #17140d' }} />
            FEATURES 8 & 9: TREASURE HUNT & STORY MODE
          </div>

          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', marginBottom: 12 }}>
            Gamify everyday science.{' '}
            <span className="marker-highlight">Hunt friction & fly with Rocket Raju.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#444' }}>
            Transform theoretical textbook homework into joyful real-world village missions.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 36,
          }}
        >
          {/* ================= 1. STEM TREASURE HUNT ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: '#ff5b57',
                    border: '2px solid #17140d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Compass size={24} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: 22 }}>STEM Treasure Hunt</h3>
                  <p style={{ fontSize: 13, color: '#666' }}>Active Mission: Friction Quest #04</p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffc531',
                  border: '2px solid #17140d',
                  borderRadius: 9999,
                  padding: '4px 12px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Score: {points} / 150 pts
              </div>
            </div>

            <p style={{ fontSize: 14, fontWeight: 600, color: '#17140d', marginBottom: 18 }}>
              🎯 <strong>Mission Objective:</strong> Locate 3 items around your home that rely on friction. Tap each to verify!
            </p>

            {/* 3 Items Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {huntItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: '2px solid #17140d',
                    backgroundColor: item.found ? '#e8fbf2' : '#f5efe2',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#17140d' }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{item.science}</div>
                  </div>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: '2px solid #17140d',
                      backgroundColor: item.found ? '#2bd980' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.found && <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Badge Unlocked Notification */}
            {badgeAwarded ? (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 14,
                  backgroundColor: '#ffc531',
                  border: '2px solid #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  animation: 'confetti-pulse 2s ease infinite',
                }}
              >
                <Trophy size={36} color="#17140d" />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>
                    🎖️ BADGE UNLOCKED: "Friction Detective"
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    150 points added to your School Leaderboard!
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#666', textAlign: 'center', fontWeight: 600 }}>
                Find all 3 items to earn the badge & propel your school ranking!
              </div>
            )}
          </div>

          {/* ================= 2. STEM STORY MODE ================= */}
          <div className="memphis-card" style={{ padding: '32px 28px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#3aa0ff',
                  border: '2px solid #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={24} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: 22 }}>STEM Story Mode</h3>
                <p style={{ fontSize: 13, color: '#666' }}>Episode 1: Rocket Raju’s Mission</p>
              </div>
            </div>

            {/* Story Card Box */}
            <div
              style={{
                backgroundColor: '#f5efe2',
                borderRadius: 16,
                border: '3px solid #17140d',
                padding: '20px 22px',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{storyChapters[storyStep].icon}</span>
                  <h4 style={{ fontSize: 18, color: '#17140d' }}>{storyChapters[storyStep].title}</h4>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#333', marginBottom: 12 }}>
                  {storyChapters[storyStep].text}
                </p>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor: '#ffffff',
                  border: '2px solid #17140d',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ff5b57', textTransform: 'uppercase' }}>
                  The Science Behind the Story:
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#17140d', marginTop: 2 }}>
                  {storyChapters[storyStep].concept}
                </p>
              </div>
            </div>

            {/* Story Progression Stepper */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {storyChapters.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStoryStep(idx)}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '2px solid #17140d',
                      backgroundColor: storyStep === idx ? '#ff5b57' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setStoryStep((storyStep + 1) % storyChapters.length)}
                className="btn-candy violet"
                style={{ padding: '8px 18px', fontSize: 13 }}
              >
                Next Chapter →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
