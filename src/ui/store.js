// Sauvegarde locale (dans ce navigateur) : graine de chaque série et réponses en cours.
const KEY = 'calcul-litteral-v1';

export function loadStore() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    if (data && typeof data === 'object' && data.series && typeof data.series === 'object') return {series: data.series, master: data.master || null};
  } catch { /* stockage indisponible ou abîmé */ }
  return {series: {}, master: null};
}

export function saveStore(store) {
  try { localStorage.setItem(KEY, JSON.stringify(store)); return true; } catch { return false; }
}

export const newSeed = () => Math.floor(Math.random() * 1e6) + 1;
