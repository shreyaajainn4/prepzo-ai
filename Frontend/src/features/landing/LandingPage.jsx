import React, { useState, useEffect } from 'react'
import {
  BrainCircuit,
  ChevronDown,
  Star,
  Mic,
  BarChart3,
  Map,
  MessageSquare
} from 'lucide-react'
import './landing.css'

const tabs = [
  { key: 'practice', label: 'Practice', icon: Mic },
  { key: 'analyse', label: 'Analyse', icon: BarChart3 },
  { key: 'roadmap', label: 'Roadmap', icon: Map },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare }
]

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('practice')

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const idx = tabs.findIndex(t => t.key === prev)
        return tabs[(idx + 1) % tabs.length].key
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ── NAVIGATION ── */}
        <nav
          className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          {/* Left */}
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 fill-black" />
            <span className="text-lg font-semibold">Prepzo.ai</span>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center gap-8">
            <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">
              Features <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-black transition-colors">
              For Teams <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">Pricing</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">Resources</a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors">Login</a>
            <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Start Free Prep
            </button>
          </div>
        </nav>

        {/* ── HERO SECTION ── */}
        <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center">

          {/* Reviews Badge */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.2s', opacity: 0 }}
          >
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
                <Star className="w-3.5 h-3.5 fill-black stroke-black" />
              </div>
              <span className="text-sm font-medium text-black">
                4.8 rating from 12K+ candidates
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.3s', opacity: 0 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5">
              Prep Smarter. Interview Better.
              <br />
              <span className="bg-gradient-to-r from-black via-gray-500 to-gray-400 bg-clip-text text-transparent">
                AI Coaches You to Win.
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            Personalized AI coaching that adapts to your role, identifies skill gaps,
            and builds your confidence before the real interview.
          </p>

          {/* CTA Button */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.5s', opacity: 0 }}
          >
            <button className="bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors mb-12">
              Begin Free Prep
            </button>
          </div>

          {/* ── Tab Bar ── */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.6s', opacity: 0 }}
          >
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1">
                {/* Mobile: 2x2 grid */}
                <div className="grid grid-cols-2 gap-1 md:hidden">
                  {tabs.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-white text-black shadow-sm'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Desktop: row with dividers */}
                <div className="hidden md:flex items-center">
                  {tabs.map((tab, i) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.key
                    return (
                      <React.Fragment key={tab.key}>
                        {i > 0 && <div className="w-px h-5 bg-gray-300" />}
                        <button
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-white text-black shadow-sm'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Video + Overlay Section ── */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.7s', opacity: 0 }}
          >
            <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[500px]">
              <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_165750_358b1e72-c921-48b7-aaac-f200994f32fb.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Practice Overlay */}
              {activeTab === 'practice' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in-overlay">
                  <div className="bg-white rounded-2xl p-6 w-[340px] shadow-xl animate-slide-up-overlay">
                    <h3 className="text-lg font-semibold mb-1">Mock Interview Session</h3>
                    <p className="text-sm text-gray-500 mb-4">Step-by-step guided practice</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                    <div className="space-y-3">
                      {['Choose Role', 'Select Difficulty', 'Answer Questions', 'Get Feedback'].map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            i < 2 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {i + 1}
                          </div>
                          <span className={`text-sm ${i < 2 ? 'text-black font-medium' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analyse Overlay */}
              {activeTab === 'analyse' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in-overlay">
                  <div className="bg-white rounded-2xl p-6 w-[340px] shadow-xl animate-slide-up-overlay">
                    <h3 className="text-lg font-semibold mb-1">Skill Gap Analysis</h3>
                    <p className="text-sm text-gray-500 mb-4">Your performance breakdown</p>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Communication', value: 85 },
                        { name: 'Technical', value: 72 },
                        { name: 'Confidence', value: 68 },
                        { name: 'Clarity', value: 90 }
                      ].map(metric => (
                        <div key={metric.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{metric.name}</span>
                            <span className="font-medium">{metric.value}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${metric.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Roadmap Overlay */}
              {activeTab === 'roadmap' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in-overlay">
                  <div className="bg-white rounded-2xl p-6 w-[340px] shadow-xl animate-slide-up-overlay">
                    <h3 className="text-lg font-semibold mb-1">Your Prep Roadmap</h3>
                    <p className="text-sm text-gray-500 mb-4">Track your progress</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-sm text-green-600 font-medium">On track</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        'Resume reviewed',
                        'Behavioral questions done',
                        'Technical round complete',
                        'Final prep done'
                      ].map((item, i) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            i < 3 ? 'bg-green-500 border-green-500' : 'border-gray-300'
                          }`}>
                            {i < 3 && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${i < 3 ? 'text-black line-through' : 'text-gray-600'}`}>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Overlay */}
              {activeTab === 'feedback' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in-overlay">
                  <div className="bg-white rounded-2xl p-6 w-[340px] shadow-xl animate-slide-up-overlay">
                    <h3 className="text-lg font-semibold mb-1">Interview Feedback</h3>
                    <p className="text-sm text-gray-500 mb-4">Detailed performance report</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Answer Quality', value: '88%', color: 'text-green-600' },
                        { label: 'Body Language', value: '74%', color: 'text-yellow-600' },
                        { label: 'Filler Words', value: '12', color: 'text-red-500' },
                        { label: 'Overall Score', value: '82%', color: 'text-blue-600' }
                      ].map(card => (
                        <div key={card.label} className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                      View Full Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Company Logos ── */}
          <div
            className="mt-24 animate-fade-in-up"
            style={{ animationDelay: '0.8s', opacity: 0 }}
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">
              Trusted by candidates hired at
            </p>
            <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
              {/* Google */}
              <span className="text-xl font-medium tracking-wide text-gray-300">GOOGLE</span>
              {/* Microsoft */}
              <span className="text-xl font-medium tracking-wide text-gray-300">MICROSOFT</span>
              {/* Infosys (dot grid) */}
              <div className="flex items-center gap-1.5 text-gray-300">
                <div className="grid grid-cols-3 gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-gray-300" />
                  ))}
                </div>
                <span className="text-lg font-medium tracking-wide ml-1">Infosys</span>
              </div>
              {/* TCS (serif italic) */}
              <span className="text-xl font-medium tracking-wide text-gray-300 italic" style={{ fontFamily: 'serif' }}>TCS</span>
              {/* Amazon (AZ circle) */}
              <div className="flex items-center gap-1.5 text-gray-300">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">
                  AZ
                </div>
                <span className="text-xl font-medium tracking-wide">AMAZON</span>
              </div>
              {/* Stripe (dots) */}
              <div className="flex items-center gap-1.5 text-gray-300">
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  ))}
                </div>
                <span className="text-xl font-medium tracking-wide ml-1">stripe</span>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  )
}

export default LandingPage
