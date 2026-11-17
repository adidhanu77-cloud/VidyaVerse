import React from 'react';

export default function ImpactStrip() {
  const partners = [
    'ATAL TINKERING LABS',
    'SAMAGRA SHIKSHA',
    'DIKSHA PORTAL',
    'AGASTYA FOUNDATION',
    'PRATHAM SCIENCE',
    'NCERT CURRICULUM',
  ];

  return (
    <div
      className="full-bleed-banner"
      style={{
        padding: '24px 0',
        marginTop: 40,
        marginBottom: 60,
      }}
    >
      <div
        className="container-1440"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Left Mustard Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.12em',
              color: '#ffc531',
              textTransform: 'uppercase',
            }}
          >
            ★ ALIGNED WITH RURAL STEM INITIATIVES:
          </span>
        </div>

        {/* Right Partner Wordmarks */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(18px, 3.5vw, 42px)',
          }}
        >
          {partners.map((partner, index) => (
            <span
              key={index}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(15px, 1.4vw, 18px)',
                letterSpacing: '-0.02em',
                color: '#f5efe2',
                opacity: 0.88,
              }}
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
