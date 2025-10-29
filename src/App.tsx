import { useState } from 'react'
import './App.css'

function App() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())

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

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">Cantonware</div>
          <nav className="nav">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container">
            <h1 className="hero-title">Precision Tools for Financial Infrastructure</h1>
            <p className="hero-subtitle">
              Production-ready developer tools and automation for DAML smart contracts and Canton blockchain. 
              Built by Cantonware, a joint venture between ChainSafe and Round13.
            </p>
          </div>
        </section>

        <section id="products" className="products">
          <div className="container">
            <h2 className="section-title">Our Products</h2>
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#6b7280', maxWidth: '800px', margin: '0 auto 48px', lineHeight: '1.6' }}>
              Open-source tools designed for DAML and Canton developers. Reduce setup time, automate testing, 
              and build safer smart contracts with verified patterns and compiler-integrated validation.
            </p>
            
            <div className="product-grid">
              <div 
                className={`flip-card ${flippedCards.has('ci') ? 'flipped' : ''}`}
                onClick={() => toggleCard('ci')}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front product-card">
                    <div className="product-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <h3 className="product-title">CI Automation</h3>
                    <p className="product-description">
                      Production-ready GitHub Actions for DAML and Canton CI workflows. Eliminate manual setup with 
                      one-line installations. Automate testing with DAML Sandbox and Canton LocalNet participant nodes.
                    </p>
                    <div className="product-features-grid">
                      <div className="feature-item">
                        <div className="feature-icon">⚡</div>
                        <div>
                          <div className="feature-title">One-line installation</div>
                          <div className="feature-desc">DAML SDK and Canton setup simplified</div>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">🧪</div>
                        <div>
                          <div className="feature-title">Automated testing</div>
                          <div className="feature-desc">Sandbox and LocalNet integration</div>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">🚀</div>
                        <div>
                          <div className="feature-title">CI optimized</div>
                          <div className="feature-desc">Streamlined workflow execution</div>
                        </div>
                      </div>
                    </div>
                    <div className="flip-hint">Click to see technical details →</div>
                  </div>
                  <div className="flip-card-back product-card">
                    <div className="tech-header">
                      <h4 className="tech-title">canton-ci</h4>
                      <div className="tech-subtitle">GitHub Actions for DAML and Canton CI workflows</div>
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Install DAML SDK</div>
                      <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`- uses: ChainSafe/canton-ci/.github/actions/install-daml@main
  with:
    sdk_version: "3.4.0-snapshot.20251013.0"`}</code>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Run DAML tests</div>
                      <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`daml_ci:
  uses: ChainSafe/canton-ci/.github/workflows/daml-ci.yaml@main`}</code>
                    </div>
                    <a 
                      href="https://github.com/ChainSafe/canton-ci" 
                      className="product-link tech-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub →
                    </a>
                    <div className="flip-hint" style={{ marginTop: '1rem' }}>Click to flip back</div>
                  </div>
                </div>
              </div>

              <div 
                className={`flip-card ${flippedCards.has('mcp') ? 'flipped' : ''}`}
                onClick={() => toggleCard('mcp')}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front product-card">
                    <div className="product-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </div>
                    <h3 className="product-title">Canton MCP Server</h3>
                    <p className="product-description">
                      DAML-safe by construction development platform with AI-powered assistance. Access 3,667+ verified 
                      canonical resources. Validate code with compiler integration and formal verification.
                    </p>
                    <div className="product-features-grid">
                      <div className="feature-item">
                        <div className="feature-icon">🛡️</div>
                        <div>
                          <div className="feature-title">Code validation</div>
                          <div className="feature-desc">Compiler-integrated safety checks</div>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">📚</div>
                        <div>
                          <div className="feature-title">Canonical resources</div>
                          <div className="feature-desc">3,667+ verified patterns</div>
                        </div>
                      </div>
                      <div className="feature-item">
                        <div className="feature-icon">🔍</div>
                        <div>
                          <div className="feature-title">Debug assistance</div>
                          <div className="feature-desc">Authorization pattern recommendations</div>
                        </div>
                      </div>
                    </div>
                    <div className="flip-hint">Click to see technical details →</div>
                  </div>
                  <div className="flip-card-back product-card">
                    <div className="tech-header">
                      <h4 className="tech-title">canton-mcp-server</h4>
                      <div className="tech-subtitle">MCP server for DAML code validation and authorization pattern recommendations</div>
                    </div>
                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start server</div>
                      <code style={{ color: '#111827', display: 'block', whiteSpace: 'pre-wrap' }}>{`docker-compose up -d
# Server: http://localhost:7284/mcp`}</code>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}>
                      <div style={{ marginBottom: '1rem', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Available tools</div>
                      <code style={{ color: '#111827', display: 'block' }}>validate_daml_business_logic</code>
                      <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>debug_authorization_failure</code>
                      <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>suggest_authorization_pattern</code>
                      <code style={{ color: '#111827', display: 'block', marginTop: '0.5rem' }}>recommend_canonical_resources</code>
                    </div>
                    <a 
                      href="https://github.com/ChainSafe/canton-mcp-server" 
                      className="product-link tech-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on GitHub →
                    </a>
                    <div className="flip-hint" style={{ marginTop: '1rem' }}>Click to flip back</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2 className="section-title">Get Started</h2>
            <p className="contact-text">
              Cantonware is a joint venture between ChainSafe and Round13, building precision tools 
              for the financial industry. Both tools are production-ready and available now.
            </p>
            <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '700px', margin: '1rem auto 0', lineHeight: '1.6' }}>
              ChainSafe brings protocol engineering expertise from Ethereum, Polkadot, and Filecoin. 
              Round13 provides Web3 infrastructure investment. Together, we're accelerating Canton ecosystem growth 
              through developer tooling and blockchain infrastructure.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <a 
                href="https://github.com/ChainSafe/canton-ci" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                canton-ci
              </a>
              <a 
                href="https://github.com/ChainSafe/canton-mcp-server" 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                canton-mcp-server
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Cantonware. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
