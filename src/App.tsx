import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Showcases } from './pages/Showcases'
import './App.css'

function App() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [isDark, setIsDark] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption: string } | null>(null)
  const [currentPage, setCurrentPage] = useState<'home' | 'showcases'>('home')
  const [copied, setCopied] = useState(false)
  const [activeScreenshot, setActiveScreenshot] = useState(0)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [termsContent, setTermsContent] = useState<string | null>(null)
  const [termsLoading, setTermsLoading] = useState(false)
  const [termsError, setTermsError] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const mcpBaseUrl = "http://91.99.186.83:7284/mcp"
  const mcpTermsUrl = mcpBaseUrl.replace(/\/mcp\/?$/, '') + '/terms'

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsDark(savedTheme === 'dark');
  }, [])

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) // Remove #
      if (hash === 'showcases') {
        setCurrentPage('showcases')
        // Scroll to top when navigating to showcases
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setCurrentPage('home')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    
    // Check initial hash
    handleHashChange()
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Handle escape key for lightbox and terms modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        if (termsModalOpen) setTermsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [lightboxImage, termsModalOpen])

  // Fetch terms when modal opens
  useEffect(() => {
    if (!termsModalOpen) return
    setTermsLoading(true)
    setTermsError(null)
    setTermsContent(null)
    fetch(mcpTermsUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) => {
        setTermsContent(text)
        setTermsError(null)
      })
      .catch(() => {
        setTermsError('Could not load terms.')
        setTermsContent(null)
      })
      .finally(() => setTermsLoading(false))
  }, [termsModalOpen, mcpTermsUrl])

  const SCREENSHOT_COUNT = 4

  function getStepPx(el: HTMLDivElement): number {
    const first = el.querySelector('.screenshot-item') as HTMLElement
    const gap = parseFloat(getComputedStyle(el).gap) || 24
    return first ? first.offsetWidth + gap : 424
  }

  function getCarouselEl(): HTMLDivElement | null {
    return document.getElementById('screenshot-carousel') as HTMLDivElement | null
  }

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const onScroll = () => {
      const step = getStepPx(el)
      const i = step > 0 ? Math.round(el.scrollLeft / step) : 0
      setActiveScreenshot(Math.max(0, Math.min(i, SCREENSHOT_COUNT - 1)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const copyMcpConfig = async () => {
    const configStr = `{
  "mcpServers": {
    "daml-autopilot": {
      "type": "sse",
      "url": "${mcpBaseUrl}?payerParty=YOUR_CANTON_PAYER_PARTY"
    }
  }
}`
    await navigator.clipboard.writeText(configStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const carouselPrev = () => {
    const el = getCarouselEl()
    if (!el) return
    const step = getStepPx(el)
    if (step <= 0) return
    const currentIndex = Math.round(el.scrollLeft / step)
    const prevIndex = Math.max(0, currentIndex - 1)
    const target = prevIndex * step
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  const carouselNext = () => {
    const el = getCarouselEl()
    if (!el) return
    const step = getStepPx(el)
    if (step <= 0) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const currentIndex = Math.round(el.scrollLeft / step)
    const nextIndex = Math.min(SCREENSHOT_COUNT - 1, currentIndex + 1)
    const target = Math.min(maxScroll, nextIndex * step)
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  const canScrollPrev = activeScreenshot > 0
  const canScrollNext = activeScreenshot < SCREENSHOT_COUNT - 1

  const toggleCard = (cardId: string) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  // Show showcases page if navigated there
  if (currentPage === 'showcases') {
    return <Showcases />
  }

  return (
    <div className="container">
      <nav>
        <ul>
          <li><strong>DAML Autopilot</strong></li>
        </ul>
        <ul>
          <li>
            <a href="https://github.com/ChainSafe" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/ChainSafeth" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </li>
          <li>
            <button 
              id="theme-toggle" 
              aria-label="Toggle dark mode"
              onClick={() => {
                const html = document.documentElement;
                const newTheme = isDark ? 'light' : 'dark';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                setIsDark(!isDark);
              }}
            >
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="12" y1="2" x2="12" y2="4"></line>
                  <line x1="12" y1="20" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line>
                  <line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="4" y2="12"></line>
                  <line x1="20" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="6.34" y2="17.66"></line>
                  <line x1="17.66" y1="6.34" x2="19.07" y2="4.93"></line>
                </svg>
              )}
            </button>
          </li>
        </ul>
      </nav>

      <main>
        <section id="home">
          <h1>DAML Autopilot</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 400, margin: '1rem 0', color: 'var(--pico-muted-color)' }}>Precision Tools for Financial Infrastructure</h2>
          <p>
            Developer tools and automation for DAML smart contracts. 
            Built for precision and safety.
          </p>
        </section>

        <section id="products">
          <h2>Our Product Suite</h2>
          <p>
            Open-source tools designed for DAML developers. Reduce setup time, automate testing, 
            and build safer smart contracts with AI-powered analysis and verified canonical patterns.
          </p>
          
          <div className="grid">
            <motion.article 
              className="flip-card"
              onClick={() => toggleCard('ci')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="flip-card-inner"
                animate={{ rotateY: flippedCards.has('ci') ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flip-card-front">
                  <div className="product-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                    </svg>
                  </div>
                  <h3>CI Automation</h3>
                  <ul>
                    <li>Production-ready GitHub Actions for DAML and Canton CI workflows</li>
                    <li>Eliminate manual setup with one-line installations</li>
                    <li>Automate testing with DAML Sandbox environments</li>
                  </ul>
                  <div className="feature-grid">
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="5 12 3 14 5 16"></polyline>
                        <polyline points="9 18 7 20 9 22"></polyline>
                        <polyline points="13 6 11 8 13 10"></polyline>
                        <polyline points="17 12 15 14 17 16"></polyline>
                        <polyline points="21 8 19 10 21 12"></polyline>
                      </svg>
                      <div>
                        <strong>One-line installation</strong>
                        <p>DAML SDK and Canton setup simplified</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2.5 13.5a2.5 2.5 0 0 1 0-3l4.54-5.06A2.5 2.5 0 0 1 9.5 2z"></path>
                        <path d="M21 2l-4 4"></path>
                        <path d="M17 2l4 4"></path>
                      </svg>
                      <div>
                        <strong>Automated testing</strong>
                        <p>Sandbox and LocalNet integration</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                      <div>
                        <strong>CI optimized</strong>
                        <p>Streamlined workflow execution</p>
                      </div>
                    </article>
                  </div>
                  <small className="flip-hint">Click to see technical details →</small>
                </div>
                <div className="flip-card-back">
                  <header>
                    <h4>CI Automation</h4>
                    <p>Production-ready GitHub Actions and workflows for instant DAML development environments</p>
                  </header>
                  <div style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '0.75rem' }}>
                      Skip the setup pain. Drop these workflows into your repository and get automated DAML testing, 
                      builds, and sandbox environments on every push.
                    </p>
                    <p style={{ marginBottom: '0.75rem' }}>
                      <strong>Works standalone</strong> — no MCP required. Perfect for teams who want fast CI/CD 
                      without the learning curve. Clone it, use it, keep it.
                    </p>
                  </div>
                  <figure>
                    <figcaption>One-line setup</figcaption>
                    <pre><code>{`- uses: ChainSafe/canton-ci/.github/actions/install-daml@main`}</code></pre>
                  </figure>
                  <footer>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                      <a 
                        href="https://github.com/ChainSafe/canton-ci" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.875rem' }}
                      >
                        View on GitHub →
                      </a>
                    </div>
                  </footer>
                </div>
              </motion.div>
            </motion.article>

            <motion.article 
              className="flip-card"
              onClick={() => toggleCard('mcp')}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="flip-card-inner"
                animate={{ rotateY: flippedCards.has('mcp') ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="flip-card-front">
                  <div className="product-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                      <path d="M15 13a1 1 0 0 0-3 0c0 .345.157.653.395.864A3.982 3.982 0 0 1 12 16a3.982 3.982 0 0 1-.395-2.136A1 1 0 0 0 9 13"></path>
                      <path d="M18 12h1"></path>
                      <path d="M5 12h1"></path>
                      <path d="M12 2v1"></path>
                    </svg>
                  </div>
                  <h3>DAML MCP Server</h3>
                  <ul>
                    <li>AI-powered DAML development assistant with progressive context building</li>
                    <li>Access 3,667+ verified canonical patterns with semantic similarity search</li>
                    <li>LLM-based authorization model extraction and code analysis</li>
                  </ul>
                  <div className="feature-grid">
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <path d="M9 12l2 2 4-4"></path>
                      </svg>
                      <div>
                        <strong>Progressive analysis</strong>
                        <p>Client-orchestrated compilation and LLM reasoning</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        <path d="M8 7h6"></path>
                        <path d="M8 11h6"></path>
                        <path d="M8 15h4"></path>
                      </svg>
                      <div>
                        <strong>Canonical resources</strong>
                        <p>3,667+ verified patterns</p>
                      </div>
                    </article>
                    <article>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                      <div>
                        <strong>Authorization extraction</strong>
                        <p>LLM-powered security analysis</p>
                      </div>
                    </article>
                  </div>
                  <small className="flip-hint">Click to see technical details →</small>
                </div>
                <div className="flip-card-back">
                  <header>
                    <h4>DAML MCP Server</h4>
                    <p>AI-powered development assistant built for the vibe coding era</p>
                  </header>
                  
                  <figure className="tool-highlight">
                    <figcaption>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                        <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                        <path d="M15 13a1 1 0 0 0-3 0c0 .345.157.653.395.864A3.982 3.982 0 0 1 12 16a3.982 3.982 0 0 1-.395-2.136A1 1 0 0 0 9 13"></path>
                        <path d="M18 12h1"></path>
                        <path d="M5 12h1"></path>
                        <path d="M12 2v1"></path>
                      </svg>
                      DAML Reason
                    </figcaption>
                    <p>
                      Searches 3,667+ canonical patterns, analyzes authorization models, and reasons about safety. 
                      Progressive context building means <strong>no hallucinations</strong> — it only analyzes what it can actually see.
                    </p>
                  </figure>

                  <figure className="tool-highlight">
                    <figcaption>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}>
                        <path d="M12 8V4H8"></path>
                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                        <path d="M2 14h2"></path>
                        <path d="M20 14h2"></path>
                        <path d="M15 13v2"></path>
                        <path d="M9 13v2"></path>
                      </svg>
                      DAML Automater
                    </figcaption>
                    <p>
                      Guides you through environments, CI/CD, and builds. Client-side orchestration 
                      keeps you in control — no surprises, just instructions.
                    </p>
                  </figure>

                  <small style={{ display: 'block', textAlign: 'left', fontStyle: 'italic', marginTop: 'auto', paddingTop: 'calc(var(--pico-spacing) * 1)' }}>
                    We take precautions, not shortcuts. No guarantees of safe code, but honest analysis you can trust.
                  </small>
                </div>
              </motion.div>
            </motion.article>
          </div>

          <div className="mcp-install-section">
            <div className="mcp-install-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                <path d="M15 13a1 1 0 0 0-3 0c0 .345.157.653.395.864A3.982 3.982 0 0 1 12 16a3.982 3.982 0 0 1-.395-2.136A1 1 0 0 0 9 13"></path>
                <path d="M18 12h1"></path>
                <path d="M5 12h1"></path>
                <path d="M12 2v1"></path>
              </svg>
              <h3>Install MCP Server</h3>
            </div>
            <p>Add to your <code>~/.cursor/mcp.json</code> file. Include your Canton payer party in the URL so the server knows who you are:</p>
            <div className="mcp-config-standalone">
              <SyntaxHighlighter
                language="json"
                style={isDark ? vscDarkPlus : oneLight}
                customStyle={{
                  margin: 0,
                  padding: 'calc(var(--pico-spacing) * 1)',
                  paddingRight: 'calc(var(--pico-spacing) * 6)',
                  background: 'transparent',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: 'var(--pico-font-family-monospace)',
                  }
                }}
              >
                {`{
  "mcpServers": {
    "daml-autopilot": {
      "type": "sse",
      "url": "${mcpBaseUrl}?payerParty=YOUR_CANTON_PAYER_PARTY"
    }
  }
}`}
              </SyntaxHighlighter>
              <p className="mcp-config-note">Replace <code>YOUR_CANTON_PAYER_PARTY</code> with your Canton payer party (e.g. <code>x402-test-signer::0x...</code>).</p>
              <p className="mcp-terms-notice">
                Use of the MCP server is subject to our{' '}
                <button type="button" className="mcp-terms-link" onClick={() => setTermsModalOpen(true)}>Service terms</button>.
              </p>
              <button 
                className="copy-btn-standalone" 
                onClick={copyMcpConfig}
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section id="demo-apps">
          <h2>Built with DAML Autopilot</h2>
          <p>
            Real applications generated by our MCP tools in a single chat session. 
            See the quality and completeness of AI-assisted DAML development.
          </p>
          
          <div style={{ 
            padding: 'calc(var(--pico-spacing) * 2)',
            border: '1px solid transparent',
            borderRadius: 'var(--pico-border-radius)',
            background: `
              linear-gradient(var(--pico-background-color), var(--pico-background-color)) padding-box,
              linear-gradient(135deg, 
                rgba(59, 130, 246, 0.3) 0%,
                rgba(147, 51, 234, 0.3) 50%,
                rgba(59, 130, 246, 0.3) 100%
              ) border-box
            `,
            boxShadow: `
              0 0 0 1px rgba(59, 130, 246, 0.1),
              0 0.25rem 1rem rgba(59, 130, 246, 0.15)
            `,
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div className="grid" style={{ gap: 'calc(var(--pico-spacing) * 1.5)', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto calc(var(--pico-spacing) * 0.5) auto', color: 'var(--pico-primary)' }}>
                  <circle cx="9" cy="12" r="1"></circle>
                  <circle cx="15" cy="12" r="1"></circle>
                  <path d="M8 20v-5h8v5"></path>
                  <path d="M6 12v-1a6 6 0 1 1 12 0v1"></path>
                </svg>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'calc(var(--pico-spacing) * 0.5)' }}>Asset Swap</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', marginBottom: 0 }}>
                  Generic atomic swaps for any DAML contract type
                </p>
              </div>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto calc(var(--pico-spacing) * 0.5) auto', color: 'var(--pico-primary)' }}>
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'calc(var(--pico-spacing) * 0.5)' }}>Fixed Rate Bonds</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', marginBottom: 0 }}>
                  Complete bond lifecycle with coupon payments
                </p>
              </div>
              <div>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto calc(var(--pico-spacing) * 0.5) auto', color: 'var(--pico-primary)' }}>
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                  <path d="M16 16h5v5"></path>
                </svg>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'calc(var(--pico-spacing) * 0.5)' }}>Asset Options</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', marginBottom: 0 }}>
                  Buy assets at strike prices before expiry
                </p>
              </div>
            </div>
            
            <div style={{ marginTop: 'calc(var(--pico-spacing) * 1.5)' }}>
              <a 
                href="#showcases" 
                role="button"
                style={{ 
                  display: 'inline-block'
                }}
              >
                See What We Built →
              </a>
              <p style={{ fontSize: '0.85rem', color: 'var(--pico-muted-color)', marginTop: '0.5rem', marginBottom: 0 }}>
                Full applications generated in one chat session
              </p>
            </div>
          </div>
        </section>

        <section id="screenshots">
          <h2>See It In Action</h2>
          <p>
            Real examples of DAML Autopilot tools helping developers build safer smart contracts.
          </p>
          <p className="carousel-hint">Scroll or swipe to see more</p>
          
          <div id="screenshot-carousel" className="screenshot-carousel" ref={carouselRef}>
            <figure 
              className="screenshot-item"
              onClick={() => setLightboxImage({ 
                src: '/screenshots/screenshot-1.png', 
                caption: 'DAML Reason analyzing authorization patterns' 
              })}
            >
              <img src="/screenshots/screenshot-1.png" alt="DAML Reason analyzing code" loading="lazy" />
              <figcaption>DAML Reason analyzing authorization patterns</figcaption>
            </figure>
            <figure 
              className="screenshot-item"
              onClick={() => setLightboxImage({ 
                src: '/screenshots/screenshot-2.png', 
                caption: 'DAML Automater guiding environment setup' 
              })}
            >
              <img src="/screenshots/screenshot-2.png" alt="DAML Automater providing guidance" loading="lazy" />
              <figcaption>DAML Automater guiding environment setup</figcaption>
            </figure>
            <figure 
              className="screenshot-item"
              onClick={() => setLightboxImage({ 
                src: '/screenshots/screenshot-3.png', 
                caption: 'Semantic search finding similar patterns' 
              })}
            >
              <img src="/screenshots/screenshot-3.png" alt="Semantic pattern search results" loading="lazy" />
              <figcaption>Semantic search finding similar patterns</figcaption>
            </figure>
            <figure 
              className="screenshot-item"
              onClick={() => setLightboxImage({ 
                src: '/screenshots/screenshot-4.png', 
                caption: 'Zero shot a kids allowance app' 
              })}
            >
              <img src="/screenshots/screenshot-4.png" alt="Progressive context building" loading="lazy" />
              <figcaption>Zero shot a kids allowance app</figcaption>
            </figure>
          </div>
          
          <div className="scroll-indicators">
            <button
              type="button"
              className="carousel-arrow carousel-prev"
              onClick={carouselPrev}
              disabled={!canScrollPrev}
              aria-label="Previous screenshot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-next"
              onClick={carouselNext}
              disabled={!canScrollNext}
              aria-label="Next screenshot"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </section>

        {lightboxImage && (
          <div className="lightbox" onClick={() => setLightboxImage(null)}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img src={lightboxImage.src} alt={lightboxImage.caption} />
              <p className="lightbox-caption">{lightboxImage.caption}</p>
            </div>
          </div>
        )}

        <section id="contact">
          <h2>About</h2>
          <p>
            DAML Autopilot provides precision tools for DAML smart contract development. 
            We combine AI-powered analysis with canonical pattern matching to help developers 
            build safer, more maintainable DAML applications.
          </p>
          <p>
            Built by <a href="https://chainsafe.io/" target="_blank" rel="noopener noreferrer">ChainSafe</a>, bringing protocol 
            engineering expertise from Ethereum, Polkadot, and Filecoin to the DAML ecosystem.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--pico-muted-color)', marginTop: '1.5rem', fontStyle: 'italic' }}>
            Open-source repositories available on GitHub.
          </p>
        </section>
      </main>

      <footer>
        <small>
          &copy; 2026 DAML Autopilot.{' '}
          <button type="button" className="footer-terms-link" onClick={() => setTermsModalOpen(true)}>Service terms</button>
        </small>
      </footer>

      {termsModalOpen && (
        <div className="terms-modal-overlay" onClick={() => setTermsModalOpen(false)}>
          <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="terms-modal-header">
              <h3>Service terms</h3>
              <button type="button" className="terms-modal-close" onClick={() => setTermsModalOpen(false)} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="terms-modal-body">
              {termsLoading && <p className="terms-modal-loading">Loading…</p>}
              {termsError && (
                <p className="terms-modal-fallback">
                  Please review the service terms on the Canton MCP Server directly.{' '}
                  <a href={mcpTermsUrl} target="_blank" rel="noopener noreferrer">View terms</a>
                </p>
              )}
              {termsContent && (
                <>
                  <pre className="terms-modal-content">{termsContent}</pre>
                  <p className="terms-modal-source">
                    <a href={mcpTermsUrl} target="_blank" rel="noopener noreferrer">View terms on Canton MCP Server</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
