import React from 'react';
import { Microscope, Heart, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#f5efe2',
        borderTop: '3px solid #17140d',
        padding: 'clamp(36px, 5vw, 60px) 0 88px 0',
      }}
    >
      <div className="container-1440">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 40,
            marginBottom: 48,
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  backgroundColor: '#ffc531',
                  borderRadius: 10,
                  border: '3px solid #17140d',
                  boxShadow: '3px 3px 0 #17140d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Microscope size={22} color="#17140d" strokeWidth={2.6} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>
                Vidya<span style={{ color: '#ff5b57' }}>Verse</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, maxWidth: 300 }}>
              The pocket science lab turning every rural home, village, and bicycle into an interactive STEM discovery environment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 16, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Features
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, fontWeight: 700 }}>
              <li><a href="#scanner" style={{ color: '#17140d', textDecoration: 'none' }}>AI Object Scanner</a></li>
              <li><a href="#labs" style={{ color: '#17140d', textDecoration: 'none' }}>Virtual Science Labs</a></li>
              <li><a href="#hunt" style={{ color: '#17140d', textDecoration: 'none' }}>STEM Treasure Hunt</a></li>
              <li><a href="#careers" style={{ color: '#17140d', textDecoration: 'none' }}>Dr. APJ Mentor</a></li>
            </ul>
          </div>

          {/* Vernacular Languages */}
          <div>
            <h4 style={{ fontSize: 16, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Supported Languages
            </h4>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['ಕನ್ನಡ (Kannada)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'தமிழ் (Tamil)', 'मराठी (Marathi)', 'English'].map((lang, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #17140d',
                    padding: '4px 10px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Mission Note */}
          <div>
            <div
              style={{
                backgroundColor: '#ffc531',
                padding: '16px 20px',
                borderRadius: 14,
                border: '3px solid #17140d',
                boxShadow: '4px 4px 0 #17140d',
              }}
            >
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
                100% Free & Open Initiative
              </h5>
              <p style={{ fontSize: 12, color: '#17140d', fontWeight: 600, lineHeight: 1.5 }}>
                Designed for grassroots schools under Sarva Shiksha Abhiyan & Atal Tinkering Labs to democratize hands-on science.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '2px dashed #17140d',
            paddingTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
            fontWeight: 700,
            color: '#666',
          }}
        >
          <div>
            © {new Date().getFullYear()} VidyaVerse. Made with <Heart size={14} color="#ff5b57" style={{ display: 'inline', verticalAlign: 'middle' }} /> for rural student empowerment.
          </div>
          <div>
            Memphis Neo-Brutalist Edition • Accessible on Any Device
          </div>
        </div>
      </div>
    </footer>
  );
}
