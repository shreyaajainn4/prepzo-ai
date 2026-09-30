import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams, useLocation, Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import './interview.css'

const NAV_ITEMS = [
  {
    id: 'technical',
    label: 'Technical',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    )
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    )
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    )
  },
]

// ── Animated score ring ─────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const r = 44
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  const color = score >= 80 ? '#34d399' : score >= 60 ? '#fbbf24' : '#f87171'
  const bgColor = score >= 80 ? 'rgba(52,211,153,0.08)' : score >= 60 ? 'rgba(251,191,36,0.08)' : 'rgba(248,113,113,0.08)'
  const label = score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Work'

  return (
    <div className="ip-score">
      <p className="ip-score__label">Match Score</p>
      <div className="ip-score__ring-wrap" style={{ background: bgColor }}>
        <svg width="108" height="108" viewBox="0 0 108 108">
          <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <motion.circle
            cx="54" cy="54" r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '54px 54px', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="ip-score__inner">
          <motion.span
            className="ip-score__value"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            {score}
          </motion.span>
          <span className="ip-score__pct" style={{ color }}>%</span>
        </div>
      </div>
      <p className="ip-score__sub" style={{ color }}>{label}</p>
    </div>
  )
}

// ── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      className={`ip-qcard${open ? ' ip-qcard--open' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      layout
    >
      <button className="ip-qcard__header" onClick={() => setOpen(o => !o)}>
        <div className="ip-qcard__left">
          <span className="ip-qcard__num">Q{index + 1}</span>
          <p className="ip-qcard__question">{item.question}</p>
        </div>
        <motion.span
          className="ip-qcard__chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="ip-qcard__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="ip-qcard__inner">
              <div className="ip-qcard__section ip-qcard__section--intent">
                <div className="ip-qcard__tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Interviewer's Intent
                </div>
                <p>{item.intention}</p>
              </div>
              <div className="ip-qcard__section ip-qcard__section--answer">
                <div className="ip-qcard__tag ip-qcard__tag--answer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Model Answer
                </div>
                <p>{item.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Roadmap Day ───────────────────────────────────────────────────────────────
const RoadmapDay = ({ day, index }) => (
  <motion.div
    className="ip-rday"
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="ip-rday__line-wrap">
      <div className="ip-rday__dot" />
      {true && <div className="ip-rday__line" />}
    </div>
    <div className="ip-rday__content">
      <div className="ip-rday__header">
        <span className="ip-rday__badge">Day {day.day}</span>
        <h3 className="ip-rday__focus">{day.focus}</h3>
      </div>
      <ul className="ip-rday__tasks">
        {day.tasks.map((task, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + i * 0.04 + 0.1 }}
          >
            <span className="ip-rday__bullet" />
            {task}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.div>
)

// ── Main Interview Component ───────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical')
  const { report: savedReport, loading, getResumePdf } = useInterview()
  const { interviewId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, handleLogout } = useAuth()
  const isGuest = interviewId === 'guest'
  const guestReport = location.state?.report
  const report = isGuest ? guestReport : savedReport

  const handleLogoutClick = async () => {
    await handleLogout()
    navigate('/login')
  }

  if ((loading || !report) && !isGuest) {
    return (
      <div className="ip-shell">
        <div className="ip-ambient" />
        <motion.div className="ip-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="ip-loading__ring" />
          <p>Building your interview plan...</p>
          <span>AI is analyzing your profile</span>
        </motion.div>
      </div>
    )
  }

  if (isGuest && !guestReport) {
    return (
      <div className="ip-shell">
        <div className="ip-ambient" />
        <div className="ip-loading">
          <p style={{ color: 'var(--text-secondary)' }}>Something went wrong. <Link to="/" style={{ color: 'var(--accent-bright)' }}>Go back</Link></p>
        </div>
      </div>
    )
  }

  const currentItems = activeNav === 'technical'
    ? report.technicalQuestions
    : activeNav === 'behavioral'
    ? report.behavioralQuestions
    : report.preparationPlan

  return (
    <div className="ip-shell">
      <div className="ip-ambient" />
      <div className="ip-grid" />

      {/* ── Guest Banner ── */}
      <AnimatePresence>
        {isGuest && (
          <motion.div
            className="ip-guest-banner"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="ip-guest-banner__left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>You're in <strong>Guest Mode</strong> — results won't be saved.</span>
            </div>
            <Link to="/register" className="ip-guest-banner__cta">Create Free Account →</Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navbar ── */}
      <motion.nav
        className="ip-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="ip-nav__left">
          <Link to="/" className="ip-nav__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Dashboard
          </Link>
          <div className="ip-nav__sep" />
          <div className="ip-nav__brand">
            <div className="ip-nav__logo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
            <span className="ip-nav__name">Prepzo AI</span>
          </div>
        </div>

        <div className="ip-nav__center">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`ip-nav__tab${activeNav === item.id ? ' ip-nav__tab--active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              {item.icon}
              {item.label}
              {activeNav === item.id && (
                <motion.div className="ip-nav__tab-indicator" layoutId="tab-indicator" />
              )}
            </button>
          ))}
        </div>

        <div className="ip-nav__right">
          {!isGuest && (
            <motion.button
              className="ip-nav__download"
              onClick={() => getResumePdf(interviewId)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Resume PDF
            </motion.button>
          )}
          <motion.button
            className="ip-nav__logout"
            onClick={handleLogoutClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Layout ── */}
      <div className="ip-layout">

        {/* ── Sidebar ── */}
        <motion.aside
          className="ip-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Score Ring */}
          <ScoreRing score={report.matchScore} />

          <div className="ip-sidebar__sep" />

          {/* Job Title */}
          <div className="ip-sidebar__section">
            <p className="ip-sidebar__section-label">Position</p>
            <p className="ip-sidebar__title">{report.title || 'Interview Plan'}</p>
          </div>

          <div className="ip-sidebar__sep" />

          {/* Stats */}
          <div className="ip-sidebar__stats">
            {[
              { label: 'Technical Qs', value: report.technicalQuestions.length, nav: 'technical' },
              { label: 'Behavioral Qs', value: report.behavioralQuestions.length, nav: 'behavioral' },
              { label: 'Day Plan', value: report.preparationPlan.length, nav: 'roadmap', suffix: 'd' },
            ].map(s => (
              <motion.button
                key={s.label}
                className={`ip-stat${activeNav === s.nav ? ' ip-stat--active' : ''}`}
                onClick={() => setActiveNav(s.nav)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="ip-stat__value">{s.value}{s.suffix || ''}</span>
                <span className="ip-stat__label">{s.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="ip-sidebar__sep" />

          {/* Skill Gaps */}
          <div className="ip-sidebar__section">
            <p className="ip-sidebar__section-label">Skill Gaps</p>
            <div className="ip-skills">
              {report.skillGaps.map((gap, i) => (
                <motion.span
                  key={i}
                  className={`ip-skill ip-skill--${gap.severity}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  {gap.skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* ── Main Content ── */}
        <main className="ip-content">
          <AnimatePresence mode="wait">
            {(activeNav === 'technical' || activeNav === 'behavioral') && (
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="ip-content__header">
                  <div>
                    <h2 className="ip-content__title">
                      {activeNav === 'technical' ? 'Technical Questions' : 'Behavioral Questions'}
                    </h2>
                    <p className="ip-content__sub">
                      Click any question to reveal the interviewer's intent and a model answer.
                    </p>
                  </div>
                  <span className="ip-content__count">
                    {activeNav === 'technical' ? report.technicalQuestions.length : report.behavioralQuestions.length} questions
                  </span>
                </div>
                <div className="ip-qlist">
                  {(activeNav === 'technical' ? report.technicalQuestions : report.behavioralQuestions).map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeNav === 'roadmap' && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="ip-content__header">
                  <div>
                    <h2 className="ip-content__title">Preparation Roadmap</h2>
                    <p className="ip-content__sub">Your day-by-day preparation plan to ace the interview.</p>
                  </div>
                  <span className="ip-content__count">{report.preparationPlan.length}-day plan</span>
                </div>
                <div className="ip-roadmap">
                  {report.preparationPlan.map((day, i) => (
                    <RoadmapDay key={day.day} day={day} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Interview