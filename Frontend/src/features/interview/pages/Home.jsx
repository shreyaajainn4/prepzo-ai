import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import './home.css'

const Home = () => {
  const { loading, generateReport, reports } = useInterview()
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const isGuest = user?.isGuest

  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState([])
  const [generating, setGenerating] = useState(false)
  const resumeInputRef = useRef()

  // File handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedFile(file)
  }
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation() }
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (valid.includes(file.type)) {
        const dt = new DataTransfer(); dt.items.add(file)
        resumeInputRef.current.files = dt.files
        setSelectedFile(file)
      } else setErrors(['Please upload a PDF or DOCX file.'])
    }
  }
  const handleRemoveFile = (e) => {
    e.preventDefault(); e.stopPropagation()
    resumeInputRef.current.value = ''
    setSelectedFile(null)
  }

  const handleGenerateReport = async () => {
    const errs = []
    if (!jobDescription.trim()) errs.push('Paste a Job Description to continue.')
    const resumeFile = resumeInputRef.current.files[0]
    if (!resumeFile && !selfDescription.trim()) errs.push('Upload a Resume or add a Self Description.')
    if (errs.length) { setErrors(errs); return }

    setErrors([])
    setGenerating(true)
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      if (data) {
        if (data._id) navigate(`/interview/${data._id}`)
        else navigate('/interview/guest', { state: { report: data } })
      }
    } catch (err) {
      setErrors([err.message || 'Failed to generate. Please try again.'])
    } finally {
      setGenerating(false)
    }
  }

  const handleLogoutClick = async () => {
    await handleLogout()
    navigate('/login')
  }

  if (loading && !generating) {
    return (
      <div className="hp-shell">
        <div className="hp-ambient" />
        <motion.div className="hp-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="hp-loading__ring" />
          <p>Loading your workspace...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="hp-shell">
      {/* Ambient background */}
      <div className="hp-ambient" />
      <div className="hp-grid" />

      {/* ── Navbar ── */}
      <motion.nav
        className="hp-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hp-nav__brand">
          <div className="hp-nav__logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
            </svg>
          </div>
          <span className="hp-nav__name">Prepzo AI</span>
          <span className="hp-nav__badge">Beta</span>
        </div>
        <div className="hp-nav__right">
          <div className="hp-nav__user">
            <div className="hp-nav__avatar">{user?.username?.[0]?.toUpperCase() || 'G'}</div>
            <span className="hp-nav__username">{user?.username || 'Guest'}</span>
            {isGuest && <span className="hp-nav__guest">Guest</span>}
          </div>
          <motion.button
            className="hp-nav__logout"
            onClick={handleLogoutClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <motion.header
        className="hp-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hp-hero__eyebrow">
          <span className="hp-hero__dot" />
          AI-Powered Interview Intelligence
        </div>
        <h1 className="hp-hero__title">
          Build Your Winning<br />
          <span className="hp-hero__accent">Interview Strategy</span>
        </h1>
        <p className="hp-hero__sub">
          Let Prepzo AI analyze job requirements and your profile to craft a precision-targeted interview plan.
        </p>
      </motion.header>

      {/* ── Main Card ── */}
      <motion.div
        className="hp-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hp-card__glow" />

        <div className="hp-card__body">

          {/* Left Panel — Job Description */}
          <div className="hp-panel hp-panel--left">
            <div className="hp-panel__header">
              <div className="hp-panel__icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div className="hp-panel__title-row">
                <h2 className="hp-panel__title">Target Job Description</h2>
                <span className="hp-tag hp-tag--required">Required</span>
              </div>
            </div>
            <textarea
              className="hp-textarea"
              placeholder={"Paste the full job description here...\n\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
              maxLength={5000}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <div className="hp-char-count">
              <span style={{ color: jobDescription.length > 4500 ? 'var(--yellow)' : 'var(--text-muted)' }}>
                {jobDescription.length}
              </span>
              {' / 5000'}
            </div>
          </div>

          {/* Divider */}
          <div className="hp-divider" />

          {/* Right Panel — Profile */}
          <div className="hp-panel hp-panel--right">
            <div className="hp-panel__header">
              <div className="hp-panel__icon-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h2 className="hp-panel__title">Your Profile</h2>
            </div>

            {/* Upload */}
            <div className="hp-section">
              <div className="hp-section__label-row">
                <label className="hp-section__label">Upload Resume</label>
                <span className="hp-tag hp-tag--best">Best Results</span>
              </div>
              <motion.div
                className={`hp-dropzone${isDragging ? ' hp-dropzone--drag' : ''}${selectedFile ? ' hp-dropzone--filled' : ''}`}
                onClick={() => resumeInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                whileHover={{ borderColor: selectedFile ? undefined : 'rgba(236,72,153,0.4)' }}
                transition={{ duration: 0.2 }}
              >
                <AnimatePresence mode="wait">
                  {selectedFile ? (
                    <motion.div
                      key="file"
                      className="hp-dropzone__file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="hp-dropzone__file-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div className="hp-dropzone__file-info">
                        <p className="hp-dropzone__file-name">{selectedFile.name}</p>
                        <p className="hp-dropzone__file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button className="hp-dropzone__remove" onClick={handleRemoveFile}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="hp-dropzone__empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="hp-dropzone__upload-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                      </div>
                      <p className="hp-dropzone__title">Click to upload or drag &amp; drop</p>
                      <p className="hp-dropzone__sub">PDF or DOCX · Max 5MB</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input ref={resumeInputRef} onChange={handleFileChange} hidden type="file" id="resume" name="resume" accept=".pdf,.docx" />
              </motion.div>
            </div>

            {/* OR */}
            <div className="hp-or">
              <div className="hp-or__line" />
              <span className="hp-or__text">OR</span>
              <div className="hp-or__line" />
            </div>

            {/* Self Description */}
            <div className="hp-section">
              <label className="hp-section__label" htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                id="selfDescription"
                className="hp-textarea hp-textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
                onChange={e => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Info */}
            <div className="hp-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="hp-card__footer">
          <div className="hp-card__footer-left">
            <div className="hp-powered">
              <span className="hp-powered__dot" />
              <span>Prepzo AI</span>
            </div>

            {/* Errors */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  className="hp-errors"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.map((err, i) => (
                    <p key={i} className="hp-errors__msg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                      {err}
                    </p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            id="generate-btn"
            className={`hp-generate${generating ? ' hp-generate--loading' : ''}`}
            onClick={handleGenerateReport}
            disabled={generating}
            whileHover={!generating ? { scale: 1.02, y: -1 } : {}}
            whileTap={!generating ? { scale: 0.98 } : {}}
          >
            {generating ? (
              <>
                <div className="hp-generate__dots">
                  <span /><span /><span />
                </div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"/>
                </svg>
                Generate My Interview Strategy
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Recent Reports ── */}
      <AnimatePresence>
        {reports.length > 0 && (
          <motion.section
            className="hp-reports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="hp-reports__header">
              <h2 className="hp-reports__title">Recent Interview Plans</h2>
              <span className="hp-reports__count">{reports.length} plan{reports.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="hp-reports__grid">
              {reports.map((report, i) => (
                <motion.div
                  key={report._id}
                  className="hp-report-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  whileHover={{ y: -2, borderColor: 'rgba(236,72,153,0.3)' }}
                >
                  <div className="hp-report-card__top">
                    <div className="hp-report-card__icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div className={`hp-report-card__score hp-report-card__score--${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'mid' : 'low'}`}>
                      {report.matchScore}%
                    </div>
                  </div>
                  <h3 className="hp-report-card__title">{report.title || 'Untitled Position'}</h3>
                  <p className="hp-report-card__date">{new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <div className="hp-report-card__arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="hp-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <a href="#">Privacy Policy</a>
        <span>·</span>
        <a href="#">Terms of Service</a>
        <span>·</span>
        <a href="#">Help Center</a>
      </motion.footer>
    </div>
  )
}

export default Home