export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const api = {
  // 1. Scanner Backend
  async scanObject(objectId, customName, language = 'en', extra = {}) {
    try {
      const res = await fetch(`${API_BASE}/scanner/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objectId,
          customName,
          language,
          imageFrame: extra.imageFrame || null,
          mediaType: extra.mediaType || 'camera',
          filename: extra.filename || null,
        }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 2. Virtual Labs Simulation Backend
  async simulatePhysicsCircuit(voltage, resistance, isSwitchClosed) {
    try {
      const res = await fetch(`${API_BASE}/labs/physics/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voltage, resistance, isSwitchClosed }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  async simulateChemistryReaction(indicator, reagent) {
    try {
      const res = await fetch(`${API_BASE}/labs/chemistry/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator, reagent }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 3. Treasure Hunt Backend
  async submitTreasureHunt(missionId, foundItemIds, schoolName) {
    try {
      const res = await fetch(`${API_BASE}/treasure-hunt/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId, foundItemIds, schoolName }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 4. AI Tutor Socratic Backend
  async askTutor(question, language = 'en') {
    try {
      const res = await fetch(`${API_BASE}/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 5. STEM Career Navigator Backend
  async getCareerRoadmap(studentInterests) {
    try {
      const res = await fetch(`${API_BASE}/careers/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentInterests }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 6. Analytics & Leaderboard Backend
  async getLeaderboard() {
    try {
      const res = await fetch(`${API_BASE}/analytics/leaderboard`);
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },

  // 7. PhET Virtual Labs - Get simulations by discipline
  async getPhetSimulations(discipline = 'physics') {
    try {
      const res = await fetch(`${API_BASE}/labs/phet/${discipline}`);
      return await res.json();
    } catch (err) {
      console.warn('PhET API fallback:', err);
      return null;
    }
  },

  async getPhetCatalog() {
    try {
      const res = await fetch(`${API_BASE}/labs/phet-catalog`);
      return await res.json();
    } catch (err) {
      console.warn('PhET catalog fallback:', err);
      return null;
    }
  },

  // 8. Separate User Backend (Personal Dashboard architecture)
  async getUserDashboard(role = 'student', id = 'student_01') {
    try {
      const res = await fetch(`${API_BASE}/user/${role}/${id}`);
      return await res.json();
    } catch (err) {
      console.warn('API fetch fallback:', err);
      return null;
    }
  },
};
