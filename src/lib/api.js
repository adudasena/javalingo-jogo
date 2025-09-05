// src/lib/api.js
const BASE = 'http://127.0.0.1:4000';

// ---- Mock no localStorage ----
const KEY = 'mockUsers';

function loadUsers(){
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function saveUsers(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }

// <- garante que sempre exista o usuário demo (name/email iguais e senha 123456)
function ensureDemo(){
  const users = loadUsers();
  const hasDemo = users.some(u =>
    u.name.toLowerCase() === 'demo' || u.email.toLowerCase() === 'demo@demo'
  );
  if (!hasDemo){
    users.push({
      id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
      name: 'demo',
      email: 'demo@demo',
      pass_hash: '123456',              // mock (sem hash)
      created_at: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function mockSignup({ name, email, pass } = {}){
  ensureDemo();
  const users = loadUsers();

  if (!name?.trim() || !email?.trim() || !pass?.trim()) { const e = new Error('Dados inválidos.'); e.status=400; throw e; }
  if (pass.length < 6) { const e = new Error('Senha curta.'); e.status=400; throw e; }
  if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) { const e = new Error('E-mail já cadastrado.'); e.status=409; throw e; }
  if (users.some(u => u.name.toLowerCase()  === name.trim().toLowerCase()))  { const e = new Error('Nome já cadastrado.');  e.status=409; throw e; }

  const u = {
    id: users.length ? Math.max(...users.map(x => x.id)) + 1 : 1,
    name: name.trim(),
    email: email.trim(),
    pass_hash: pass, // mock
    created_at: new Date().toISOString()
  };
  users.push(u); saveUsers(users);
  const pub = (({id,name,email,created_at})=>({id,name,email,created_at}))(u);
  return { ok:true, user: pub };
}

function mockLogin(payload = {}){
  ensureDemo();
  const { email, name, nameOrEmail, pass } = payload;
  const ident = (email || name || nameOrEmail || '').trim().toLowerCase();
  if (!ident || !pass){ const e = new Error('Informe usuário/e-mail e senha.'); e.status=400; throw e; }

  const users = loadUsers();
  const u = users.find(x =>
    x.email.toLowerCase() === ident || x.name.toLowerCase() === ident
  );
  if (!u || u.pass_hash !== pass){ const e = new Error('Credenciais inválidas.'); e.status=401; throw e; }

  const pub = (({id,name,email,created_at})=>({id,name,email,created_at}))(u);
  return { ok:true, user: pub };
}

// ---- Request com fallback robusto ----
async function request(method, path, body) {
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch {}
    if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    const isNetworkErr = err?.name === 'TypeError' || /Failed to fetch|NetworkError|ERR_CONNECTION/i.test(String(err));
    const isSignup = path.includes('/api/signup') && method.toUpperCase() === 'POST';
    const isLogin  = path.includes('/api/login')  && method.toUpperCase() === 'POST';

    if (isNetworkErr && isSignup) return mockSignup(body || {});
    if (isNetworkErr && isLogin)  return mockLogin(body || {});
    throw err;
  }
}

export const Api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
};
