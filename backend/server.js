const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const DATA = path.join(__dirname, 'users.json')

app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

function readUsers(){
  if (!fs.existsSync(DATA)) return []
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8') || '[]') } catch(e){ return [] }
}
function writeUsers(u){ fs.writeFileSync(DATA, JSON.stringify(u, null, 2)) }

app.post('/api/signup', (req, res) => {
  const { username, id, name, password } = req.body || {}
  if (!username || !id || !name || !password) return res.status(400).json({ error: 'Missing fields' })
  const users = readUsers()
  if (users.find(x=>x.username===username)) return res.status(400).json({ error: 'Username exists' })
  const user = { username, id, name, password, balance: 0 }
  users.push(user)
  writeUsers(users)
  res.json({ ok: true })
})

app.post('/api/signin', (req, res) => {
  const { username, password } = req.body || {}
  const users = readUsers()
  const u = users.find(x=>x.username===username && x.password===password)
  if (!u) return res.status(401).json({ error: 'Invalid credentials or account not found' })
  const safe = { username: u.username, name: u.name, balance: u.balance }
  res.json(safe)
})

app.post('/api/transaction', (req, res) => {
  const { username, type, amount } = req.body || {}
  if (!username || !type || typeof amount !== 'number') return res.status(400).json({ error: 'Missing fields' })
  const users = readUsers()
  const idx = users.findIndex(x=>x.username===username)
  if (idx === -1) return res.status(404).json({ error: 'User not found' })
  if (type === 'deposit') users[idx].balance = Number(users[idx].balance) + amount
  else if (type === 'withdraw'){
    if (users[idx].balance < amount) return res.status(400).json({ error: 'Insufficient funds' })
    users[idx].balance = Number(users[idx].balance) - amount
  } else return res.status(400).json({ error: 'Invalid type' })
  writeUsers(users)
  res.json({ balance: users[idx].balance })
})

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log('Server running on', port))
