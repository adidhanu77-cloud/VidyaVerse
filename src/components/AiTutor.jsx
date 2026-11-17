import React, { useState } from 'react';
import { Bot, Volume2, Send, Sparkles, MessageCircle } from 'lucide-react';

export default function AiTutor({ currentLang }) {
  const defaultQuestions = [
    {
      q: 'Why does my bicycle pump get hot when pumping air?',
      a: 'Great question! When you rapidly compress air inside the pump cylinder, you perform mechanical work on the gas molecules. According to the First Law of Thermodynamics (Adiabatic Compression), this rapid work increases the internal kinetic energy of air molecules, generating heat that warms the metal barrel!',
    },
    {
      q: 'Why is the sky blue during the day and red/orange at sunset?',
      a: 'Rayleigh Scattering! Sunlight contains all spectrum colors. Blue light has a shorter wavelength and scatters strongly when hitting atmospheric nitrogen & oxygen molecules. At sunset, sunlight travels through a much thicker layer of atmosphere, scattering away blue light and leaving only longer red/orange wavelengths.',
    },
    {
      q: 'Why does ice float on water when most solids sink?',
      a: 'Anomalous expansion of water! When water cools below 4°C, hydrogen bonds form an open hexagonal crystal lattice. This makes ice ~9% less dense than liquid water, allowing ice to float so village lakes and ponds freeze only on top, keeping fish alive underneath!',
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
      a: `Socratic Step-by-Step Guidance:\n1. First, let's observe the natural forces or energy states involved.\n2. Consider conservation laws: Energy cannot be created or destroyed, only transformed.\n3. Notice how this same principle works in objects right around your village home!`,
    });
    setCustomInput('');
  };

  const handleSpeakAnswer = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeQuestion.a);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="memphis-card" style={{ padding: '36px 32px', backgroundColor: '#ffffff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: '#12b3a4',
              border: '3px solid #17140d',
              boxShadow: '4px 4px 0 #17140d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={28} color="#ffffff" strokeWidth={2.4} />
          </div>
          <div>
            <h3 style={{ fontSize: 26 }}>Dr. APJ Mentor — AI Tutor</h3>
            <p style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Mother-Tongue Socratic Science Companion</p>
          </div>
        </div>

        <span
          style={{
            backgroundColor: '#2bd980',
            padding: '4px 12px',
            borderRadius: 9999,
            border: '2px solid #17140d',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          ACTIVE & LISTENING
        </span>
      </div>

      {/* Preset Questions */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, color: '#17140d' }}>
          💡 Popular Village Science Doubts:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {defaultQuestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveQuestion(item)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 10,
                border: '2px solid #17140d',
                backgroundColor: activeQuestion.q === item.q ? '#ffc531' : '#f5efe2',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
            >
              💬 {item.q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Display Box */}
      <div
        style={{
          backgroundColor: '#17140d',
          color: '#ffffff',
          borderRadius: 16,
          padding: '20px 22px',
          border: '3px solid #17140d',
          marginBottom: 20,
        }}
      >
        <div style={{ color: '#ffc531', fontWeight: 800, fontSize: 14, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
          Student asks: "{activeQuestion.q}"
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: '#f5efe2', whiteSpace: 'pre-line' }}>
          {activeQuestion.a}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
          <button
            onClick={handleSpeakAnswer}
            className="btn-candy teal"
            style={{ padding: '6px 16px', fontSize: 13 }}
          >
            <Volume2 size={16} />
            {isSpeaking ? 'Reading Aloud...' : 'Listen in Audio'}
          </button>
        </div>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={handleAsk} style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Ask any science question (e.g. why does a pressure cooker whistle?)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: 9999,
            border: '2.5px solid #17140d',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn-candy primary"
          style={{ padding: '12px 22px', borderRadius: 9999, fontSize: 15 }}
        >
          <Send size={16} />
          Ask Mentor
        </button>
      </form>
    </div>
  );
}
