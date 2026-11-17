import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CareerNavigator() {
  const careers = [
    {
      passion: '🚲 Loves fixing bicycles & tractor gears',
      title: 'Robotics & Electric Vehicle Engineer',
      skills: ['Kinematics & Torque', 'Ohm’s Law & Motor Controllers', 'CAD Simulation'],
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
    {
      passion: '📱 Loves writing games, radio signals & phone antennas',
      title: 'Satellite & Telecommunications Specialist',
      skills: ['Electromagnetic Wave Spectrum', 'Python / Microcontroller Code', 'Signal Processing'],
      roadmap: 'Class 9-12 Math & Physics → ISRO / IIST / B.Tech ECE → Space & Telecom Scientist',
      villageImpact: 'Expand satellite internet coverage and monsoon disaster forecasting to remote villages.',
      color: '#6b5be6',
    },
  ];

  const [selectedCareer, setSelectedCareer] = useState(0);
  const active = careers[selectedCareer];

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#ffc531',
              border: '3px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={28} color="#17140d" strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>STEM Career Navigator</h3>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Connecting Village Curiosity to Real Careers</p>
          </div>
        </div>

        <span
          style={{
            backgroundColor: '#ffc531',
            padding: '4px 12px',
            borderRadius: 9999,
            border: '2px solid #17140d',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          FUTURE READINESS
        </span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, color: '#17140d' }}>
        Step 1: Select What You Enjoy Doing Most:
      </div>

      {/* Passion Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 24 }}>
        {careers.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelectedCareer(i)}
            style={{
              textAlign: 'left',
              padding: '12px 14px',
              borderRadius: 12,
              border: '2.5px solid #17140d',
              backgroundColor: selectedCareer === i ? c.color : '#f5efe2',
              color: selectedCareer === i && (c.color === '#ff5b57' || c.color === '#6b5be6') ? '#fff' : '#17140d',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 13.5,
              cursor: 'pointer',
              boxShadow: selectedCareer === i ? '3px 3px 0 #17140d' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            {c.passion}
          </button>
        ))}
      </div>

      {/* Career Blueprint Display */}
      <div
        style={{
          borderRadius: 16,
          border: '3px solid #17140d',
          padding: '24px',
          backgroundColor: '#ffffff',
          boxShadow: '5px 5px 0 #17140d',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ff5b57', marginBottom: 2 }}>
          Target Career Pathway:
        </div>
        <h4 style={{ fontSize: 24, color: '#17140d', marginBottom: 16 }}>
          {active.title}
        </h4>

        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#12b3a4' }}>
            Foundational Concepts to Master in School:
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            {active.skills.map((sk, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#f5efe2',
                  border: '2px solid #17140d',
                  borderRadius: 6,
                  padding: '3px 10px',
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                ✓ {sk}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#6b5be6' }}>
            Educational Roadmap:
          </span>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#333', marginTop: 4, lineHeight: 1.5 }}>
            {active.roadmap}
          </p>
        </div>

        <div style={{ borderTop: '2px dashed #17140d', paddingTop: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#ffc531' }}>
            Village & Community Impact:
          </span>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#17140d', marginTop: 4 }}>
            {active.villageImpact}
          </p>
        </div>
      </div>
    </div>
  );
}
