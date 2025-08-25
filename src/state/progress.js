const KEY = 'javalingo_progress_v1';

function loadAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function saveAll(all) { localStorage.setItem(KEY, JSON.stringify(all)); }

export function getProgress(user = 'demo') {
  const all = loadAll();
  if (!all[user]) {
    all[user] = { highestUnlocked: 1, completed: [] }; // 1 já liberado
    saveAll(all);
  }
  return all[user];
}

export function completeLevel(level, user = 'demo') {
  const all = loadAll();
  const p = getProgress(user);
  if (!p.completed.includes(level)) p.completed.push(level);
  if (p.highestUnlocked < 30 && p.highestUnlocked <= level) {
    p.highestUnlocked = level + 1; // libera o próximo
  }
  all[user] = p; saveAll(all);
  return p;
}
