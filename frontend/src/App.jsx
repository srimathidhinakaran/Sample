import React, { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:4000/api'

function SignUp({ onSwitch }) {
  const [form, setForm] = useState({ username: '', id: '', name: '', password: '' })
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${API}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) setMsg(data.error || 'Signup failed')
    else setMsg('Account created — please sign in')
  }

  return (
    <div className="card">
      <h2>Sign Up</h2>
      <form onSubmit={submit}>
        <input placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
        <input placeholder="ID" value={form.id} onChange={e=>setForm({...form,id:e.target.value})} required />
        <input placeholder="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button type="submit">Create</button>
      </form>
      {msg && <div className="msg">{msg}</div>}
      <p>Have an account? <button onClick={onSwitch}>Sign in</button></p>
    </div>
  )
}

function SignIn({ onAuth, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    const res = await fetch(`${API}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) setMsg(data.error || 'Sign in failed')
    else onAuth(data)
  }

  return (
    <div className="card">
      <h2>Sign In</h2>
      <form onSubmit={submit}>
        <input placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required />
        <input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button type="submit">Sign in</button>
      </form>
      {msg && <div className="msg">{msg}</div>}
      <p>New? <button onClick={onSwitch}>Create account</button></p>
    </div>
  )
}

function Dashboard({ user, onSignOut }) {
  const [balance, setBalance] = useState(user.balance || 0)
  const [amount, setAmount] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=> setBalance(user.balance || 0), [user])

  async function transact(type) {
    setMsg('')
    const amt = Number(amount)
    if (!amt || amt <= 0) return setMsg('Enter a valid amount')
    const res = await fetch(`${API}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, type, amount: amt }),
    })
    const data = await res.json()
    if (!res.ok) setMsg(data.error || 'Transaction failed')
    else {
      setBalance(data.balance)
      setAmount('')
    }
  }

  return (
    <div className="card">
      <h2>Welcome "{user.username}"</h2>
      <p>Current balance: {balance}</p>
      <div>
        <input placeholder="amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={()=>transact('deposit')}>Deposit</button>
        <button onClick={()=>transact('withdraw')}>Withdraw</button>
      </div>
      {msg && <div className="msg">{msg}</div>}
      <button onClick={onSignOut}>Sign out</button>
    </div>
  )
}

function App() {
  const [view, setView] = useState('signin')
  const [user, setUser] = useState(null)

  function handleAuth(u) { setUser(u); setView('dashboard') }
  function signOut(){ setUser(null); setView('signin') }

  return (
    <div className="app-root">
      {view === 'signup' && <SignUp onSwitch={()=>setView('signin')} />}
      {view === 'signin' && <SignIn onAuth={handleAuth} onSwitch={()=>setView('signup')} />}
      {view === 'dashboard' && user && <Dashboard user={user} onSignOut={signOut} />}
    </div>
  )
}

export default App
