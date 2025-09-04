// server/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: false }));

// 🔒 Caminho absoluto do arquivo do banco (não depende de onde você roda o node)
const DB_PATH = path.resolve(__dirname, 'data.sqlite');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('DB file:', DB_PATH); // ← loga IMEDIATAMENTE onde o arquivo está

// ✅ Schema idempotente
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL COLLATE NOCASE UNIQUE,
    email      TEXT NOT NULL COLLATE NOCASE UNIQUE,
    pass_hash  TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_users_name  ON users(name);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`);

function nowISO(){ return new Date().toISOString(); }
function isEmail(v){ return typeof v === 'string' && v.includes('@'); }
function getUserBy(field, value){
  const col = field === 'email' ? 'email' : 'name';
  return db.prepare(`SELECT id,name,email,pass_hash FROM users WHERE ${col} = ?`)
           .get(String(value || '').trim());
}

// 🔎 Healthcheck pra depurar conexão e arquivo
app.get('/health', (req,res)=>{
  try{
    const c = db.prepare('SELECT COUNT(1) c FROM users').get().c;
    res.json({ ok:true, dbPath: DB_PATH, users: c });
  }catch(e){
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Cadastro
app.post('/api/signup', (req,res)=>{
  try{
    const { name, email, pass } = req.body || {};
    if(!name || !email || !pass)
      return res.status(400).json({ error: 'Campos obrigatórios: name, email, pass.' });
    if(pass.length < 6)
      return res.status(400).json({ error: 'Senha precisa ter ao menos 6 caracteres.' });

    const exists = db.prepare('SELECT id FROM users WHERE name = ? OR email = ?')
                     .get(name, email);
    if(exists) return res.status(409).json({ error: 'Já existe um usuário com esse nome ou e-mail.' });

    const pass_hash = bcrypt.hashSync(pass, 10);
    db.prepare('INSERT INTO users(name,email,pass_hash,created_at) VALUES (?,?,?,?)')
      .run(name.trim(), email.trim(), pass_hash, nowISO());

    res.json({ ok:true, user:{ name: name.trim(), email: email.trim() } });
  }catch(e){
    console.error('SIGNUP_ERR:', e);
    res.status(500).json({ error:'Erro ao cadastrar.' });
  }
});

// Login
app.post('/api/login', (req,res)=>{
  try{
    const { nameOrEmail, pass } = req.body || {};
    if(!nameOrEmail || !pass)
      return res.status(400).json({ error: 'Campos obrigatórios: nameOrEmail, pass.' });

    const field = isEmail(nameOrEmail) ? 'email' : 'name';
    const row = getUserBy(field, nameOrEmail);
    if(!row) return res.status(404).json({ error:'Usuário/e-mail não encontrado.' });

    const ok = bcrypt.compareSync(pass, row.pass_hash);
    if(!ok) return res.status(401).json({ error:'Senha incorreta.' });

    res.json({ ok:true, user:{ name: row.name, email: row.email } });
  }catch(e){
    console.error('LOGIN_ERR:', e);
    res.status(500).json({ error:'Erro ao entrar.' });
  }
});

// Debug opcional
app.get('/api/users', (req,res)=>{
  const list = db.prepare('SELECT id,name,email,created_at FROM users ORDER BY id DESC').all();
  res.json({ users: list });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
  console.log('JavaLingo API on http://localhost:' + PORT);
});
