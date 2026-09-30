import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.055, duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  })
}

const getStrength = (pw) => {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) s++
  if (s <= 1) return { label: 'Weak', level: 1, cls: 'weak' }
  if (s === 2) return { label: 'Fair', level: 2, cls: 'medium' }
  if (s <= 4) return { label: 'Good', level: 3, cls: 'medium' }
  return { label: 'Strong', level: 4, cls: 'strong' }
}

const reqs = [
  { label: '8+ characters', test: pw => pw.length >= 8 },
  { label: 'Uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: pw => /[a-z]/.test(pw) },
  { label: 'Number', test: pw => /[0-9]/.test(pw) },
  { label: 'Special character', test: pw => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
]

const Register = () => {
  const navigate = useNavigate()
  const { loading, handleRegister } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!username.trim()) e.username = 'Username is required'
    else if (username.trim().length < 3) e.username = 'At least 3 characters'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8) e.password = 'At least 8 characters'
    else if (!/[A-Z]/.test(password)) e.password = 'Needs an uppercase letter'
    else if (!/[a-z]/.test(password)) e.password = 'Needs a lowercase letter'
    else if (!/[0-9]/.test(password)) e.password = 'Needs a number'
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) e.password = 'Needs a special character'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setApiError('')
    if (!validate()) return
    setSubmitting(true)
    const result = await handleRegister({ username: username.trim(), email: email.trim().toLowerCase(), password })
    setSubmitting(false)
    if (result.success) navigate('/')
    else setApiError(result.error)
  }

  const strength = password ? getStrength(password) : null

  if (loading) return (
    <div className="auth-root">
      <div className="auth-grid" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</motion.div>
    </div>
  )

  return (
    <div className="auth-root">
      <div className="auth-grid" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ maxWidth: 440 }}
      >
        {/* Brand */}
        <motion.div className="auth-brand" variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <div className="auth-brand__logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
            </svg>
          </div>
          <span className="auth-brand__name">Prepzo AI</span>
        </motion.div>

        <motion.div className="auth-header" variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <h1>Create your account</h1>
          <p>Join thousands preparing smarter with AI</p>
        </motion.div>

        <AnimatePresence>
          {apiError && (
            <motion.div className="auth-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <motion.div className="field" variants={fadeUp} custom={2} initial="hidden" animate="visible">
            <label className="field__label">Username</label>
            <div className="field__wrapper">
              <span className="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input id="register-username" className={`field__input${errors.username ? ' field__input--error' : ''}`} type="text" placeholder="cooluser123" value={username} onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })) }} autoComplete="username" />
            </div>
            <AnimatePresence>{errors.username && <motion.span className="field__error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>{errors.username}</motion.span>}</AnimatePresence>
          </motion.div>

          {/* Email */}
          <motion.div className="field" variants={fadeUp} custom={3} initial="hidden" animate="visible">
            <label className="field__label">Email</label>
            <div className="field__wrapper">
              <span className="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <input id="register-email" className={`field__input${errors.email ? ' field__input--error' : ''}`} type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }} autoComplete="email" />
            </div>
            <AnimatePresence>{errors.email && <motion.span className="field__error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>{errors.email}</motion.span>}</AnimatePresence>
          </motion.div>

          {/* Password */}
          <motion.div className="field" variants={fadeUp} custom={4} initial="hidden" animate="visible">
            <label className="field__label">Password</label>
            <div className="field__wrapper">
              <span className="field__icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input id="register-password" className={`field__input field__input--pr${errors.password ? ' field__input--error' : ''}`} type={showPassword ? 'text' : 'password'} placeholder="MyPass@123" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }} autoComplete="new-password" />
              <button type="button" className="field__toggle" onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                {showPassword
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            <AnimatePresence>{errors.password && <motion.span className="field__error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>{errors.password}</motion.span>}</AnimatePresence>

            {/* Strength */}
            {password && strength && (
              <motion.div className="pwd-strength" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="pwd-strength__bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`pwd-strength__bar${i <= strength.level ? ` pwd-strength__bar--${strength.cls}` : ''}`} />
                  ))}
                </div>
                <span className={`pwd-strength__label pwd-strength__label--${strength.cls}`}>{strength.label}</span>
              </motion.div>
            )}

            {/* Requirements */}
            {password && (
              <motion.ul className="pwd-reqs" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                {reqs.map(r => (
                  <motion.li key={r.label} className={r.test(password) ? 'met' : ''} layout>
                    {r.test(password)
                      ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                    }
                    {r.label}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>

          <motion.button type="submit" id="register-submit" className="btn-primary" disabled={submitting} variants={fadeUp} custom={5} initial="hidden" animate="visible" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            {submitting ? <><span className="spinner" /> Creating Account...</> : 'Create Account'}
          </motion.button>
        </form>

        <motion.p className="auth-links" style={{ marginTop: '1.5rem' }} variants={fadeUp} custom={6} initial="hidden" animate="visible">
          Already have an account? <Link to="/login">Sign in</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Register