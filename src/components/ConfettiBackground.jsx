import React from 'react';

export default function ConfettiBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* 1. Coral Triangle */}
      <svg
        className="anim-drift"
        style={{ position: 'absolute', top: '8%', left: '4%', width: 44, height: 44 }}
        viewBox="0 0 100 100"
      >
        <polygon points="50,12 90,88 10,88" fill="#ff5b57" stroke="#17140d" strokeWidth="8" strokeLinejoin="round" />
      </svg>

      {/* 2. Teal Quarter-Arc */}
      <svg
        className="anim-bob"
        style={{ position: 'absolute', top: '18%', right: '7%', width: 56, height: 56 }}
        viewBox="0 0 100 100"
      >
        <path d="M 15 85 A 70 70 0 0 1 85 15 L 85 85 Z" fill="#12b3a4" stroke="#17140d" strokeWidth="8" strokeLinejoin="round" />
      </svg>

      {/* 3. Mustard Dotted Circle */}
      <svg
        className="anim-spin-slow"
        style={{ position: 'absolute', top: '42%', left: '2%', width: 62, height: 62 }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="#ffc531" stroke="#17140d" strokeWidth="7" strokeDasharray="14 10" />
      </svg>

      {/* 4. Violet Spinning Plus Sign */}
      <svg
        className="anim-spin-slow"
        style={{ position: 'absolute', top: '65%', right: '4%', width: 48, height: 48 }}
        viewBox="0 0 100 100"
      >
        <path
          d="M 38 10 L 62 10 L 62 38 L 90 38 L 90 62 L 62 62 L 62 90 L 38 90 L 38 62 L 10 62 L 10 38 L 38 38 Z"
          fill="#6b5be6"
          stroke="#17140d"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>

      {/* 5. Black Squiggle 'Bacteria' Line */}
      <svg
        className="anim-sway"
        style={{ position: 'absolute', top: '80%', left: '8%', width: 70, height: 40 }}
        viewBox="0 0 120 60"
      >
        <path
          d="M 10 30 Q 35 5 60 30 T 110 30"
          fill="none"
          stroke="#17140d"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>

      {/* 6. Mustard Half-Circle */}
      <svg
        className="anim-drift"
        style={{ position: 'absolute', top: '30%', right: '32%', width: 50, height: 30 }}
        viewBox="0 0 100 60"
      >
        <path d="M 10 50 A 40 40 0 0 1 90 50 Z" fill="#ffc531" stroke="#17140d" strokeWidth="8" strokeLinejoin="round" />
      </svg>

      {/* 7. Solid Teal Dot */}
      <div
        className="anim-pulse"
        style={{
          position: 'absolute',
          top: '52%',
          left: '48%',
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: '#12b3a4',
          border: '3px solid #17140d',
        }}
      />

      {/* 8. Sky-Blue Zigzag */}
      <svg
        className="anim-bob"
        style={{ position: 'absolute', top: '72%', left: '38%', width: 60, height: 30 }}
        viewBox="0 0 120 50"
      >
        <polyline
          points="10,40 35,10 60,40 85,10 110,40"
          fill="none"
          stroke="#3aa0ff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 9. Coral Striped Circle */}
      <svg
        className="anim-spin-slow"
        style={{ position: 'absolute', top: '88%', right: '22%', width: 54, height: 54 }}
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="terrazzo-stripe" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke="#17140d" strokeWidth="6" />
          </pattern>
        </defs>
        <circle cx="50" cy="50" r="42" fill="#ff5b57" stroke="#17140d" strokeWidth="7" />
        <circle cx="50" cy="50" r="42" fill="url(#terrazzo-stripe)" />
      </svg>
    </div>
  );
}
