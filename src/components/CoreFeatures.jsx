import React from 'react';
import { Camera, Volume2, Beaker, Compass, Sparkles, MapPin } from 'lucide-react';

export default function CoreFeatures({ onSelectSection }) {
  const features = [
    {
      id: 'scanner',
      title: 'Point, Scan & Decode',
      copy: 'Point your camera at a bicycle, pressure cooker, or pump to uncover hidden Physics laws, chemical reactions, and mathematical ratios.',
      chipColor: '#ff5b57',
      chipIcon: <Camera size={28} color="#ffffff" strokeWidth={2.4} />,
      accentColor: '#ff5b57',
      tag: 'AI Computer Vision',
    },
    {
      id: 'mentor',
      title: 'Mother Tongue Voice Tutor',
      copy: 'Speak your doubts naturally in Kannada, Hindi, Telugu, Tamil, Marathi, or English. "Dr. APJ Mentor" answers in simple, encouraging steps.',
      chipColor: '#12b3a4',
      chipIcon: <Volume2 size={28} color="#ffffff" strokeWidth={2.4} />,
      accentColor: '#12b3a4',
      tag: 'Voice & Multilingual',
    },
    {
      id: 'labs',
      title: 'Zero-Glassware Virtual Labs',
      copy: 'Perform interactive circuit simulations, safe acid-base chemistry mixtures, and 3D biology dissections right on your mobile screen.',
      chipColor: '#6b5be6',
      chipIcon: <Beaker size={28} color="#ffffff" strokeWidth={2.4} />,
      accentColor: '#6b5be6',
      tag: 'Interactive Web Labs',
    },
    {
      id: 'hunt',
      title: 'STEM Village Treasure Hunt',
      copy: 'Turn homework into an active village scavenger hunt. "Find 3 friction points in your home" — photograph them, earn points, and climb the leaderboard.',
      chipColor: '#ffc531',
      chipIcon: <Compass size={28} color="#17140d" strokeWidth={2.4} />,
      accentColor: '#ffc531',
      tag: 'Gamified Quests',
    },
    {
      id: 'stories',
      title: 'STEM Story Mode',
      copy: 'Convert complex abstract laws into thrilling local tales like "Rocket Raju’s Space Mission", linking Newton’s 3rd Law to a bicycle pump.',
      chipColor: '#3aa0ff',
      chipIcon: <Sparkles size={28} color="#ffffff" strokeWidth={2.4} />,
      accentColor: '#3aa0ff',
      tag: 'Story Learning',
    },
    {
      id: 'careers',
      title: 'Village to Scientist Career Path',
      copy: 'Discover how loving cycle gears connects to Aerospace Engineering, or observing village crops connects to Agricultural Genetics.',
      chipColor: '#2bd980',
      chipIcon: <MapPin size={28} color="#17140d" strokeWidth={2.4} />,
      accentColor: '#2bd980',
      tag: 'Career Roadmaps',
    },
  ];

  return (
    <section style={{ padding: '40px 0 80px 0' }}>
      <div className="container-1440">
        
        {/* Centered Heading */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 52px auto' }}>
          <div
            className="eyebrow-pill"
            style={{
              backgroundColor: '#6b5be6',
              color: '#ffffff',
              marginBottom: 18,
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
            HOW VIDYAVERSE REVOLUTIONIZES LEARNING
          </div>

          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Boring textbooks kill curiosity.{' '}
            <span className="marker-highlight teal">VidyaVerse turns the world into your lab.</span>
          </h2>

          <p style={{ fontSize: 18, color: '#444' }}>
            Built specifically to solve laboratory shortages and language barriers in rural schools.
          </p>
        </div>

        {/* 3-Column Memphis Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(16px, 2.5vw, 28px)',
          }}
        >
          {features.map((feat) => (
            <div
              key={feat.id}
              className="memphis-card"
              style={{
                padding: 'clamp(20px, 3vw, 32px) clamp(18px, 3vw, 28px)',
                cursor: 'pointer',
              }}
              onClick={() => onSelectSection(feat.id)}
            >
              {/* Corner accent circle bleeding off */}
              <div
                className="corner-accent"
                style={{ backgroundColor: feat.accentColor }}
              />

              {/* Tag pill */}
              <div style={{ marginBottom: 20 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: '#f5efe2',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    border: '2px solid #17140d',
                  }}
                >
                  {feat.tag}
                </span>
              </div>

              {/* Icon Chip */}
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  backgroundColor: feat.chipColor,
                  border: '3px solid #17140d',
                  boxShadow: '4px 4px 0 #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                {feat.chipIcon}
              </div>

              {/* Card Title */}
              <h3 style={{ fontSize: 22, marginBottom: 12 }}>{feat.title}</h3>

              {/* Copy line */}
              <p style={{ fontSize: 15, color: '#4b4842', lineHeight: 1.6 }}>{feat.copy}</p>

              {/* Action hint */}
              <div
                style={{
                  marginTop: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#17140d',
                  textDecoration: 'underline',
                }}
              >
                Explore this superpower →
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
