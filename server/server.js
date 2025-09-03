const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: false }));

const db = new Database('./data.sqlite');
db.pragma('journal_mode = WAL');

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`).run();

function nowISO() { return new Date().toISOString(); }
function isEmail(v) { return typeof v === 'string' && v.includes('@'); }

app.post('/api/signup', (req, res) => {
  try {
    const { name, email, pass } = req.body || {};
    if (!name || !email || !pass) return res.status(400).json({ error: 'Campos obrigatórios: name, email, pass.' });
    if (pass.length < 6) return res.status(400).json({ error: 'Senha precisa ter ao menos 6 caracteres.' });

    const exists = db.prepare('SELECT id FROM users WHERE LOWER(name)=LOWER(?) OR LOWER(email)=LOWER(?)').get(name, email);
    if (exists) return res.status(409).json({ error: 'Já existe um usuário com esse nome ou e-mail.' });

    const pass_hash = bcrypt.hashSync(pass, 10);
    db.prepare('INSERT INTO users(name, email, pass_hash, created_at) VALUES(?,?,?,?)')
      .run(name.trim(), email.trim(), pass_hash, nowISO());

    return res.json({ ok: true, user: { name: name.trim(), email: email.trim() } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao cadastrar.' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { nameOrEmail, pass } = req.body || {};
    if (!nameOrEmail || !pass) return res.status(400).json({ error: 'Campos obrigatórios: nameOrEmail, pass.' });

    const by = isEmail(nameOrEmail) ? 'email' : 'name';
    const row = db
      .prepare(`SELECT id, name, email, pass_hash FROM users WHERE LOWER(${by}) = LOWER(?)`)
      .get(nameOrEmail.trim());

    if (!row) return res.status(404).json({ error: 'Usuário/e-mail não encontrado.' });

    const ok = bcrypt.compareSync(pass, row.pass_hash);
    if (!ok) return res.status(401).json({ error: 'Senha incorreta.' });

    return res.json({ ok: true, user: { name: row.name, email: row.email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erro ao entrar.' });
  }
});

// debug opcional
app.get('/api/users', (req, res) => {
  const list = db.prepare('SELECT id, name, email, created_at FROM users ORDER BY id DESC').all();
  res.json({ users: list });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('JavaLingo API on http://localhost:' + PORT);
});

app.get('/', (req, res) => {
  res.send('JavaLingo API OK');
});
