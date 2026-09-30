import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import '../auth.form.scss'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

// Attach token from localStorage to every request via Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const validatePassword = (pw) => {
  if (pw.length < 8) return 'At least 8 characters'
  if (!/[A-Z]/.test(pw)) return 'Needs an uppercase letter'
  if (!/[a-z]/.test(pw)) return 'Needs a lowercase letter'
  if (!/[0-9]/.test(pw)) return 'Needs a number'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) return 'Needs a special character'
  return null
}

const reqs = [
  { label: '8+ characters', test: pw => pw.length >= 8 },
  { label: 'Uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter', test: pw => /[a-z]/.test(pw) },
  { label: 'Number', test: pw => /[0-9]/.test(pw) },
  { label: 'Special character', test: pw => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw) },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] } })
}

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Please enter your email')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email address')
    setSubmitting(true)
    try {
      await api.post('/api/auth/forgot-password/send-otp', { email: email.trim().toLowerCase() })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code. Try again.')
    } finally { setSubmitting(false) }
  }

  const handleVerifyAndReset = async (e) => {
    e.preventDefault()
    setError('')
    if (!otp.trim() || otp.trim().length !== 6) return setError('Enter the 6-digit code')
    if (!newPassword) return setError('Enter a new password')
    const pwErr = validatePassword(newPassword)
    if (pwErr) return setError(pwErr)
    setSubmitting(true)
    try {
      await api.post('/api/auth/forgot-password/verify-reset', { email: email.trim(), otp: otp.trim(), newPassword })
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
    } finally { setSubmitting(false) }
  }

  const handleResend = async () => {
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/auth/forgot-password/send-otp', { email: email.trim() })
      setOtp('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="auth-root">
      <div className="auth-grid" />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
            </svg>
          </div>
          <span className="auth-brand__name">Prepzo AI</span>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Step 1: Email ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
              <div className="auth-header">
                <h1>Reset password</h1>
                <p>Enter your email and we'll send a verification code</p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleSendOtp} noValidate>
                <div className="field">
                  <label className="field__label">Email Address</label>
                  <div className="field__wrapper">
                    <span className="field__icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </span>
                    <input id="forgot-email" className="field__input" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError('') }} autoComplete="email" />
                  </div>
                </div>

                <motion.button type="submit" id="send-otp-btn" className="btn-primary" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  {submitting ? <><span className="spinner" /> Sending Code...</> : 'Send Verification Code'}
                </motion.button>
              </form>

              <p className="auth-links" style={{ marginTop: '1.5rem' }}>
                Remembered it? <Link to="/login">Sign in</Link>
              </p>
            </motion.div>
          )}

          {/* ── Step 2: OTP + New Password ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
              <div className="auth-header">
                <h1>Verify &amp; Reset</h1>
                <p>We sent a 6-digit code to <strong style={{ color: 'var(--accent-bright)' }}>{email}</strong></p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="auth-form" onSubmit={handleVerifyAndReset} noValidate>
                <div className="field">
                  <label className="field__label">Verification Code</label>
                  <div className="field__wrapper">
                    <span className="field__icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input
                      id="otp-code"
                      className="field__input"
                      type="text"
                      inputMode="numeric"
                      placeholder="123456"
                      value={otp}
                      onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                      maxLength={6}
                      autoComplete="one-time-code"
                      style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', fontSize: '1.1rem' }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field__label">New Password</label>
                  <div className="field__wrapper">
                    <span className="field__icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <input id="new-password" className="field__input field__input--pr" type={showPassword ? 'text' : 'password'} placeholder="MyPass@123" value={newPassword} onChange={e => { setNewPassword(e.target.value); setError('') }} autoComplete="new-password" />
                    <button type="button" className="field__toggle" onClick={() => setShowPassword(s => !s)} tabIndex={-1}>
                      {showPassword
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {newPassword && (
                    <motion.ul className="pwd-reqs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      {reqs.map(r => (
                        <li key={r.label} className={r.test(newPassword) ? 'met' : ''}>
                          {r.test(newPassword)
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                          }
                          {r.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>

                <motion.button type="submit" id="reset-password-btn" className="btn-primary" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  {submitting ? <><span className="spinner" /> Resetting...</> : 'Reset Password'}
                </motion.button>
              </form>

              <div className="auth-links" style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="auth-link-btn" onClick={() => { setStep(1); setError(''); setOtp(''); setNewPassword('') }}>← Back</button>
                <button className="auth-link-btn" onClick={handleResend} disabled={submitting}>Resend code</button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ textAlign: 'center', padding: '1rem 0' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                style={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05))',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </motion.div>

              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Password reset!</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Your password has been updated. You can now sign in with your new password.
              </p>

              <motion.button
                className="btn-primary"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Sign In
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
