import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';

export default function StoryMode() {
  const [storyStep, setStoryStep] = useState(0);

  const storyChapters = [
    {
      title: 'Chapter 1: The Muddy Path & The Rice Sack',
      text: 'Raju had to transport a heavy 20kg rice bag across the muddy village field to his grandmother’s house. With every hard step forward, his feet slipped backward into the mud. Why couldn’t he run?',
      concept: 'Newton’s 3rd Law: To propel yourself forward, your foot must exert an equal backward force onto the ground. Slippery wet monsoon mud has a low static friction coefficient (μ < 0.2), causing slipping!',
      icon: '🌾',
      highlight: 'Friction & Reaction Force',
    },
    {
      title: 'Chapter 2: The Bicycle Spoke Rocket',
      text: 'Determined to make carrying things faster, Raju took his village bicycle tire pump, fitted a long rubber balloon to the nozzle, and secured a hollow straw along the top. When he unclipped the nozzle...',
      concept: 'Action and Reaction! High-pressure gas exhausts backward through the narrow nozzle (Action -F), propelling Raju’s balloon rocket across the room with equal forward thrust (Reaction +F)!',
      icon: '🚀',
      highlight: 'Newton’s 3rd Law: Action = -Reaction',
    },
    {
      title: 'Chapter 3: Raju’s Village Space Dream',
      text: 'By connecting bicycle tire pumps and bottle pressure, Raju built the village’s first water-rocket for the taluk science fair, taking 1st place! He realized real science isn’t locked in expensive glass labs — it lives in every cycle and mud road.',
      concept: 'Every village machine follows universal laws of physics and mechanics. Master the objects around you, and you can build spacecraft!',
      icon: '🌌',
      highlight: 'From Village Cycles to Satellites',
    },
  ];

  const current = storyChapters[storyStep];

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#3aa0ff',
              border: '3px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={28} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>STEM Story Mode</h3>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Interactive Tale: "Rocket Raju's Village Mission"</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {storyChapters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStoryStep(idx)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '2px solid #17140d',
                backgroundColor: storyStep === idx ? '#ff5b57' : '#f5efe2',
                color: storyStep === idx ? '#ffffff' : '#17140d',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Box */}
      <div
        style={{
          backgroundColor: '#f5efe2',
          borderRadius: 20,
          border: '3px solid #17140d',
          boxShadow: '4px 4px 0 #17140d',
          padding: '28px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 44 }}>{current.icon}</span>
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                backgroundColor: '#ffc531',
                padding: '2px 8px',
                borderRadius: 4,
                border: '1.5px solid #17140d',
              }}
            >
              {current.highlight}
            </span>
            <h4 style={{ fontSize: 22, marginTop: 4 }}>{current.title}</h4>
          </div>
        </div>

        <p style={{ fontSize: 16, lineHeight: 1.7, color: '#2b271f', marginBottom: 20 }}>
          {current.text}
        </p>

        {/* Science Breakdown */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 12,
            backgroundColor: '#ffffff',
            border: '2.5px solid #17140d',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: '#ff5b57', textTransform: 'uppercase', marginBottom: 4 }}>
            🔬 Science Law Decoded:
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#17140d', lineHeight: 1.5 }}>
            {current.concept}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setStoryStep(Math.max(0, storyStep - 1))}
          disabled={storyStep === 0}
          className="btn-candy secondary"
          style={{ padding: '8px 18px', fontSize: 14, opacity: storyStep === 0 ? 0.4 : 1 }}
        >
          ← Previous
        </button>

        <button
          onClick={() => setStoryStep((storyStep + 1) % storyChapters.length)}
          className="btn-candy violet"
          style={{ padding: '8px 22px', fontSize: 14 }}
        >
          {storyStep === storyChapters.length - 1 ? 'Replay Mission ↺' : 'Next Chapter →'}
        </button>
      </div>
    </div>
  );
}
